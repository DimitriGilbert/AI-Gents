import { z } from "zod";

export type CliField = {
  name: string;
  label: string;
  type: "text" | "switch" | "multi-select" | "select";
  required: boolean;
  defaultValue?: string | boolean | string[];
  options?: { value: string; label: string }[];
  isPositional?: boolean;
  description?: string;
};

// Helper function to extract default value and handle array defaults
function extractDefaultValue(line: string): string | string[] | undefined {
  const defaultMatch = /\[default: '([^']+)'\]/.exec(line);
  if (defaultMatch) {
    const defaultValue = defaultMatch[1]?.trim() ?? "";
    if (defaultValue.startsWith("(") && defaultValue.endsWith(")")) {
      return defaultValue
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
    return defaultValue;
  }
  return undefined;
}

// Helper to parse choices from help text
function parseChoices(line: string): string[] | undefined {
  // Match choices like [one of 'ask' 'chat' 'create' 'list']
  // The pattern matches: [one of 'value1' 'value2' 'value3']
  const choicesMatch = /\[one of ((?:'[^']+'\s*)+)\]/.exec(line);
  if (choicesMatch) {
    // Extract all quoted strings from the captured group
    const allQuotes = choicesMatch[1]?.match(/'([^']+)'/g);
    if (allQuotes) {
      return allQuotes.map(q => q.slice(1, -1));
    }
  }
  return undefined;
}

export function parseHelpSchema(helpText: string): {
  fields: CliField[];
  schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
  defaultValues: Record<string, unknown>;
} {
  const fields: CliField[] = [];
  const lines = helpText.split("\n");

  for (const line of lines) {
    if (!line.trim() || line.includes("Usage:")) continue;

    const field: Partial<CliField> = { type: "text" };

    // Skip if this is an alias definition or the no-aliases case
    if (line.includes("no-aliases")) {
      continue;
    }

    // Extract description from the line
    const description = line.split(":").slice(1).join(":").trim();
    if (description) {
      field.description = description
        .replace(/\[default: '[^']+'\]/, "") // Remove default value
        .replace(/\(use --[^)]+\)/, "") // Remove boolean usage hints
        .replace(/\[one of '[^']+'\]/, "") // Remove choices indicator
        .trim();
    }

    // Handle positional arguments (not starting with --)
    if (/^\s*[a-zA-Z0-9_-]+\s*:\s*.+$/.exec(line) && !line.startsWith("--") && !line.includes("--")) {
      const [namePart] = line.split(":");
      field.name = namePart?.trim() ?? "";
      field.type = "text";
      field.isPositional = true;
      field.required = true;
      field.defaultValue = extractDefaultValue(line);
      field.label = field.name;
      
      // Check for choices in positional args
      const choices = parseChoices(line);
      if (choices) {
        field.type = "select";
        field.options = choices.map(c => ({ value: c, label: c }));
      }
    }
    // Check for fields with both --option and <value> syntax
    else if (/--[\w-]+(\|--[\w-]+)?\s<[\w-]+>/.exec(line)) {
      const [namePart] = line.split(":");
      const names = /(-\w, )?--[\w-]+/.exec(namePart ?? "")?.[0].split(/,\s+/);
      const longName = names
        ?.find((n) => n.startsWith("--"))
        ?.replace("--", "");

      field.name = longName ?? "";
      field.label = longName ?? "";
      
      // Check for choices in optional args
      const optChoices = parseChoices(line);
      if (optChoices) {
        field.type = "select";
        field.options = optChoices.map(c => ({ value: c, label: c }));
      } else if (line.includes("repeatable")) {
        field.type = "multi-select";
        field.defaultValue = [];
      } else {
        field.type = "text";
      }
      field.defaultValue = extractDefaultValue(line) ?? (field.type === "multi-select" ? [] : "");
    }
    // Handle boolean fields
    else if (/--[\w-]+(\|--no-[\w-]+)?/.exec(line)) {
      const flag = /--[\w-]+(\|--no-[\w-]+)?/.exec(line)?.[0];
      const mainFlag = flag?.split("|")[0]?.replace("--", "") ?? "";

      field.name = mainFlag;
      field.label = mainFlag;
      field.type = "switch";
      if (line.includes("on by default")) {
        field.defaultValue = true;
      } else {
        field.defaultValue = false;
      }
    }
    // Check for other fields
    else if (/--[\w-]+/.exec(line)) {
      const flag = /--[\w-]+/.exec(line)?.[0];
      field.name = flag?.replace("--", "") ?? "";
      field.label = field.name;
      
      // Check for choices
      const otherChoices = parseChoices(line);
      if (otherChoices) {
        field.type = "select";
        field.options = otherChoices.map(c => ({ value: c, label: c }));
      } else {
        field.type = "text";
      }
      field.defaultValue = extractDefaultValue(line) ?? "";
    }

    if (field.name) {
      fields.push(field as CliField);
    }
  }

  // Build Zod schema
  const shape: Record<string, z.ZodTypeAny> = {};
  const defaultValues: Record<string, unknown> = {};

  for (const field of fields) {
    let validator: z.ZodTypeAny;

    switch (field.type) {
      case "switch":
        validator = z.boolean();
        break;
      case "multi-select":
        validator = z.array(z.string());
        break;
      case "select":
        validator = field.options 
          ? z.enum(field.options.map(o => o.value) as [string, ...string[]])
          : z.string();
        break;
      case "text":
      default:
        validator = field.required && !field.isPositional
          ? z.string().min(1, { message: "This field is required" })
          : z.string();
        break;
    }

    shape[field.name] = validator;
    defaultValues[field.name] = field.defaultValue ?? (field.type === "switch" ? false : field.type === "multi-select" ? [] : "");
  }

  return {
    fields,
    schema: z.object(shape),
    defaultValues,
  };
}

// Generate CLI command string from form values
export function generateCommand(
  values: Record<string, unknown>,
  fields: CliField[],
  baseCmd?: string
): string {
  const cmdParts: string[] = baseCmd ? [baseCmd] : [];

  // Add positional arguments first
  fields
    .filter((field) => field.isPositional)
    .forEach((field) => {
      const value = values[field.name];
      if (value && typeof value === "string" && value.trim()) {
        cmdParts.push(value.trim());
      }
    });

  // Add other arguments
  fields
    .filter((field) => !field.isPositional)
    .forEach((field) => {
      const value = values[field.name];
      if (value === undefined || value === null) return;

      if (field.type === "switch") {
        const boolValue = value as boolean;
        const defaultValue = field.defaultValue as boolean ?? false;
        if (boolValue !== defaultValue) {
          if (boolValue) {
            cmdParts.push(`--${field.name}`);
          } else {
            cmdParts.push(`--no-${field.name}`);
          }
        }
      } else if (field.type === "multi-select") {
        const arrayValue = value as string[];
        if (Array.isArray(arrayValue) && arrayValue.length > 0) {
          arrayValue.forEach((item: string) => {
            cmdParts.push(`--${field.name} ${item}`);
          });
        }
      } else if (field.type === "select" || field.type === "text") {
        const stringValue = value as string;
        const defaultValue = field.defaultValue as string | undefined;
        if (stringValue && stringValue !== defaultValue) {
          cmdParts.push(`--${field.name} ${stringValue}`);
        }
      }
    });

  return cmdParts.join(" ");
}

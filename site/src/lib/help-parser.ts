type FormField = {
  name: string;
  label: string;
  type: "string" | "boolean" | "select" | "array";
  required: boolean;
  defaultValue?: string | boolean | string[];
  choices?: string[];
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

export function parseHelp(helpText: string): FormField[] {
  const fields: FormField[] = [];
  const lines = helpText.split("\n");

  for (const line of lines) {
    if (!line.trim() || line.includes("Usage:")) continue;

    const field: Partial<FormField> = { type: "string" };

    // Skip if this is an alias definition or the no-aliases case
    if (line.includes("no-aliases")) {
      continue;
    }

    // Extract description from the line
    const description = line.split(":").slice(1).join(":").trim();
    if (description) {
      field.description = description
        .replace(/\[default: '[^']+'\]/, '') // Remove default value
        .replace(/\(use --[^)]+\)/, '') // Remove boolean usage hints
        .trim();
    }

    // Handle positional arguments
    if (/^\s*[a-zA-Z0-9_-]+\s*:\s*.+$/.exec(line) && !line.startsWith("--")) {
      const [namePart] = line.split(":");
      field.name = namePart?.trim() ?? "";
      field.type = "string";
      field.isPositional = true;
      field.required = true;
      field.defaultValue = extractDefaultValue(line);
    }
    // Check for fields with both --option and <value> syntax first
    else if (/--[\w-]+(\|--[\w-]+)?\s<[\w-]+>/.exec(line)) {
      const [namePart] = line.split(":");
      const names = /(-\w, )?--[\w-]+/.exec(namePart ?? '')?.[0].split(/,\s+/);
      const longName = names
        ?.find((n) => n.startsWith("--"))
        ?.replace("--", "");

      field.name = longName ?? "";
      field.type = line.includes("repeatable") ? "array" : "string";
      field.defaultValue = extractDefaultValue(line);
    }
    // Handle boolean fields
    else if (/--[\w-]+(\|--no-[\w-]+)?/.exec(line)) {
      const flag = /--[\w-]+(\|--no-[\w-]+)?/.exec(line)?.[0];
      const mainFlag = flag?.split("|")[0]?.replace("--", "") ?? "";

      field.name = mainFlag;
      field.type = "boolean";
      if (line.includes("on by default") || !line.includes("off by default")) {
        field.defaultValue = true;
      } else {
        field.defaultValue = false;
      }
    }
    // Check for other fields
    else if (/--[\w-]+/.exec(line)) {
      const flag = /--[\w-]+/.exec(line)?.[0];
      field.name = flag?.replace("--", "") ?? "";
      field.type = "string";
      field.defaultValue = extractDefaultValue(line);
    }
    // Check for positional arguments with choices
    else if (line.includes("<target>")) {
      const match = /: '([^']+)'\]/.exec(line);
      field.name = "target";
      field.type = "select";
      field.required = true;
      if (match) field.choices = match[1]?.split("' '") ?? [];
    }
    // Handle name positional argument
    else if (/^\s*name\s*:\s*.+/.exec(line)) {
      field.name = "name";
      field.type = "string";
      field.isPositional = true;
      field.required = true;
    }

    if (field.name) {
      fields.push(field as FormField);
    }
  }

  return fields;
}

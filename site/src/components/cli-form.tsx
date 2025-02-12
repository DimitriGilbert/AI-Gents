"use client";
import { useForm, type FieldValues } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { FormFieldComponent } from "./form-field";
import { parseHelp } from "~/lib/help-parser";
import { cn } from "~/lib/utils";
import { type FormFieldType } from "./form-field";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CliFormProps {
  helpText: string;
  onSubmit?: (data: FieldValues, cmd: string) => void;
  baseCmd?: string;
  columns?: number;
  maxHeight?: string | number;
  fieldClassName?: string;
}

interface FormField {
  name: string;
  type: "string" | "boolean" | "array" | "select";
  required?: boolean;
  defaultValue?: unknown;
  isPositional?: boolean;
  description?: string;
}

const createFormSchema = (fields: FormField[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let validator: z.ZodTypeAny;

    switch (field.type) {
      case "boolean":
        validator = field.required ? z.boolean() : z.boolean().optional();
        break;
      case "array":
        validator = z.string();
        if (!field.required) {
          validator = validator.optional();
        }
        break;
      case "select":
      case "string":
      default:
        validator = field.required
          ? z.string().min(1, { message: "This field is required" })
          : z.string().optional();
        break;
    }

    shape[field.name] = validator;
  });

  return z.object(shape);
};

export function CliForm({
  helpText,
  onSubmit,
  baseCmd,
  columns = 1,
  maxHeight,
  fieldClassName,
}: CliFormProps) {
  const fields = parseHelp(helpText);
  const formSchema = createFormSchema(fields);

  const form = useForm<FieldValues>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.defaultValue ?? "",
      }),
      {},
    ),
  });

  const iOnSubmit = (data: FieldValues) => {
    const cmdParts: string[] = [baseCmd ?? ""];

    // Add positional arguments first
    fields
      .filter((field) => field.isPositional)
      .forEach((field) => {
        const value = data[field.name] as string | undefined;
        if (value) {
          cmdParts.push(value);
        }
      });

    // Add other arguments
    fields
      .filter((field) => !field.isPositional)
      .forEach((field) => {
        let value = data[field.name] as
          | string
          | string[]
          | boolean
          | undefined;
        if (value === undefined || value === null) return;

        if (field.type === "boolean") {
          if (value !== field.defaultValue) {
            if (value) {
              cmdParts.push(`--${field.name}`);
            } else {
              cmdParts.push(`--no-${field.name}`);
            }
          }
        } else if (field.type === "array") {
          if (typeof value === "string") {
            value = value.split(",").filter((item: string) => item !== "").map((item: string) => item.trim());
          }
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((item: string) => {
              cmdParts.push(`--${field.name} ${item}`);
            });
          }
        } else if (field.type === "select" || field.type === "string") {
          if (value !== field.defaultValue && value) {
            cmdParts.push(`--${field.name} ${value as string}`);
          }
        }
      });

    const cmd = cmdParts.join(" ");
    onSubmit?.(data, cmd);
  };

  // Sort fields to ensure positional arguments come first
  const sortedFields = fields.sort((a, b) => {
    if (a.isPositional) return -1;
    if (b.isPositional) return 1;
    return 0;
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(iOnSubmit)}
        className={cn(
          "space-y-6",
          columns > 1 && `grid grid-cols-1 md:grid-cols-${columns} gap-6`,
        )}
        style={{
          maxHeight: maxHeight
            ? typeof maxHeight === "number"
              ? `${maxHeight}px`
              : maxHeight
            : undefined,
          overflowY: maxHeight ? "auto" : undefined,
        }}
      >
        <div
          className="col-span-full"
        >
          <Button type="submit">as command</Button>
        </div>
        {sortedFields.map((field, index) => (
          <FormFieldComponent
            key={`${field.name}-${index}`}
            field={field as FormFieldType}
            control={form.control}
            className={fieldClassName}
            description={field.description}
          />
        ))}
        <div
          className="col-span-full"
        >
          <Button type="submit">as command</Button>
        </div>
      </form>
    </Form>
  );
}

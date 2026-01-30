"use client";

import { useFormedible } from "~/hooks/use-formedible";
import { parseHelpSchema, generateCommand, type CliField } from "~/lib/cli-schema-generator";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { toast } from "sonner";
import React from "react";

interface CliFormProps {
  helpText: string;
  onSubmit?: (data: Record<string, unknown>, cmd: string) => void;
  baseCmd?: string;
  columns?: number;
  maxHeight?: string | number;
  fieldClassName?: string;
}

// Convert CLI fields to FormEdible field config
function convertToFormedibleFields(fields: CliField[]) {
  return fields.map((field) => {
    const baseField = {
      name: field.name,
      label: field.label,
      description: field.description,
    };

    switch (field.type) {
      case "switch":
        return {
          ...baseField,
          type: "switch" as const,
        };
      case "multi-select":
        return {
          ...baseField,
          type: "multi-select" as const,
          multiSelectConfig: {
            maxSelections: 100,
            searchable: true,
          },
        };
      case "select":
        return {
          ...baseField,
          type: "select" as const,
          options: field.options ?? [],
        };
      case "text":
      default:
        return {
          ...baseField,
          type: "text" as const,
        };
    }
  });
}

export function CliForm({
  helpText,
  onSubmit,
  baseCmd,
  columns = 2,
  maxHeight,
  fieldClassName,
}: CliFormProps) {
  const { fields, schema, defaultValues } = React.useMemo(
    () => parseHelpSchema(helpText),
    [helpText]
  );

  const formedibleFields = React.useMemo(
    () => convertToFormedibleFields(fields),
    [fields]
  );

  const { Form } = useFormedible({
    schema,
    fields: formedibleFields,
    layout: columns > 1 ? {
      type: "grid" as const,
      columns,
      gap: "6",
    } : undefined,
    formOptions: {
      defaultValues,
      onSubmit: async ({ value }) => {
        const cmd = generateCommand(value, fields, baseCmd);
        onSubmit?.(value, cmd);
        
        // Copy to clipboard automatically
        try {
          await navigator.clipboard.writeText(cmd);
          toast.success("Command copied to clipboard!", {
            description: cmd,
            duration: 2000,
          });
        } catch {
          toast.error("Failed to copy to clipboard");
        }
      },
    },
    submitLabel: "Generate Command",
    showSubmitButton: true,
    fieldClassName,
  });

  return (
    <div
      className={cn("w-full p-6", fieldClassName)}
      style={{
        maxHeight: maxHeight
          ? typeof maxHeight === "number"
            ? `${maxHeight}px`
            : maxHeight
          : undefined,
        overflowY: maxHeight ? "auto" : undefined,
      }}
    >
      <Form />
    </div>
  );
}

import { type Control, type FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Switch } from '~/components/ui/switch';

// Add 'export' to the interface declaration
export interface FormFieldType {
  name: string;
  type: string;
  label?: string;
  choices?: string[];
  required?: boolean;
  defaultValue?: string | boolean | string[];
  isPositional?: boolean;
  className?: string;
  description?: string;
}

export function FormFieldComponent({ field, control, className, description }: {
  field: FormFieldType;
  control: Control<FieldValues>;
  className?: string;
  description?: string;
}) {
  const frmLabel = field.label ?? field.name + (field.type === 'array' ? ' (comma separated list)' : '');
  
  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={className}>
          <FormLabel className='px-2'>{frmLabel}</FormLabel>
          {field.type === 'boolean' ? (
            <FormControl>
              <Switch
                checked={(formField.value as boolean) ?? false}
                onCheckedChange={formField.onChange}
              />
            </FormControl>
          ) : field.type === 'select' ? (
            <Select onValueChange={formField.onChange} defaultValue={(formField.value as string) ?? ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {field.choices?.map((choice) => (
                  <SelectItem key={choice} value={choice}>
                    {choice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.type === 'array' ? (
            <Input
              {...formField}
              value={Array.isArray(formField.value) ? formField.value.join(',') : (formField.value as string)}
            />
          ) : field.type === 'string' || field.isPositional ? (
            <Input
              {...formField}
              value={(formField.value as string) ?? ''}
              placeholder={field.label ?? field.name}
            />
          ) : (
            <Input {...formField} value={(formField.value as string) ?? ''} />
          )}
          <FormDescription className='px-2'>
            {field.required && 'Required, '}
            {field.choices && `Options: ${field.choices.join(', ')}.`}
            {description && description}
          </FormDescription>
        </FormItem>
      )}
    />
  );
} 
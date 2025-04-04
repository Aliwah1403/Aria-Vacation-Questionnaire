import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  formName: z.string().min(2, {
    message: "Form Name must be at least 2 characters.",
  }),
  formDescription: z.string().min(10, {
    message: "Form Description must be at least 10 characters.",
  }),
  formCode: z.string(),
});

const FormTypeForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formName: "",
      formDescription: "",
      formCode: "",
    },
  });

  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");

  useEffect(() => {
    const formatted = formName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .trim();

    setFormCode(formatted);
    form.setValue("formCode", formatted);
  }, [formName, form]);

  function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="formName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Form Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="New Form"
                  {...field}
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="formCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Form Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={formCode}
                  disabled
                  className="bg-gray-50"
                />
              </FormControl>
              <FormDescription>Auto-generated from form name</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="formDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Form Description</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>

              <FormDescription>
                Provide a brief description of your form. This will help you and
                others understand what your form is for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button
            type="submit"
            className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormTypeForm;

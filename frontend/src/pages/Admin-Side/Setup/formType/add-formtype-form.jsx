"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const FormTypeForm = ({ onSubmit, onCancel, initialData }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formName: initialData?.formName || "",
      formDescription: initialData?.formDescription || "",
      formCode: initialData?.formCode || "",
    },
  });

  const [formName, setFormName] = useState(initialData?.formName || "");
  const [formCode, setFormCode] = useState(initialData?.formCode || "");

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormName(initialData.formName || "");
      setFormCode(initialData.formCode || "");
      form.reset({
        formName: initialData.formName || "",
        formDescription: initialData.formDescription || "",
        formCode: initialData.formCode || "",
      });
    }
  }, [initialData, form]);

  // Generate form code from form name if not editing
  useEffect(() => {
    if (!initialData) {
      const formatted = formName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .trim();

      setFormCode(formatted);
      form.setValue("formCode", formatted);
    }
  }, [formName, form, initialData]);

  const handleSubmit = async (values) => {
    try {
      await onSubmit({
        formName: values.formName,
        formDescription: values.formDescription,
        formCode: values.formCode,
      });
      if (!initialData) {
        form.reset();
        setFormName("");
        setFormCode("");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
        id="add-form-type"
      >
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
                  disabled={true}
                  onChange={(e) => {
                    setFormCode(e.target.value);
                    field.onChange(e);
                  }}
                  className={initialData ? "" : "bg-gray-50"}
                />
              </FormControl>
              <FormDescription>
                {initialData
                  ? "You can edit the form code when updating"
                  : "Auto-generated from form name"}
              </FormDescription>
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
      </form>
    </Form>
  );
};

export default FormTypeForm;

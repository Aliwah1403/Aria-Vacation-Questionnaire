"use client";

import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VariableSelector } from "./email-variable-selector";
import { HtmlEditor } from "./email-html-editor";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateEmailTemplate } from "@/mutations/emailTemplate/emailTemplateMutations";
import { LoadingButton } from "@/components/ui/loading-button";

// Available variables
const availableVariables = [
  { name: "name", description: "Member's full name" },
  { name: "memberId", description: "Member's unique ID" },
  { name: "email", description: "Member's email address" },
  //   { name: "check-in-date", description: "Current date" },
  { name: "companyName", description: "Company name" },
  { name: "feedback-url", description: "Link to the feedback page" },
];

// Define the form validation schema with Zod
const formSchema = z
  .object({
    formType: z.string({
      required_error: "Please select a form type",
    }),
    templateName: z.string().min(1, "Template name is required"),
    emailSubject: z.string().min(1, "Email subject is required"),
    contentType: z.enum(["text", "html"]),
    textContent: z.string().optional(),
    htmlContent: z.string().optional(),
  })
  .refine(
    (data) => {
      // Ensure either textContent or htmlContent is provided based on contentType
      if (data.contentType === "text") {
        return !!data.textContent;
      } else {
        return !!data.htmlContent;
      }
    },
    {
      message: "Email content cannot be empty",
      path: ["textContent"], // This will show the error on textContent field
    }
  );

const CreateEmailDialog = ({ formTypes }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState(null);
  const [contentType, setContentType] = useState("text");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef(null);
  const htmlEditorRef = useRef(null);

  const createMutation = useCreateEmailTemplate();

  const validFormTypes = formTypes.filter((formType) => formType.isActive);

  // Initialize React Hook Form with Zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formType: "",
      templateName: "",
      emailSubject: "",
      contentType: "text",
      textContent: "",
      htmlContent: "",
    },
  });

  // Update contentType in form when tabs change
  useEffect(() => {
    form.setValue("contentType", contentType);
  }, [contentType, form]);

  const handleInsertVariable = (variable) => {
    const variableText = `{{${variable}}}`;

    if (contentType === "text") {
      // For text content, insert at cursor position
      const textareaElement = document.querySelector(
        "textarea[name='textContent']"
      );
      if (textareaElement) {
        const cursorPos = textareaElement.selectionStart;
        const currentValue = form.getValues("textContent") || "";
        const textBefore = currentValue.substring(0, cursorPos);
        const textAfter = currentValue.substring(cursorPos);

        const newText = textBefore + variableText + textAfter;
        form.setValue("textContent", newText, { shouldValidate: true });

        // Set cursor position after the inserted variable
        setTimeout(() => {
          textareaElement.focus();
          textareaElement.setSelectionRange(
            cursorPos + variableText.length,
            cursorPos + variableText.length
          );
        }, 0);
      }
    } else {
      // For HTML content, insert at cursor position
      const htmlTextarea = document.querySelector(
        ".min-h-\\[200px\\].font-mono"
      );
      if (htmlTextarea) {
        const cursorPos = htmlTextarea.selectionStart;
        const currentValue = form.getValues("htmlContent") || "";
        const textBefore = currentValue.substring(0, cursorPos);
        const textAfter = currentValue.substring(cursorPos);

        const newHtml = textBefore + variableText + textAfter;
        form.setValue("htmlContent", newHtml, { shouldValidate: true });

        // Set cursor position after the inserted variable
        setTimeout(() => {
          htmlTextarea.focus();
          htmlTextarea.setSelectionRange(
            cursorPos + variableText.length,
            cursorPos + variableText.length
          );
        }, 0);
      }
    }
  };

  const onSubmit = async (data) => {
    // Log the form data
    const templateData = {
      formCode: selectedFormType,
      emailTemplateName: data.templateName,
      emailSubject: data.emailSubject,
      contentType: data.contentType,
      textContent: data.contentType === "text" ? data.textContent : undefined,
      htmlContent: data.contentType === "html" ? data.htmlContent : undefined,
      variables: availableVariables,
    };

    console.log(templateData);

    createMutation.mutate(templateData, {
      onSuccess: () => {
        // Close the modal and reset form
        setIsCreateDialogOpen(false);
        form.reset();
        setContentType("text");

        // Success toast
        toast.success("Email template created successfully");
      },
      onError: () => {
        toast.error("Failed to create email template. Please try again");
      },
    });
  };

  return (
    <Dialog
      open={isCreateDialogOpen}
      onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        if (!open) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Email Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create Email Template</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="formType"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Form Type</FormLabel>
                  <div className="col-span-3">
                    <Select
                      onValueChange={(value) => setSelectedFormType(value)}
                    >
                      <FormControl>
                        <SelectTrigger id="form-type">
                          <SelectValue placeholder="Select a form type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {validFormTypes.map((type) => (
                          <SelectItem key={type.id} value={type.formCode}>
                            {type.formName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="templateName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Template Name</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input placeholder="Enter template name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailSubject"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Email Subject</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input placeholder="Enter email subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Email Content</Label>
              <div className="col-span-3">
                <Tabs
                  value={contentType}
                  onValueChange={(value) => {
                    setContentType(value);
                    form.setValue("contentType", value);
                  }}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="html">HTML</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="mt-4">
                    <FormField
                      control={form.control}
                      name="textContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              ref={textareaRef}
                              placeholder="Enter email content here..."
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="html" className="mt-4">
                    <FormField
                      control={form.control}
                      name="htmlContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <HtmlEditor
                              ref={htmlEditorRef}
                              value={field.value || ""}
                              onChange={(value) => field.onChange(value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

                <div className="mt-4">
                  <VariableSelector
                    variables={availableVariables}
                    onSelectVariable={handleInsertVariable}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                loading={createMutation.isPending}
                disabled={isSubmitting}
                className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
              >
                {createMutation.isPending ? "Creating..." : "Create Template"}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmailDialog;

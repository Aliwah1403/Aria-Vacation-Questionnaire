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
import { PlusCircle } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateEmailTemplate } from "@/mutations/emailTemplate/emailTemplateMutations";
import { useUpdateEmailTemplate } from "@/mutations/emailTemplate/emailTemplateMutations";
import { LoadingButton } from "@/components/ui/loading-button";
import { emailSendApi } from "@/api/emailSend";
import { useSession } from "@/lib/auth-client";

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
    templateLanguage: z.enum(["en", "ar", "fr", "ru"]),
    emailSubject: z.string().min(1, "Email subject is required"),
    contentType: z.enum(["text", "html"], {
      errorMap: (issue, ctx) => {
        if (issue.code === "invalid_enum_value ") {
          return { message: "Please select a language" };
        }
      },
    }),
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

const defaultValues = {
  formType: "",
  templateName: "",
  templateLanguage: "",
  emailSubject: "",
  contentType: "text",
  textContent: "",
  htmlContent: "",
};

const CreateEmailDialog = ({
  formTypes,
  initialData,
  isOpen,
  onOpenChange,
}) => {
  const [contentType, setContentType] = useState("text");
  const [isTestEmailLoading, setIsTestEmailLoading] = useState(false);
  const createMutation = useCreateEmailTemplate();
  const updateMutation = useUpdateEmailTemplate();
  const isEditing = !!initialData;
  const { data: session } = useSession();

  const textareaRef = useRef(null);
  const htmlEditorRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Improved form reset handling
  const resetForm = () => {
    form.reset(defaultValues);
    setContentType("text");
  };

  // Handle dialog state changes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else if (isOpen && initialData) {
      // Set form data when editing
      form.reset({
        formType: initialData.formCode || "",
        templateName: initialData.emailTemplateName || "",
        templateLanguage: initialData.language || "en",
        emailSubject: initialData.emailSubject || "",
        contentType: initialData.contentType || "text",
        textContent: initialData.textContent || "",
        htmlContent: initialData.htmlContent || "",
      });
      setContentType(initialData.contentType || "text");
    }
  }, [isOpen, initialData, form]);

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
    const templateData = {
      formCode: data.formType,
      emailTemplateName: data.templateName,
      language: data.templateLanguage,
      emailSubject: data.emailSubject,
      contentType: data.contentType,
      textContent: data.contentType === "text" ? data.textContent : undefined,
      htmlContent: data.contentType === "html" ? data.htmlContent : undefined,
      variables: availableVariables,
    };

    const mutation = initialData ? updateMutation : createMutation;

    try {
      await mutation.mutateAsync(
        initialData ? { id: initialData._id, ...templateData } : templateData
      );
      onOpenChange(false);
      resetForm();
      toast.success(
        `Email template ${initialData ? "updated" : "created"} successfully`
      );
    } catch (error) {
      toast.error(
        `Failed to ${initialData ? "update" : "create"} email template`
      );
    }
  };

  const handleSendTestEmail = async () => {
    const formData = form.getValues();

    // Validate form data before sending test email
    const validationResult = formSchema.safeParse(formData);
    if (!validationResult.success) {
      toast.error(
        "Please fill in all required fields before sending test email"
      );
      return;
    }

    // Get the current user's email from session
    const userEmail = session?.user?.email;
    if (!userEmail) {
      toast.error("Unable to get your email address. Please try again.");
      return;
    }

    // Check if content is not empty
    const content =
      formData.contentType === "text"
        ? formData.textContent
        : formData.htmlContent;
    if (!content || content.trim() === "") {
      toast.error(
        "Please add some content to your email before sending a test."
      );
      return;
    }

    const testEmailData = {
      recepientEmail: userEmail,
      subject: formData.emailSubject,
      contentType: formData.contentType,
      rawContent: content,
    };

    setIsTestEmailLoading(true);
    try {
      await emailSendApi.sendTestEmail(testEmailData);
      toast.success(
        `Test email sent successfully to ${userEmail}! Check your inbox.`
      );
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email. Please try again.");
    } finally {
      setIsTestEmailLoading(false);
    }
  };

  // Update Dialog component to handle close properly
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
        onOpenChange(open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Email Template
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[800px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Email Template" : "Create Email Template"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isEditing && (
              <FormField
                control={form.control}
                name="formType"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Form Type</FormLabel>
                    <div className="col-span-3">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        // disabled={!!initialData}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Select a form type"
                              defaultValue={initialData?.formCode}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formTypes
                            .filter((t) => t.isActive)
                            .map((type) => (
                              <SelectItem key={type._id} value={type.formCode}>
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
            )}

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
              name="templateLanguage"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Form Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="col-span-3">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
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

                  <TabsContent value="text" className="mt-4 overflow-scroll">
                    <FormField
                      control={form.control}
                      name="textContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              ref={textareaRef}
                              placeholder="Enter email content here..."
                              className="min-h-[200px] max-h-[400px]"
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

            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Cancel
              </Button>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center justify-center gap-2">
                  <LoadingButton
                    type="button"
                    variant="secondary"
                    loading={isTestEmailLoading}
                    disabled={
                      createMutation.isPending ||
                      updateMutation.isPending ||
                      isTestEmailLoading
                    }
                    onClick={handleSendTestEmail}
                  >
                    {isTestEmailLoading ? "Sending..." : "Send Test Mail"}
                  </LoadingButton>
                  <LoadingButton
                    type="submit"
                    loading={
                      createMutation.isPending || updateMutation.isPending
                    }
                    className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? initialData
                        ? "Updating..."
                        : "Creating..."
                      : initialData
                      ? "Update Template"
                      : "Create Template"}
                  </LoadingButton>
                </div>
                {session?.user?.email && (
                  <p className="text-xs text-muted-foreground">
                    Test email will be sent to: {session.user.email}
                  </p>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmailDialog;

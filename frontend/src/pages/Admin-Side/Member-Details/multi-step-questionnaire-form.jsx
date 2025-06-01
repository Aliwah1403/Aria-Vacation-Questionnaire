import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, addDays } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Copy,
  Check,
  LinkIcon,
  ChevronsUpDown,
  PlusCircleIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import { LoadingButton } from "@/components/ui/loading-button";
import CheckInOutDatePicker from "@/components/check-in-out-date-picker";
import { useCreateFormSubmission } from "@/mutations/formSubmission/formSubmissionMutation";
import { toast } from "sonner";
import { emailTemplateApi } from "@/api/emailTemplates";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { emailSendApi } from "@/api/emailSend";

const emailTemplates = [
  { label: "Tester Survey Email Template", value: "tester-survey" },
  { label: "Post Feedback Request", value: "post-feedback" },
  { label: "Pre-Arrival Feedback Request", value: "pre-arrival" },
  { label: "Post-Departure Feedback Request", value: "post-departure" },
  { label: "Post-Stay Feedback Request", value: "post-stay" },
  { label: "Pre-Stay Feedback Request", value: "pre-stay" },
  { label: "Pre-Check-In Feedback Request", value: "pre-check-in" },
  { label: "Post-Check-Out Feedback Request", value: "post-check-out" },
  { label: "Pre-Check-Out Feedback Request", value: "pre-check-out" },
];

// Form schemas
const stayDetailsSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  resort: z.string().min(1, "Resort is required"),
  checkIn: z.date({
    required_error: "Check-in date is required",
  }),
  checkOut: z.date({
    required_error: "Check-out date is required",
  }),
  unitNo: z.string().min(1, "Unit number is required"),
});

const questionnaireTypeSchema = z.object({
  formTemplateId: z.string().min(1, "Questionnaire type is required"),
  emailTemplates: z.string().min(1, "Email template is required"),
});

const URL = import.meta.env.VITE_URL;

const MultiStepQuestionnaireForm = ({
  setStayDetailsDialog,
  formTypes,
  formTemplates,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const createSubmission = useCreateFormSubmission();

  const navigate = useNavigate();

  const validFormTemplates = formTemplates.filter(
    (formTemplate) => formTemplate.isActive
  );

  // Form for step 1 - Stay Details
  const stayDetailsForm = useForm({
    resolver: zodResolver(stayDetailsSchema),
    defaultValues: {
      memberId: "",
      name: "",
      email: "",
      resort: "",
      unitNo: "",
    },
  });

  // Form for step 2 - Questionnaire Type
  const questionnaireTypeForm = useForm({
    resolver: zodResolver(questionnaireTypeSchema),
    defaultValues: {
      formTemplateId: "",
      emailTemplates: "",
    },
  });

  // Watch the check-in date to update check-out calendar
  const checkInDate = stayDetailsForm.watch("checkIn");

  const handleCheckInSelect = (date) => {
    stayDetailsForm.setValue("checkIn", date);
    // If check-out date is before check-in date, reset it
    const checkOutDate = stayDetailsForm.getValues("checkOut");
    if (checkOutDate && checkOutDate < date) {
      stayDetailsForm.setValue("checkOut", null);
    }
  };

  // Handle step 1 submission
  function onStayDetailsSubmit(values) {
    setFormData({ ...formData, ...values });
    setStep(2);
  }

  // Handle step 2 submission
  const onQuestionnaireTypeSubmit = async (values) => {
    try {
      setLoading(true);

      // Get the stay details from step 1
      const submissionData = {
        formTemplateId: values.formTemplateId,
        memberId: formData.memberId,
        memberName: formData.name,
        memberEmail: formData.email,
        resort: formData.resort,
        unitNo: `BR${formData.unitNo}`,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
      };

      const result = await createSubmission.mutateAsync(submissionData);

      // Update form data and generated link from API response
      setFormData({ ...formData, ...values });
      setGeneratedLink(result.feedbackUrl);

      // Update form data with the selected template info
      const selectedTemplate = validFormTemplates.find(
        (t) => t._id === values.formTemplateId
      );
      setFormData({
        ...formData,
        ...values,
        formTypeName: selectedTemplate?.formTypeName, // Add this to show in the summary
      });

      setStep(3);
      toast.success("Questionnaire created successfully");
      // Add a success toast message
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create form submission"
      );
    } finally {
      setLoading(false);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fetching email templates based on form template chosen
  const { data: emailTemplateData } = useQuery({
    queryKey: ["emailTemplates", questionnaireTypeForm.watch("formTemplateId")],
    queryFn: async () => {
      const selectedTemplate = validFormTemplates.find(
        (t) => t._id === questionnaireTypeForm.watch("formTemplateId")
      );
      if (!selectedTemplate?.formTypeId?.formCode) return [];
      return emailTemplateApi.getByFormType(
        selectedTemplate.formTypeId.formCode
      );
    },
    enabled: !!questionnaireTypeForm.watch("formTemplateId"),
  });

  // Send email
  const handleEmailSend = async () => {
    try {
      setLoading(true);

      const selectedEmailTemplate = emailTemplateData?.find(
        (template) =>
          template._id === questionnaireTypeForm.getValues("emailTemplates")
      );

      if (!selectedEmailTemplate) {
        throw new Error("No email template selected");
      }

      const emailData = {
        recepientEmail: formData.email,
        recepientName: formData.name,
        subject: selectedEmailTemplate.emailSubject,
        contentType: selectedEmailTemplate.contentType,
        rawContent:
          selectedEmailTemplate.contentType === "html"
            ? selectedEmailTemplate.htmlContent
            : selectedEmailTemplate.textContent,
        templateVariables: {
          name: formData.name,
          memberId: formData.memberId,
          email: formData.email,
          companyName: "Aria Vacation Club",
          "feedback-url": generatedLink,
        },
      };

      // // Prepare template variables
      // const templateVariables = {
      //   name: formData.name,
      //   memberId: formData.memberId,
      //   email: formData.email,
      //   companyName: "Aria Vacation Club",
      //   "feedback-url": generatedLink,
      // };

      // // Get the appropriate content based on type
      // const emailContent =
      //   selectedEmailTemplate.contentType === "html"
      //     ? selectedEmailTemplate.htmlContent
      //     : selectedEmailTemplate.textContent;

      // console.log("Email Data to be sent:", {
      //   recipientName: formData.name,
      //   recipientEmail: formData.email,
      //   subject: selectedEmailTemplate.emailSubject,
      //   contentType: selectedEmailTemplate.contentType,
      //   rawContent: emailContent,
      //   templateName: selectedEmailTemplate.emailTemplateName,
      //   templateVariables,
      //   feedbackLink: generatedLink,
      // });

      await emailSendApi.sendFeedbackEmail(emailData);

      toast.success("Email sent successfully!");
    } catch (error) {
      console.error("Error preparing email:", error);
      toast.error("Failed to send email ");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId) => {
    const selectedTemplate = emailTemplateData?.find(
      (t) => t._id === templateId
    );
    if (selectedTemplate) {
      questionnaireTypeForm.setValue("emailTemplates", templateId);
    }
  };

  const steps = [1, 2, 3];

  const questionnaireTypes = {
    "stay-experience": {
      title: "Stay Experience Survey",
      description:
        "Collects feedback about the overall stay experience, including check-in/out, room comfort, and resort facilities.",
      questions: "10 questions",
      duration: "5-10 minutes",
    },
    amenities: {
      title: "Amenities Survey",
      description:
        "Focuses on the resort amenities such as pools, restaurants, spa services, and recreational activities.",
      questions: "8 questions",
      duration: "3-5 minutes",
    },
    "customer-service": {
      title: "Customer Service Survey",
      description:
        "Evaluates the quality of customer service provided by resort staff during the member's stay.",
      questions: "6 questions",
      duration: "2-4 minutes",
    },
  };

  return (
    <div>
      {/* Progress indicator */}
      <div className="mx-auto mb-6 text-center">
        <Stepper value={step} onValueChange={setStep}>
          {steps.map((step) => (
            <StepperItem key={step} step={step} className="not-last:flex-1">
              <StepperTrigger asChild>
                <StepperIndicator />
              </StepperTrigger>
              {step < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
      </div>

      {/* Step 1: Stay Details */}
      {step === 1 && (
        <Form {...stayDetailsForm}>
          <form
            onSubmit={stayDetailsForm.handleSubmit(onStayDetailsSubmit)}
            className="space-y-6"
          >
            <FormField
              control={stayDetailsForm.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={stayDetailsForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={stayDetailsForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={stayDetailsForm.control}
              name="resort"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Resort</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Resort" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="balqis residence">
                        Balqis Residence
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={stayDetailsForm.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in Date</FormLabel>
                    <FormControl>
                      <CheckInOutDatePicker
                        value={field.value}
                        onChange={(date) => handleCheckInSelect(date)}
                        disabled={[{ dayOfWeek: [0, 1, 2, 3, 4, 5] }]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={stayDetailsForm.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out Date</FormLabel>
                    <FormControl>
                      <CheckInOutDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={[
                          { dayOfWeek: [0, 1, 2, 3, 4, 5] },
                          ...(checkInDate
                            ? [{ before: addDays(checkInDate, 0) }]
                            : []),
                        ]}
                        defaultMonth={checkInDate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={stayDetailsForm.control}
              name="unitNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="xxxxx"
                        className="peer ps-[29px]"
                        {...field}
                      />
                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                        BR
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row space-x-2 items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setStayDetailsDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80 cursor-pointer"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Step 2: Questionnaire Type */}
      {step === 2 && (
        <Form {...questionnaireTypeForm}>
          <form
            onSubmit={questionnaireTypeForm.handleSubmit(
              onQuestionnaireTypeSubmit
            )}
            className="space-y-6"
          >
            <FormField
              control={questionnaireTypeForm.control}
              name="formTemplateId"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>Select Form Template</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a form template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {validFormTemplates?.map((template) => (
                        <SelectItem key={template._id} value={template._id}>
                          {template.formTemplateName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Template Description Section */}
                  {field.value && (
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">
                        {
                          validFormTemplates.find((t) => t._id === field.value)
                            ?.formTypeName
                        }
                      </h3>
                      {/* <p className="text-sm text-muted-foreground mb-2">
                        {
                          formTemplates.find((t) => t._id === field.value)
                            ?.formTypeDescription
                        }
                      </p> */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="bg-gray-100">
                          {
                            validFormTemplates.find(
                              (t) => t._id === field.value
                            )?.questions.length
                          }{" "}
                          questions
                        </Badge>
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={questionnaireTypeForm.control}
              name="emailTemplates"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Email Template</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={
                            !questionnaireTypeForm.watch("formTemplateId")
                          }
                        >
                          {field.value
                            ? emailTemplateData.find(
                                (template) => template._id === field.value
                              )?.emailTemplateName
                            : "Select email template"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className=" p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search email template..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>
                            <span>No email template found.</span>
                            <Button
                              size="sm"
                              className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate("/admin/questionnaire-setup");
                                setStayDetailsDialog(false);
                              }}
                            >
                              Create new template
                              <PlusCircleIcon className="size-4" />
                            </Button>
                          </CommandEmpty>
                          <CommandGroup>
                            {emailTemplateData?.map((template) => (
                              <CommandItem
                                value={template._id}
                                key={template.emailTemplateName}
                                onSelect={() =>
                                  handleTemplateSelect(template._id)
                                }
                              >
                                {template.emailTemplateName}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    template._id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the email content that will be sent to the member.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={questionnaireTypeForm.control}
              name="emailSubject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* <FormField
              control={questionnaireTypeForm.control}
              name="emailBody"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Body</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter email body"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={createSubmission.isPending}
              >
                Back
              </Button>
              <LoadingButton
                type="submit"
                loading={createSubmission.isPending}
                disabled={createSubmission.isPending}
                className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
              >
                {createSubmission.isPending ? "Creating..." : "Create Form"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      )}

      {/* Step 3: Generated Link */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member Name</span>
                <span className="text-sm capitalize">{formData.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member Email</span>
                <span className="text-sm">{formData.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member ID</span>
                <span className="text-sm">{formData.memberId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resort</span>
                <span className="text-sm capitalize">
                  {formData.resort?.replace(/-/g, " ")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stay Period</span>
                <span className="text-sm">
                  {formData.checkIn && format(formData.checkIn, "MMM d, yyyy")}{" "}
                  -{" "}
                  {formData.checkOut &&
                    format(formData.checkOut, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Unit Number</span>
                <span className="text-sm uppercase">BR{formData.unitNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Questionnaire Type</span>
                <span className="text-sm capitalize">
                  {formData.formTypeName || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Shareable Link</label>
            <div className="flex items-center w-full">
              <div className="flex-1 p-3 h-10 bg-gray-50 rounded-l-md border border-r-0 overflow-hidden">
                <div className="flex items-center h-full w-full">
                  <LinkIcon className="h-4 w-4 min-w-4 mr-2 text-gray-500" />
                  <span className="text-sm truncate w-full">
                    {generatedLink}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                className="rounded-l-none h-10 min-w-10 bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The member will receive an email with this link.
            </p>
          </div>

          <div className="flex justify-end">
            {/* <Button type="button" variant="outline" onClick={() => setStep(2)}>
              Back
            </Button> */}
            <div className="space-x-2">
              <LoadingButton
                loading={loading}
                disabled={loading} // Explicitly disable while loading
                type="button"
                variant="outline"
                onClick={() => handleEmailSend()}
              >
                Send Link
              </LoadingButton>
              <Button
                type="button"
                className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                onClick={() => setStayDetailsDialog(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepQuestionnaireForm;

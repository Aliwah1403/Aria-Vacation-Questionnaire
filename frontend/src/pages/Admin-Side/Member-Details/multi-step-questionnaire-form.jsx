import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon, Copy, Check, LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import StepperComponent from "@/components/stepper-component";
import { LoadingButton } from "@/components/ui/loading-button";
import CheckInOutDatePicker from "@/components/check-in-out-date-picker";
// Form schemas
const stayDetailsSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  name: z.string().min(1, "Name is required"),
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
  type: z.string().min(1, "Questionnaire type is required"),
  emailSubject: z.string().min(1, "Email subject is required"),
  emailBody: z.string().min(1, "Email body is required"),
});

const URL = import.meta.env.VITE_URL;

const MultiStepQuestionnaireForm = ({ setStayDetailsDialog }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form for step 1 - Stay Details
  const stayDetailsForm = useForm({
    resolver: zodResolver(stayDetailsSchema),
    defaultValues: {
      memberId: "",
      name: "",
      resort: "",
      unitNo: "",
    },
  });

  // Form for step 2 - Questionnaire Type
  const questionnaireTypeForm = useForm({
    resolver: zodResolver(questionnaireTypeSchema),
    defaultValues: {
      type: "stay-experience",
      emailSubject: "Your Stay Experience Feedback",
      emailBody:
        "We value your feedback on your recent stay. Please take a moment to complete our survey.",
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
      const completeFormData = { ...formData, ...values };

      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update form data
      setFormData(completeFormData);

      // Generate a unique link (simulate API response)
      const uniqueId = Math.random().toString(36).substring(2, 10);
      const link = `${URL}/feedback/testID`;
      // const link = `https://yourdomain.com/feedback/${uniqueId}`;
      setGeneratedLink(link);

      setStep(3);
    } catch (error) {
      console.error("Error generating questionnaire:", error);
      //show an error toast/alert
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

  // Send email
  const handleEmailSend = async () => {
    setLoading(true);

    try {
      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success toast/alert
      alert("Email sent successfully!");
      // setStayDetailsDialog(false);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [1, 2, 3];

  return (
    <div>
      {/* Progress indicator */}
      <div className="mx-auto max-w-xl mb-6 text-center">
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
                    <Input
                      placeholder="BExxx"
                      className="uppercase"
                      {...field}
                    />
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
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>Questionnaire Type</FormLabel>
                  <FormControl>
                    <Tabs
                      defaultValue={field.value || "stay-experience"}
                      className="w-full"
                      onValueChange={field.onChange}
                    >
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="stay-experience">
                          Stay Experience
                        </TabsTrigger>
                        <TabsTrigger value="amenities">Amenities</TabsTrigger>
                        <TabsTrigger value="customer-service">
                          Customer Service
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value="stay-experience"
                        className="mt-4 border rounded-md p-4"
                      >
                        <h3 className="font-medium mb-2">
                          Stay Experience Survey
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Collects feedback about the overall stay experience,
                          including check-in/out, room comfort, and resort
                          facilities.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="bg-gray-100">
                            10 questions
                          </Badge>
                          <Badge variant="outline" className="bg-gray-100">
                            5-10 minutes
                          </Badge>
                        </div>
                      </TabsContent>
                      <TabsContent
                        value="amenities"
                        className="mt-4 border rounded-md p-4"
                      >
                        <h3 className="font-medium mb-2">Amenities Survey</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Focuses on the resort amenities such as pools,
                          restaurants, spa services, and recreational
                          activities.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="bg-gray-100">
                            8 questions
                          </Badge>
                          <Badge variant="outline" className="bg-gray-100">
                            3-5 minutes
                          </Badge>
                        </div>
                      </TabsContent>
                      <TabsContent
                        value="customer-service"
                        className="mt-4 border rounded-md p-4"
                      >
                        <h3 className="font-medium mb-2">
                          Customer Service Survey
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Evaluates the quality of customer service provided by
                          resort staff during the member's stay.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="bg-gray-100">
                            6 questions
                          </Badge>
                          <Badge variant="outline" className="bg-gray-100">
                            2-4 minutes
                          </Badge>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
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
            />

            <FormField
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
            />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading} // Disable back button while loading
              >
                Back
              </Button>
              <LoadingButton
                type="submit"
                loading={loading}
                disabled={loading} // Explicitly disable while loading
                className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
              >
                {loading ? "Generating..." : "Generate Link"}
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
                <span className="text-sm font-medium">Member</span>
                <span className="text-sm">{formData.name}</span>
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
                <span className="text-sm">{formData.unitNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Questionnaire Type</span>
                <span className="text-sm capitalize">
                  {formData.type?.replace(/-/g, " ")}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Shareable Link</label>
            <div className="flex items-center">
              <div className="flex-1 p-3 h-10 bg-gray-50 rounded-l-md border border-r-0 truncate">
                <div className="flex items-center h-full">
                  <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm truncate">{generatedLink}</span>
                </div>
              </div>
              <Button
                type="button"
                className="rounded-l-none h-10 bg-fountain-blue-400"
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
              This link will expire in 7 days. The member will receive an email
              with this link.
            </p>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
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

import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const Success = () => {
  // Function to open WhatsApp chat
  const openWhatsApp = () => {
    // Replace with your actual WhatsApp number
    const phoneNumber = "1234567890";
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4 py-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-[#4ABEC6] rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Thank You for Your Feedback!
          </h1>

          <p className="text-gray-600 text-sm sm:text-base">
            We appreciate you taking the time to share your experience with us.
            Your feedback helps us improve our services.
          </p>

          <div className="border-t border-b border-gray-200 py-6 my-6">
            <h2 className="text-lg font-medium mb-4">
              Need further assistance?
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+971 4542 0202</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:info@ariavacationclub.com"
                  className="text-[#4ABEC6] hover:underline"
                >
                  info@ariavacationclub.com
                </a>
              </div>
            </div>
          </div>

          <Button
            onClick={openWhatsApp}
            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with us on WhatsApp
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Success;

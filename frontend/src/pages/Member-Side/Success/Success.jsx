import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Success = () => {
  const { t } = useTranslation();

  const openWhatsApp = () => {
    const phoneNumber = "97145420299";
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center p-4 sm:p-0">
      <div className="max-w-xl w-full mx-auto px-3 sm:px-4 py-6 sm:py-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-12 h-12 sm:w-16 sm:h-16 bg-fountain-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
        >
          <Check className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 sm:space-y-6"
        >
          <h1 className="text-xl sm:text-3xl font-semibold text-gray-900">
            {t("thankYou")}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 px-2 sm:px-0">
            {t("thankYouComment")}
          </p>

          <div className="border-t border-b border-gray-200 py-4 sm:py-6 my-4 sm:my-6">
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
              {t("assistanceAsk")}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-600">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {/* Prevent layout switch in AR for mobile number */}
                <span className="text-sm sm:text-base">+971 4 5420 202</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-600">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <a
                  href="mailto:members@ariavacationclub.com"
                  className="text-sm sm:text-base text-fountain-blue-400 hover:underline"
                >
                  members@ariavacationclub.com
                </a>
              </div>
            </div>
          </div>

          <Button
            onClick={openWhatsApp}
            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white inline-flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base px-4 sm:px-6 py-2"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {t("whatsappChat")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Success;

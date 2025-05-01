import AriaLogo from "@/assets/AriaLogo.png";
import { motion } from "framer-motion";

export function LoaderComponent({ text = "Loading data...", showLogo = true }) {
  const dots = Array.from({ length: 5 });

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {showLogo && (
        <div className="mb-8">
          <img src={AriaLogo} width={100} height={50} alt="Aria Logo" />
        </div>
      )}

      <div className="flex h-8 items-end space-x-1">
        {dots.map((_, i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-[#5BBFBA]"
            animate={{ height: ["8px", "24px", "8px"] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <p className="mt-4 text-lg text-gray-600">{text}</p>
    </div>
  );
}

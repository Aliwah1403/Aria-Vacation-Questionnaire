import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const CopyInput = ({ value, className }) => {
  const [isCopied, setCopied] = useState(false);

  const handleClipboard = async () => {
    try {
      setCopied(true);

      await navigator.clipboard.writeText(value);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {}
  };

  return (
    <div
      className={cn(
        "flex items-center relative w-full  py-2  rounded-md",
        className
      )}
    >
      <div className="pr-3  text-sm truncate">{value}</div>
      <button type="button" onClick={handleClipboard} className="block">
        <motion.div
          className="absolute top-2.5"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: isCopied ? 0 : 1, scale: isCopied ? 0 : 1 }}
        >
          <Copy className="size-5" />
        </motion.div>

        <motion.div
          className="absolute  top-2.5"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isCopied ? 1 : 0, scale: isCopied ? 1 : 0 }}
        >
          <Check className="size-5" />
        </motion.div>
      </button>
    </div>
  );
};

export default CopyInput;

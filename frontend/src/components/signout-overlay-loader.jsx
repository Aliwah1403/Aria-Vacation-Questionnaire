import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

const SignOutOverlayLoader = ({
  message = "Signing you out...",
  isVisible = true,
  onComplete,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setMounted(true);
    }
  }, [isVisible]);

  if (!isVisible && !mounted) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mx-4
        max-w-sm w-full text-center
        transform transition-all duration-300 ease-in-out
        ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
      `}
      >
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <LogOut className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          {/* Pulsing Ring Animation */}
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-2 border-red-200 dark:border-red-800 animate-ping" />
        </div>

        {/* Loading Spinner */}
        <div className="mb-4">
          <div className="inline-flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 dark:border-red-400" />
          </div>
        </div>

        {/* Message */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Signing Out
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-bounce" />
          <div
            className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignOutOverlayLoader;

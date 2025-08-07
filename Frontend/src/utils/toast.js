import { toast } from "sonner";

export const showSuccess = (message) =>
  toast("Success", {
    description: message,
    className: "bg-green-500 text-white border-none shadow-md",
    icon: "✅",
    action: {
      label: "✖",
      onClick: () => toast.dismiss(),
    },
  });

export const showError = (message) =>
  toast("Error", {
    description: message,
    className: "bg-red-600 text-white border-none shadow-md",
    icon: "❌",
    action: {
      label: "✖",
      onClick: () => toast.dismiss(),
    },
  });

export const showInfo = (message) =>
  toast("Info", {
    description: message,
    className: "bg-yellow-400 text-black border-none shadow-md",
     icon: "ℹ️",
     action: {
      label: "✖",
      onClick: () => toast.dismiss(),
    },
  });
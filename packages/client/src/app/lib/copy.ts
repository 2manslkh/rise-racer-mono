import toast from "react-hot-toast";
import { logError } from "./error";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
};

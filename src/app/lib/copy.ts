import { logError } from "./error";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
};

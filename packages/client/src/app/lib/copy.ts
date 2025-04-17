import toast from "react-hot-toast";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
    return true;
  } catch (err) {
    return false;
  }
};

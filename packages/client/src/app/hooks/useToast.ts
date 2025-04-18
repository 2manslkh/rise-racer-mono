/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback } from "react";
import toast, { ToastOptions } from "react-hot-toast";

const MAX_TOASTS = 1;

type ToastOptionsWithClose = ToastOptions & {
  onClose?: () => void;
};

export function useToast() {
  const activeToastsRef = useRef<string[]>([]);

  const removeToast = (id: string) => {
    activeToastsRef.current = activeToastsRef.current.filter(
      (tid) => tid !== id
    );
  };

  const wrapToast = useCallback(
    (
      fn: (message: string, options?: ToastOptions) => string,
      message: string,
      options?: ToastOptionsWithClose
    ) => {
      if (activeToastsRef.current.length >= MAX_TOASTS) {
        const oldestId = activeToastsRef.current.shift();
        if (oldestId) toast.dismiss(oldestId);
      }

      const id = fn(message, {
        ...(options as any),
        onClose: () => {
          options?.onClose?.();
          removeToast(id);
        },
      });

      activeToastsRef.current.push(id);
      return id;
    },
    []
  );

  return {
    show: (msg: string, opts?: ToastOptionsWithClose) =>
      wrapToast(toast, msg, opts),
    success: (msg: string, opts?: ToastOptionsWithClose) =>
      wrapToast(toast.success, msg, opts),
    error: (msg: string, opts?: ToastOptionsWithClose) =>
      wrapToast(toast.error, msg, opts),
    loading: (msg: string, opts?: ToastOptionsWithClose) =>
      wrapToast(toast.loading, msg, opts),
    custom: toast.custom,
    dismiss: toast.dismiss,
  };
}

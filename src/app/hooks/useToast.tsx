/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback } from "react";
import { toast, ToastOptions, Renderable } from "react-hot-toast";
import { shortenAddress } from "../lib/address";

const MAX_TOASTS = 3;
const TOAST_DURATION = 5_000;

type ToastPromiseMessages<T> = {
  loading: Renderable;
  success: Renderable | ((data: T) => Renderable);
  error: Renderable | ((error: any) => Renderable);
};

type ToastOptionsWithLink<T> = {
  loading: Renderable;
  success: (data: T) => {
    message: Renderable;
    link?: string;
    value?: string;
  };
  error: (error: any) => Renderable;
  toastOptions?: ToastOptions;
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
      fn: (message: Renderable, options?: ToastOptions) => string,
      message: Renderable,
      options?: ToastOptions
    ) => {
      if (activeToastsRef.current.length >= MAX_TOASTS) {
        const oldestId = activeToastsRef.current.shift();
        if (oldestId) toast.dismiss(oldestId);
      }

      const id = fn(message, options);
      activeToastsRef.current.push(id);
      return id;
    },
    []
  );

  const promise = useCallback(async function <T>(
    promise: Promise<T>,
    messages: ToastPromiseMessages<T>,
    options?: ToastOptions
  ): Promise<T> {
    if (activeToastsRef.current.length >= MAX_TOASTS) {
      const oldestId = activeToastsRef.current.shift();
      if (oldestId) toast.dismiss(oldestId);
    }

    const id = toast.loading(messages.loading, options);
    activeToastsRef.current.push(id);

    try {
      const result = await promise;

      toast.success(
        typeof messages.success === "function"
          ? messages.success(result)
          : messages.success,
        { id, ...options }
      );

      return result;
    } catch (error) {
      toast.error(
        typeof messages.error === "function"
          ? messages.error(error)
          : messages.error,
        { id, ...options }
      );
      throw error;
    } finally {
      removeToast(id);
    }
  }, []);

  const success = (msg: Renderable) => {
    const id = toast.custom(
      (t) => (
        <div
          className={`base-toast ${t.visible ? "animate-enter" : "animate-leave"}`}
        >
          <span className="relative min-w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="text-white w-4 h-4 animate-checkmark"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                className="stroke-dasharray-[16] stroke-dashoffset-[16] animate-draw"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <p className="flex-1 text-sm">{msg}</p>
        </div>
      ),
      {
        duration: TOAST_DURATION,
      }
    );

    activeToastsRef.current.push(id);
    return id;
  };

  const error = (msg: Renderable) => {
    const id = toast.custom(
      (t) => (
        <div
          className={`base-toast ${t.visible ? "animate-enter" : "animate-leave"}`}
        >
          <span className="relative min-w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white animate-cross-pop"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                className="stroke-current animate-cross-line"
              />
              <line
                x1="6"
                y1="18"
                x2="18"
                y2="6"
                className="stroke-current animate-cross-line"
              />
            </svg>
          </span>
          <div className="flex-1 text-sm overflow-auto">{msg}</div>
        </div>
      ),
      {
        duration: TOAST_DURATION,
      }
    );

    activeToastsRef.current.push(id);
    return id;
  };

  const loading = (msg: Renderable) => {
    const id = toast.custom(
      (t) => (
        <div
          className={`base-toast ${t.visible ? "animate-enter" : "animate-leave"}`}
        >
          <span className="inline-block min-w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <div className="flex-1 text-sm">{msg}</div>
        </div>
      ),
      {
        duration: TOAST_DURATION,
      }
    );

    activeToastsRef.current.push(id);
    return id;
  };

  const transactionSuccess = ({
    message,
    link,
    value,
  }: {
    message: string;
    link: string;
    value: string;
  }) => {
    const id = toast.custom(
      (t) => (
        <div
          className={`base-toast ${t.visible ? "animate-enter" : "animate-leave"}`}
        >
          <span className="relative w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="text-white w-4 h-4 animate-checkmark"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                className="stroke-dasharray-[16] stroke-dashoffset-[16] animate-draw"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <div className="flex flex-col text-sm text-white">
            <p>{message}</p>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-xs"
              >
                {value
                  ? value.includes("0x")
                    ? shortenAddress(value)
                    : value
                  : "View Details"}
              </a>
            )}
          </div>
        </div>
      ),
      {
        duration: TOAST_DURATION,
      }
    );

    activeToastsRef.current.push(id);
    return id;
  };

  const transactionPromise = useCallback(function <T>(
    promise: Promise<T>,
    config: ToastOptionsWithLink<T>
  ): Promise<T> {
    if (activeToastsRef.current.length >= MAX_TOASTS) {
      const oldestId = activeToastsRef.current.shift();
      console.log(oldestId);
      if (oldestId) toast.dismiss(oldestId);
    }

    const id = loading(config.loading);
    activeToastsRef.current.push(id);

    promise
      .then((res) => {
        const { message, link, value } = config.success(res);
        toast.custom(
          (t) => (
            <div
              className={`base-toast ${t.visible ? "animate-enter" : "animate-leave"}`}
            >
              <span className="relative w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="text-white w-4 h-4 animate-checkmark"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="stroke-dasharray-[16] stroke-dashoffset-[16] animate-draw"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <div className="flex flex-col text-sm text-white">
                <p>{message}</p>
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-xs"
                  >
                    {value
                      ? value.includes("0x")
                        ? shortenAddress(value)
                        : value
                      : "View Details"}
                  </a>
                )}
              </div>
            </div>
          ),
          {
            id,
            duration: TOAST_DURATION / 2,
          }
        );
      })
      .catch((err) => {
        const errorMessage = config.error(err);

        toast.custom(
          (t) => (
            <div
              className={`base-toast ${t.visible ? "animate-enter" : "animate-leave"}`}
            >
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          ),
          {
            id,
            duration: TOAST_DURATION / 2,
          }
        );
      })
      .finally(() => {
        removeToast(id);
      });

    return promise;
  }, []);

  return {
    show: (msg: Renderable, opts?: ToastOptions) => wrapToast(toast, msg, opts),
    promise,
    transactionPromise,
    transactionSuccess,
    success,
    error,
  };
}

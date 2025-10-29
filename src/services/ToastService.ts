/**
 * Toast Service - Centralized notification service using Sonner
 *
 * This service provides a clean API for showing toast notifications
 * from anywhere in the application without needing to import React hooks.
 *
 * @example
 * import { ToastService } from '@/services/ToastService'
 *
 * ToastService.success('Operation completed!')
 * ToastService.error('Something went wrong')
 * ToastService.promise(fetchData(), {
 *   loading: 'Loading...',
 *   success: 'Data loaded!',
 *   error: 'Failed to load'
 * })
 */

import { toast, type ExternalToast } from "sonner";

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export interface ToastOptions {
  /**
   * Duration in milliseconds. Default: 4000ms
   */
  duration?: number;
  /**
   * Position of the toast
   */
  position?: ToastPosition;
  /**
   * Rich colors mode for better visual distinction
   */
  richColors?: boolean;
  /**
   * Close button visibility
   */
  closeButton?: boolean;
  /**
   * Custom description text
   */
  description?: string;
  /**
   * Action button configuration
   */
  action?: {
    label: string;
    onClick: () => void;
  };
  /**
   * Cancel button configuration
   */
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  /**
   * Callback when toast is dismissed
   */
  onDismiss?: () => void;
  /**
   * Callback when toast is auto-closed
   */
  onAutoClose?: () => void;
  /**
   * Custom ID for the toast (useful for dismissing specific toasts)
   */
  id?: string | number;
  /**
   * Style override
   */
  style?: React.CSSProperties;
  /**
   * Class name override
   */
  className?: string;
  /**
   * Class names for toast parts
   */
  classNames?: {
    toast?: string;
    title?: string;
    description?: string;
    actionButton?: string;
    cancelButton?: string;
  };
}

export interface PromiseToastOptions<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: any) => string);
  description?: string;
  duration?: number;
  position?: ToastPosition;
}

class ToastServiceClass {
  /**
   * Default configuration for all toasts
   */
  private defaultOptions: ToastOptions = {
    duration: 4000,
    closeButton: true,
    richColors: true,
  };

  /**
   * Set default options for all toasts
   */
  setDefaultOptions(options: Partial<ToastOptions>) {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  /**
   * Merge default options with custom options
   */
  private mergeOptions(options?: ToastOptions): ToastOptions {
    return { ...this.defaultOptions, ...options };
  }

  /**
   * Convert ToastOptions to Sonner's ExternalToast format
   */
  private toSonnerOptions(options: ToastOptions): ExternalToast {
    const sonnerOptions: ExternalToast = {
      duration: options.duration,
      position: options.position,
      richColors: options.richColors,
      closeButton: options.closeButton,
      description: options.description,
      onDismiss: options.onDismiss,
      onAutoClose: options.onAutoClose,
      id: options.id,
      style: options.style,
      className: options.className,
      classNames: options.classNames,
    };

    // Convert action object to Sonner format
    if (options.action) {
      sonnerOptions.action = {
        label: options.action.label,
        onClick: (event) => {
          event.preventDefault();
          options.action!.onClick();
        },
      };
    }

    // Convert cancel object to Sonner format
    if (options.cancel) {
      const cancelConfig: any = {
        label: options.cancel.label,
      };

      if (options.cancel.onClick) {
        cancelConfig.onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          options.cancel!.onClick!();
        };
      }

      sonnerOptions.cancel = cancelConfig;
    }

    return sonnerOptions;
  }

  /**
   * Show a default toast message
   */
  message(message: string, options?: ToastOptions): string | number {
    const mergedOptions = this.mergeOptions(options);
    return toast(message, this.toSonnerOptions(mergedOptions));
  }

  /**
   * Show a success toast
   */
  success(message: string, options?: ToastOptions): string | number {
    const mergedOptions = this.mergeOptions(options);
    return toast.success(message, this.toSonnerOptions(mergedOptions));
  }

  /**
   * Show an error toast
   */
  error(message: string, options?: ToastOptions): string | number {
    const mergedOptions = this.mergeOptions({
      ...options,
      duration: options?.duration || 5000, // Errors stay longer
    });
    return toast.error(message, this.toSonnerOptions(mergedOptions));
  }

  /**
   * Show a warning toast
   */
  warning(message: string, options?: ToastOptions): string | number {
    const mergedOptions = this.mergeOptions(options);
    return toast.warning(message, this.toSonnerOptions(mergedOptions));
  }

  /**
   * Show an info toast
   */
  info(message: string, options?: ToastOptions): string | number {
    const mergedOptions = this.mergeOptions(options);
    return toast.info(message, this.toSonnerOptions(mergedOptions));
  }

  /**
   * Show a loading toast
   */
  loading(message: string, options?: ToastOptions): string | number {
    const mergedOptions = this.mergeOptions({
      ...options,
      duration: Infinity, // Loading toasts don't auto-dismiss
    });
    return toast.loading(message, this.toSonnerOptions(mergedOptions));
  }

  /**
   * Show a promise toast that updates based on promise state
   *
   * @example
   * ToastService.promise(
   *   fetchData(),
   *   {
   *     loading: 'Fetching data...',
   *     success: (data) => `Loaded ${data.length} items`,
   *     error: (err) => `Error: ${err.message}`
   *   }
   * )
   */
  promise<T>(promise: Promise<T>, options: PromiseToastOptions<T>): Promise<T> {
    const { loading, success, error, ...toastOptions } = options;
    const mergedOptions = this.mergeOptions(toastOptions as ToastOptions);

    toast.promise(promise, {
      loading,
      success,
      error,
      ...this.toSonnerOptions(mergedOptions),
    });

    return promise;
  }

  /**
   * Dismiss a specific toast by ID
   */
  dismiss(toastId?: string | number): void {
    toast.dismiss(toastId);
  }

  /**
   * Dismiss all toasts
   */
  dismissAll(): void {
    toast.dismiss();
  }

  /**
   * Show a custom toast with JSX content
   * Note: This should only be used in React components
   */
  custom(
    jsx: (id: string | number) => React.ReactElement,
    options?: ToastOptions
  ): string | number {
    const mergedOptions = this.mergeOptions(options);
    return toast.custom(jsx, this.toSonnerOptions(mergedOptions));
  }

  // ============== Convenience Methods ==============

  /**
   * Show a success toast with action button
   */
  successWithAction(
    message: string,
    actionLabel: string,
    onAction: () => void,
    options?: ToastOptions
  ): string | number {
    return this.success(message, {
      ...options,
      action: {
        label: actionLabel,
        onClick: onAction,
      },
    });
  }

  /**
   * Show an error toast with retry action
   */
  errorWithRetry(
    message: string,
    onRetry: () => void,
    options?: ToastOptions
  ): string | number {
    return this.error(message, {
      ...options,
      action: {
        label: "Retry",
        onClick: onRetry,
      },
    });
  }

  /**
   * Show a confirmation toast with accept/cancel actions
   */
  confirm(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    options?: ToastOptions
  ): string | number {
    return this.message(message, {
      ...options,
      duration: Infinity, // Confirmation toasts don't auto-dismiss
      action: {
        label: "Confirm",
        onClick: () => {
          onConfirm();
          this.dismiss();
        },
      },
      cancel: {
        label: "Cancel",
        onClick: onCancel,
      },
    });
  }

  /**
   * Show a toast for API success responses
   */
  apiSuccess(
    message: string = "Operation successful",
    options?: ToastOptions
  ): string | number {
    return this.success(message, {
      description: "Your request has been processed successfully",
      ...options,
    });
  }

  /**
   * Show a toast for API error responses
   */
  apiError(
    error: any,
    fallbackMessage: string = "Operation failed",
    options?: ToastOptions
  ): string | number {
    const errorMessage =
      error?.response?.data?.message || error?.message || fallbackMessage;

    const description =
      error?.response?.data?.details ||
      error?.response?.statusText ||
      "Please try again later";

    return this.error(errorMessage, {
      description,
      ...options,
    });
  }

  /**
   * Show a toast for network errors
   */
  networkError(options?: ToastOptions): string | number {
    return this.error("Network Error", {
      description: "Please check your internet connection and try again",
      ...options,
    });
  }

  /**
   * Show a toast for unauthorized access
   */
  unauthorized(options?: ToastOptions): string | number {
    return this.error("Unauthorized", {
      description: "Please log in to continue",
      ...options,
    });
  }

  /**
   * Show a toast for copy to clipboard success
   */
  copied(label: string = "Text", options?: ToastOptions): string | number {
    return this.success(`${label} copied to clipboard`, {
      duration: 2000,
      ...options,
    });
  }

  /**
   * Show a toast for file upload progress
   */
  uploadProgress(fileName: string, options?: ToastOptions): string | number {
    return this.loading(`Uploading ${fileName}...`, options);
  }

  /**
   * Show a toast for file upload success
   */
  uploadSuccess(fileName: string, options?: ToastOptions): string | number {
    return this.success(`${fileName} uploaded successfully`, options);
  }

  /**
   * Show a toast for file upload error
   */
  uploadError(
    fileName: string,
    error?: string,
    options?: ToastOptions
  ): string | number {
    return this.error(`Failed to upload ${fileName}`, {
      description: error || "Please try again",
      ...options,
    });
  }

  /**
   * Show a toast for wallet connection
   */
  walletConnected(address: string, options?: ToastOptions): string | number {
    return this.success("Wallet Connected", {
      description: `${address.slice(0, 6)}...${address.slice(-4)}`,
      ...options,
    });
  }

  /**
   * Show a toast for wallet disconnection
   */
  walletDisconnected(options?: ToastOptions): string | number {
    return this.info("Wallet Disconnected", options);
  }

  /**
   * Show a toast for transaction pending
   */
  transactionPending(txHash?: string, options?: ToastOptions): string | number {
    return this.loading("Transaction Pending", {
      description: txHash
        ? `Hash: ${txHash.slice(0, 10)}...`
        : "Waiting for confirmation",
      ...options,
    });
  }

  /**
   * Show a toast for transaction success
   */
  transactionSuccess(txHash?: string, options?: ToastOptions): string | number {
    return this.success("Transaction Successful", {
      description: txHash
        ? `Hash: ${txHash.slice(0, 10)}...`
        : "Your transaction has been confirmed",
      ...options,
    });
  }

  /**
   * Show a toast for transaction error
   */
  transactionError(error?: string, options?: ToastOptions): string | number {
    return this.error("Transaction Failed", {
      description: error || "Your transaction could not be completed",
      ...options,
    });
  }
}

// Export singleton instance
export const ToastService = new ToastServiceClass();

// Export for use in React components (optional)
export { toast };

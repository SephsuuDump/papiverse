// Save this file as: @/components/ui/toaster.tsx

"use client"
import { X } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ style, toastOptions, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  
  return (
    <Sonner
      className="toaster group tracking-widest uppercase text-sm !font-bold"
      style={{
        "--normal-bg": "#065f46",
        "--normal-border": "#065f46",
        "--normal-text": "#ffffff",
        "--success-bg": "#065f46",
        "--success-border": "#065f46", 
        "--success-text": "#ffffff",
        "--error-bg": "#991b1b",
        "--error-border": "#991b1b",
        "--error-text": "#ffffff",
        "--warning-bg": "#d97706",
        "--warning-border": "#d97706",
        "--warning-text": "#ffffff",
        "--info-bg": "#0369a1",
        "--info-border": "#0369a1", 
        "--info-text": "#ffffff",
        ...style,
      } as React.CSSProperties}
      toastOptions={{
        classNames: {
          error: '!bg-red-900 !text-white font-bold uppercase tracking-wide',
          success: '!bg-green-900 !text-white font-bold uppercase tracking-wide',
          warning: '!bg-amber-600 !text-white font-bold uppercase tracking-wide',
          info: '!bg-[#bf3612] !text-white !border-blue-700 font-bold uppercase tracking-wide',
          default: 'bg-emerald-800 !text-white !border-0 font-bold uppercase tracking-wide',
        },
        ...toastOptions,
      }}
      {...props}
    />
  )
}

export function NotificationToaster({ id, title, message, onClose }: {
    id: number;
    title: string;
    message: string;
    onClose: () => void;
}) {
    return (
        <div className="bg-white shadow-lg border rounded-lg p-4 w-[300px] flex gap-3 animate-in fade-in-80 slide-in-from-right-5">
            <div className="flex-1">
                <div className="font-semibold text-gray-900">{title}</div>
                <div className="text-sm text-gray-600">{message}</div>
            </div>

            <button
                className="text-gray-400 hover:text-black"
                onClick={onClose}
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}


export { Toaster }
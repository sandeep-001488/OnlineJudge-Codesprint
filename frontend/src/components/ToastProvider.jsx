"use client";

import { Toaster } from 'sonner';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      expand={false}
      duration={4000}
      toastOptions={{
        style: {
          padding: "16px",
          fontSize: "14px",
          borderRadius: "8px",
          border: "1px solid",
          fontWeight: "500",
        },
        className: "font-medium shadow-lg",
        success: {
          style: {
            backgroundColor: "#10b981", // green-500
            color: "white",
            borderColor: "#059669", // green-600
            boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)",
          },
          duration: 3000,
        },
        error: {
          style: {
            backgroundColor: "#ef4444", // red-500
            color: "white",
            borderColor: "#dc2626", // red-600
            boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)",
          },
          duration: 5000,
        },
        warning: {
          style: {
            backgroundColor: "#f59e0b", // amber-500
            color: "white",
            borderColor: "#d97706", // amber-600
            boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.3)",
          },
          duration: 4000,
        },
        info: {
          style: {
            backgroundColor: "#3b82f6", // blue-500
            color: "white",
            borderColor: "#2563eb", // blue-600
            boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
          },
          duration: 4000,
        },
        loading: {
          style: {
            backgroundColor: "#6b7280", // gray-500
            color: "white",
            borderColor: "#4b5563", // gray-600
          },
        },
        default: {
          style: {
            backgroundColor: "white",
            color: "#1f2937", // gray-800
            borderColor: "#d1d5db", // gray-300
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
        },
      }}
      theme="light"
      icons={{
        success: "🎉", 
        error: "💥", 
        warning: "⚠️",
        info: "ℹ️", 
        loading: "⏳",
      }}
    />
  );
}
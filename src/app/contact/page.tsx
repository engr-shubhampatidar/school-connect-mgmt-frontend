"use client";
import React from "react";
import ContactForm from "../../components/ContactForm";
import { ToastProvider } from "../../components/ui/use-toast";

export default function ContactPage() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <div className="grid grid-cols-1 gap-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

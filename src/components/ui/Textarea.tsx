"use client";
import React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`block w-full rounded-md border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${
          props.className ?? ""
        }`}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;

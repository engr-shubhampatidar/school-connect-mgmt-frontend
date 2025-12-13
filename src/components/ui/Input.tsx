"use client";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`block w-full rounded-md border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${
          props.className ?? ""
        }`}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;

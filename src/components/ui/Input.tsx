"use client";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`block w-full rounded-md border border-[#D7E3FC] px-3 py-2 text-[14px] font-[400] placeholder:text-[#6B7280] focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${
          props.className ?? ""
        }`}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;

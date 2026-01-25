"use client";

import React, { useId } from "react";

const TextInput = ({
  label,
  value,
  onChange,
  type = "text",
  error, // Hata mesajı için yeni prop
  className = "",
  ...props
}) => {
  const id = useId();

  return (
    <div className={`group relative w-full ${className}`}>
      {/* Input Konteyneri: Mobil için yüksekliği biraz artırdık (h-14 -> h-16) */}
      <div className={`relative ${type === "textarea" ? "h-32" : "h-14 sm:h-16"} flex items-end`}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          className={`peer w-full h-full  bg-transparent text-base sm:text-lg border-b outline-none pt-4 transition-all duration-300 placeholder-transparent
            ${error ? "border-red-500 text-red-600 focus:border-red-500" : "border-neutral-300 text-black"}
          `}
          {...props}
        />

        <label
          htmlFor={id}
          className={`absolute left-0 transition-all duration-300 pointer-events-none text-base

            peer-placeholder-shown:top-6
            sm:peer-placeholder-shown:top-6
            peer-placeholder-shown:text-lg
            sm:peer-placeholder-shown:text-xl

            
            /* Focus ve Dolu olma durumu */
            peer-focus:top-0
            sm:peer-focus:top-0
            sm:peer-focus:text-sm 
            peer-[:not(:placeholder-shown)]:top-0
            peer-[:not(:placeholder-shown)]:text-sm
            peer-[:not(:placeholder-shown)]:sm:text-black

            ${error
              ? "text-red-500 peer-focus:text-red-500"
              : "text-neutral-400 peer-focus:text-neutral-900"
            }
          `}
        >
          {label}
        </label>
      </div>

      {/* Hata Mesajı Alanı: Layout'u kaydırmaması için absolute veya sabit height kullanabiliriz */}
      <div className="min-h-[20px] mt-1">
        {error && (
          <p className="text-red-500 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextInput;
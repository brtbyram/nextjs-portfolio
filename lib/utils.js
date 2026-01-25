import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// burada clsx ve tailwind-merge fonksiyonlarını birleştiriyoruz yapmazsak tailwindcss ile birlikte kullanırken bazı sınıf çakışmalarında sorun yaşayabiliyoruz

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

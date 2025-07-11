import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Type-safe utility to merge Tailwind and conditional classes.
 * @param inputs - Any valid class value accepted by clsx.
 * @returns A merged className string.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(...inputs));
}

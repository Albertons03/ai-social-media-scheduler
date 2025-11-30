import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(d);
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function isVideoFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ["mp4", "mov", "avi", "mkv", "webm"].includes(ext);
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Timezone utility functions for consistent date/time handling
 */

/**
 * Format a UTC date string to local datetime for display
 * @param utcString - ISO UTC date string from database
 * @returns Formatted local date string (e.g., "Nov 29, 2025, 4:30 PM")
 */
export function formatToLocalDateTime(utcString: string | null): string {
  if (!utcString) return "";
  const date = new Date(utcString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format a UTC date string to local date only
 * @param utcString - ISO UTC date string from database
 * @returns Formatted local date string (e.g., "Nov 29, 2025")
 */
export function formatToLocalDate(utcString: string | null): string {
  if (!utcString) return "";
  const date = new Date(utcString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a UTC date string to local time only
 * @param utcString - ISO UTC date string from database
 * @returns Formatted local time string (e.g., "4:30 PM")
 */
export function formatToLocalTime(utcString: string | null): string {
  if (!utcString) return "";
  const date = new Date(utcString);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Convert UTC ISO string to local datetime-local input format
 * @param utcString - ISO UTC date string from database
 * @returns String in format "YYYY-MM-DDTHH:mm" for datetime-local input
 */
export function utcToLocalDatetimeInput(utcString: string | null): string {
  if (!utcString) return "";
  const date = new Date(utcString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convert local datetime-local input string to UTC ISO string
 * @param localString - String from datetime-local input (local time)
 * @returns ISO UTC date string for database storage
 */
export function localDatetimeInputToUtc(localString: string): string {
  if (!localString) return "";
  const localDate = new Date(localString);
  return localDate.toISOString();
}

/**
 * Get the user's current timezone name
 * @returns Timezone name (e.g., "Europe/Vienna")
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get relative time string (e.g., "in 5 minutes", "2 hours ago")
 * @param utcString - ISO UTC date string
 * @returns Relative time string
 */
export function getRelativeTime(utcString: string | null): string {
  if (!utcString) return "";

  const date = new Date(utcString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (Math.abs(diffMins) < 1) return "now";

  if (diffMins > 0) {
    // Future
    if (diffMins < 60)
      return `in ${diffMins} minute${diffMins === 1 ? "" : "s"}`;
    if (diffHours < 24)
      return `in ${diffHours} hour${diffHours === 1 ? "" : "s"}`;
    return `in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
  } else {
    // Past
    const absMins = Math.abs(diffMins);
    const absHours = Math.abs(diffHours);
    const absDays = Math.abs(diffDays);
    if (absMins < 60) return `${absMins} minute${absMins === 1 ? "" : "s"} ago`;
    if (absHours < 24)
      return `${absHours} hour${absHours === 1 ? "" : "s"} ago`;
    return `${absDays} day${absDays === 1 ? "" : "s"} ago`;
  }
}

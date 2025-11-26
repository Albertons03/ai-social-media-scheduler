import { PostStatus } from "@/lib/types/database.types";
import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";

interface PostStatusBadgeProps {
  status: PostStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function PostStatusBadge({
  status,
  size = "md",
  showIcon = true,
}: PostStatusBadgeProps) {
  const statusConfig = {
    draft: {
      label: "Draft",
      icon: FileText,
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      dotColor: "bg-gray-400",
    },
    scheduled: {
      label: "Scheduled",
      icon: Clock,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      dotColor: "bg-blue-400",
    },
    published: {
      label: "Published",
      icon: CheckCircle,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      dotColor: "bg-green-400",
    },
    failed: {
      label: "Failed",
      icon: AlertCircle,
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      dotColor: "bg-red-400",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-2 text-sm gap-2",
    lg: "px-4 py-3 text-base gap-2",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"} />}
      {config.label}
    </div>
  );
}

/**
 * Minimal dot indicator for status
 */
export function PostStatusDot({ status }: { status: PostStatus }) {
  const statusConfig = {
    draft: "bg-gray-400",
    scheduled: "bg-blue-400",
    published: "bg-green-400",
    failed: "bg-red-400",
  };

  return (
    <div
      className={`w-3 h-3 rounded-full ${statusConfig[status]}`}
      title={status.charAt(0).toUpperCase() + status.slice(1)}
    />
  );
}

/**
 * Status indicator with tooltip
 */
export function PostStatusIndicator({ status }: { status: PostStatus }) {
  const statusEmoji = {
    draft: "📝",
    scheduled: "⏰",
    published: "✅",
    failed: "❌",
  };

  const statusLabel = {
    draft: "Draft",
    scheduled: "Scheduled",
    published: "Published",
    failed: "Failed",
  };

  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium"
      title={statusLabel[status]}
    >
      <span>{statusEmoji[status]}</span>
      <span>{statusLabel[status]}</span>
    </div>
  );
}

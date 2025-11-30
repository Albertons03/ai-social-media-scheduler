"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Unlink } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SocialAccountActionsProps {
  accountId: string;
  platform: string;
  accountHandle: string;
}

export function SocialAccountActions({
  accountId,
  platform,
  accountHandle,
}: SocialAccountActionsProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleDisconnect = async () => {
    if (!confirm(`Are you sure you want to disconnect @${accountHandle}?`)) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const response = await fetch(`/api/social-accounts/${accountId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect account");
      }

      toast.success(`${platform} account disconnected`);
      router.refresh(); // Refresh the page to update the UI
    } catch (error) {
      console.error("Error disconnecting account:", error);
      toast.error("Failed to disconnect account");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(
        `/api/social-accounts/${accountId}/refresh`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to refresh token");
      }

      toast.success(`${platform} token refreshed successfully`);
      router.refresh();
    } catch (error: any) {
      console.error("Error refreshing token:", error);
      toast.error(
        error.message ||
          "Failed to refresh token. Please reconnect your account."
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDisconnect}
        disabled={isDisconnecting}
      >
        {isDisconnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Unlink className="h-4 w-4 mr-1" />
        )}
        {isDisconnecting ? "Disconnecting..." : "Disconnect"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4 mr-1" />
        )}
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  );
}

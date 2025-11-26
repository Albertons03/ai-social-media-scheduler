"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PublishSuccessModalProps {
  isOpen: boolean;
  platform: string;
  postId: string;
  platformPostId?: string;
  onClose?: () => void;
}

export function PublishSuccessModal({
  isOpen,
  platform,
  postId,
  platformPostId,
  onClose,
}: PublishSuccessModalProps) {
  const router = useRouter();

  const platformUrls: Record<string, (id: string) => string> = {
    tiktok: (id) => `https://www.tiktok.com/@yourhandle/video/${id}`,
    twitter: (id) => `https://twitter.com/yourhandle/status/${id}`,
    linkedin: (id) => `https://linkedin.com/in/yourprofile/`,
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      tiktok: "🎵",
      twitter: "𝕏",
      linkedin: "💼",
    };
    return icons[platform] || "📱";
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Post Published Successfully!
          </DialogTitle>
          <DialogDescription>
            Your post has been published to {platform}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Platform Icon and Name */}
          <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
            <span className="text-4xl">{getPlatformIcon(platform)}</span>
            <div>
              <p className="font-semibold text-lg capitalize">{platform}</p>
              <p className="text-sm text-muted-foreground">
                Post ID: {platformPostId?.substring(0, 20)}
                {platformPostId && platformPostId.length > 20 && "..."}
              </p>
            </div>
          </div>

          {/* Success Message */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Your post is now live and visible to your audience on {platform}!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">📈</p>
              <p className="text-xs text-blue-700 mt-1">View Analytics</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">⚡</p>
              <p className="text-xs text-purple-700 mt-1">Publishing Speed</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClose}
          >
            Close
          </Button>
          {platformPostId && (
            <Button
              className="flex-1 gap-2"
              onClick={() => {
                const url = platformUrls[platform]?.(platformPostId) || "#";
                window.open(url, "_blank");
              }}
            >
              <ExternalLink className="h-4 w-4" />
              View Post
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

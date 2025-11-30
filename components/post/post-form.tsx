"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Calendar, Loader2, AlertCircle } from "lucide-react";
import { Platform, PrivacyLevel } from "@/lib/types/database.types";

interface SocialAccount {
  id: string;
  platform: string;
  account_name: string;
  account_handle: string;
  is_active: boolean;
}

interface PostFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isEditing?: boolean;
}

// Helper: Convert UTC ISO string to local datetime-local format
function utcToLocalDatetimeString(utcString: string | null): string {
  if (!utcString) return "";
  const date = new Date(utcString);
  // Format: YYYY-MM-DDTHH:mm (required by datetime-local input)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Helper: Convert local datetime-local string to UTC ISO string
function localDatetimeStringToUtc(localString: string): string {
  if (!localString) return "";
  // datetime-local gives us local time, create Date and convert to ISO (UTC)
  const localDate = new Date(localString);
  return localDate.toISOString();
}

export function PostForm({
  onSubmit,
  initialData,
  isEditing = false,
}: PostFormProps) {
  const [platform, setPlatform] = useState<Platform>(
    initialData?.platform || "twitter"
  );
  const [content, setContent] = useState(initialData?.content || "");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  // Store as local datetime string for the input
  const [scheduledFor, setScheduledFor] = useState(
    utcToLocalDatetimeString(initialData?.scheduled_for) || ""
  );
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(
    initialData?.privacy_level || "PUBLIC"
  );
  const [allowComments, setAllowComments] = useState(
    initialData?.allow_comments ?? true
  );
  const [allowDuet, setAllowDuet] = useState(initialData?.allow_duet ?? true);
  const [allowStitch, setAllowStitch] = useState(
    initialData?.allow_stitch ?? true
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);

  // Social accounts state
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    initialData?.social_account_id || ""
  );
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  // Fetch social accounts on mount
  useEffect(() => {
    fetchSocialAccounts();
    // Set initial preview if editing
    if (initialData?.media_url) {
      setMediaPreviewUrl(initialData.media_url);
    }
  }, []);

  // Auto-select account when platform changes
  useEffect(() => {
    const accountForPlatform = socialAccounts.find(
      (acc) => acc.platform === platform && acc.is_active
    );
    if (accountForPlatform) {
      setSelectedAccountId(accountForPlatform.id);
    } else {
      setSelectedAccountId("");
    }
  }, [platform, socialAccounts]);

  // Fetch social accounts from API
  const fetchSocialAccounts = async () => {
    try {
      const response = await fetch("/api/social-accounts");
      if (!response.ok) throw new Error("Failed to fetch accounts");
      const data = await response.json();
      setSocialAccounts(data);

      // Auto-select first active account for the default platform
      const defaultAccount = data.find(
        (acc: SocialAccount) => acc.platform === platform && acc.is_active
      );
      if (defaultAccount) {
        setSelectedAccountId(defaultAccount.id);
      }
    } catch (error) {
      console.error("Error fetching social accounts:", error);
      toast.error("Failed to load social accounts");
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // Get accounts for selected platform
  const accountsForPlatform = socialAccounts.filter(
    (acc) => acc.platform === platform && acc.is_active
  );

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Validate file size
      const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`File too large. Max: ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only images (JPEG, PNG, WebP) and videos (MP4, MOV) are supported');
        return;
      }

      setMediaFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaFile(null);
      setMediaPreviewUrl(initialData?.media_url || null);
    }
  };

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    toast.loading("Generating content with AI...", { id: "ai-generate" });
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: content || "Generate an engaging social media post",
          platform,
          tone: "engaging",
          length: "medium",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate content");

      const data = await response.json();
      setContent(data.content);
      toast.success("Content generated successfully!", { id: "ai-generate" });
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.", {
        id: "ai-generate",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate social account selection
    if (!selectedAccountId) {
      toast.error(
        "Please connect a social account first. Go to Settings to connect your account."
      );
      return;
    }

    setIsLoading(true);
    toast.loading("Saving post...", { id: "post-save" });

    try {
      let mediaUrl = initialData?.media_url;
      let thumbnailUrl = initialData?.thumbnail_url;

      // Upload media file if provided
      if (mediaFile) {
        toast.loading("Uploading media...", { id: "post-save" });
        const formData = new FormData();
        formData.append("file", mediaFile);
        formData.append("type", "media");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload media");
        const data = await response.json();
        mediaUrl = data.url;
      }

      // Upload thumbnail if provided
      if (thumbnailFile) {
        toast.loading("Uploading thumbnail...", { id: "post-save" });
        const formData = new FormData();
        formData.append("file", thumbnailFile);
        formData.append("type", "thumbnail");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload thumbnail");
        const data = await response.json();
        thumbnailUrl = data.url;
      }

      // Convert local time to UTC for the database
      const scheduledForUtc = scheduledFor
        ? localDatetimeStringToUtc(scheduledFor)
        : null;

      const postData = {
        platform,
        content,
        social_account_id: selectedAccountId,
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        media_type: mediaFile
          ? mediaFile.type.startsWith("video/")
            ? "video"
            : "image"
          : initialData?.media_type,
        scheduled_for: scheduledForUtc,
        status: scheduledFor ? "scheduled" : "draft",
        privacy_level: platform === "tiktok" ? privacyLevel : undefined,
        allow_comments: platform === "tiktok" ? allowComments : undefined,
        allow_duet: platform === "tiktok" ? allowDuet : undefined,
        allow_stitch: platform === "tiktok" ? allowStitch : undefined,
      };

      await onSubmit(postData);
      toast.success(
        isEditing ? "Post updated successfully!" : "Post created successfully!",
        { id: "post-save" }
      );
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("Failed to save post. Please try again.", {
        id: "post-save",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get current local timezone name for display
  const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Platform Selection */}
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              disabled={isEditing}
            >
              <option value="twitter">Twitter</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
            </Select>
          </div>

          {/* Account Selection */}
          <div>
            <Label htmlFor="account">Account</Label>
            {isLoadingAccounts ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading accounts...
              </div>
            ) : accountsForPlatform.length === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">No {platform} account connected</p>
                  <p className="text-sm">
                    <a
                      href="/settings"
                      className="underline hover:no-underline"
                    >
                      Go to Settings
                    </a>{" "}
                    to connect your {platform} account.
                  </p>
                </div>
              </div>
            ) : (
              <Select
                id="account"
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
              >
                {accountsForPlatform.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_name} (@{account.account_handle})
                  </option>
                ))}
              </Select>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="content">Content</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateContent}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content..."
              rows={6}
              required
            />
          </div>

          {/* Media Upload */}
          <div>
            <Label htmlFor="media">Media (Image/Video)</Label>
            <Input
              id="media"
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
            />
            {mediaPreviewUrl && (
              <div className="mt-4 rounded-lg overflow-hidden bg-gray-100">
                {mediaFile?.type.startsWith("video/") || initialData?.media_type === "video" ? (
                  <video
                    src={mediaPreviewUrl}
                    controls
                    className="w-full max-h-80 object-contain"
                  />
                ) : (
                  <img
                    src={mediaPreviewUrl}
                    alt="Media preview"
                    className="w-full max-h-80 object-contain"
                  />
                )}
              </div>
            )}
          </div>

          {/* Thumbnail Upload (for videos) */}
          {(mediaFile?.type.startsWith("video/") ||
            initialData?.media_type === "video") && (
            <div>
              <Label htmlFor="thumbnail">Thumbnail (Optional)</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
            </div>
          )}

          {/* Schedule Date - with timezone info */}
          <div>
            <Label htmlFor="scheduled_for">
              <Calendar className="inline h-4 w-4 mr-2" />
              Schedule For (Optional)
            </Label>
            <Input
              id="scheduled_for"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Your timezone: {timezoneName}
            </p>
          </div>

          {/* TikTok-specific settings */}
          {platform === "tiktok" && (
            <>
              <div>
                <Label htmlFor="privacy">Privacy Level</Label>
                <Select
                  id="privacy"
                  value={privacyLevel}
                  onChange={(e) =>
                    setPrivacyLevel(e.target.value as PrivacyLevel)
                  }
                >
                  <option value="PUBLIC">Public</option>
                  <option value="FRIENDS">Friends Only</option>
                  <option value="PRIVATE">Private</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Checkbox
                  id="allow_comments"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                  label="Allow Comments"
                />
                <Checkbox
                  id="allow_duet"
                  checked={allowDuet}
                  onChange={(e) => setAllowDuet(e.target.checked)}
                  label="Allow Duet"
                />
                <Checkbox
                  id="allow_stitch"
                  checked={allowStitch}
                  onChange={(e) => setAllowStitch(e.target.checked)}
                  label="Allow Stitch"
                />
              </div>
            </>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading || !selectedAccountId}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isLoading
                ? "Saving..."
                : isEditing
                ? "Update Post"
                : "Create Post"}
            </Button>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

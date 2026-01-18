"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Calendar,
  Loader2,
  AlertCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Platform, PrivacyLevel } from "@/lib/types/database.types";
import {
  getOptimalTimes,
  getNextOptimalTime,
  formatOptimalTime,
} from "@/lib/utils/optimal-posting-times";

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
  const [addTimestamp, setAddTimestamp] = useState(true); // Auto-timestamp to prevent duplicates
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
      const maxSize = file.type.startsWith("video/")
        ? 50 * 1024 * 1024
        : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`File too large. Max: ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "video/mp4",
        "video/quicktime",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Only images (JPEG, PNG, WebP) and videos (MP4, MOV) are supported"
        );
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

      if (!response.ok) {
        let errorMessage = "Failed to generate content";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, try to get text error
          try {
            const textError = await response.text();
            console.error("API returned non-JSON error:", textError);
            errorMessage = `Server error (${response.status})`;
          } catch {
            errorMessage = `Server error (${response.status})`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setContent(data.content);
      toast.success("Content generated successfully!", { id: "ai-generate" });
    } catch (error) {
      console.error("Error generating content:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate content. Please try again.";
      toast.error(errorMessage, {
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

      // Upload media file directly to Supabase Storage if provided
      if (mediaFile) {
        toast.loading("Uploading media...", { id: "post-save" });

        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const extension = mediaFile.name.split(".").pop();
        const filename = `${user.id}/${timestamp}-${randomString}.${extension}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("media")
          .upload(filename, mediaFile, {
            contentType: mediaFile.type,
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Failed to upload media: ${uploadError.message}`);
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("media").getPublicUrl(filename);

        mediaUrl = publicUrl;
      }

      // Upload thumbnail directly to Supabase Storage if provided
      if (thumbnailFile) {
        toast.loading("Uploading thumbnail...", { id: "post-save" });

        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not authenticated");

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const extension = thumbnailFile.name.split(".").pop();
        const filename = `${user.id}/${timestamp}-${randomString}.${extension}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("thumbnails")
          .upload(filename, thumbnailFile, {
            contentType: thumbnailFile.type,
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Thumbnail upload error:", uploadError);
          throw new Error(
            `Failed to upload thumbnail: ${uploadError.message}`
          );
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("thumbnails").getPublicUrl(filename);

        thumbnailUrl = publicUrl;
      }

      // Convert local time to UTC for the database
      const scheduledForUtc = scheduledFor
        ? localDatetimeStringToUtc(scheduledFor)
        : null;

      // Add unique timestamp if enabled (prevents Twitter duplicate content errors)
      let finalContent = content;
      if (addTimestamp && platform === "twitter") {
        const now = new Date();
        const timestamp = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        finalContent = `${content.trim()} ⚡ ${timestamp}`;
      }

      const postData = {
        platform,
        content: finalContent,
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
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save post. Please try again.";
      toast.error(errorMessage, {
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
              value={platform}
              onValueChange={(value) => setPlatform(value as Platform)}
              disabled={isEditing}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Selection */}
          <div>
            <Label htmlFor="account">Account</Label>
            {isLoadingAccounts ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
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
                value={selectedAccountId}
                onValueChange={setSelectedAccountId}
              >
                <SelectTrigger id="account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accountsForPlatform.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_name} (@{account.account_handle})
                    </SelectItem>
                  ))}
                </SelectContent>
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
              <div className="mt-4 rounded-lg overflow-hidden bg-accent">
                {mediaFile?.type.startsWith("video/") ||
                initialData?.media_type === "video" ? (
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

          {/* Schedule Date - with timezone info and recommendations */}
          <div>
            <Label htmlFor="scheduled_for">
              <Calendar className="inline h-4 w-4 mr-2" />
              Schedule For (Optional)
            </Label>

            {/* Recommended Times */}
            {platform && (
              <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Recommended Times for{" "}
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getOptimalTimes(
                    platform as "twitter" | "linkedin" | "tiktok"
                  )
                    .slice(0, 3)
                    .map((optimalTime, index) => {
                      const nextDate = new Date();
                      const targetDay = optimalTime.dayOfWeek;
                      const currentDay = nextDate.getDay();
                      const daysToAdd =
                        (targetDay - currentDay + 7) % 7 ||
                        (optimalTime.hour > nextDate.getHours() ? 0 : 7);
                      nextDate.setDate(nextDate.getDate() + daysToAdd);
                      nextDate.setHours(optimalTime.hour, 0, 0, 0);

                      const dateTimeString = nextDate
                        .toISOString()
                        .slice(0, 16);

                      return (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs hover:bg-blue-100 border-blue-300"
                          onClick={() => setScheduledFor(dateTimeString)}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {formatOptimalTime(nextDate).split(",")[0]}{" "}
                          {optimalTime.hour}:00
                        </Button>
                      );
                    })}
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Click to auto-fill optimal posting times
                </p>
              </div>
            )}

            <Input
              id="scheduled_for"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your timezone: {timezoneName}
            </p>
          </div>

          {/* Twitter-specific: Add unique timestamp */}
          {platform === "twitter" && (
            <div className="flex items-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Checkbox
                id="add_timestamp"
                checked={addTimestamp}
                onChange={(e) => setAddTimestamp(e.target.checked)}
              />
              <div className="space-y-1">
                <Label
                  htmlFor="add_timestamp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Add unique timestamp ⚡
                </Label>
                <p className="text-xs text-muted-foreground">
                  Prevents Twitter duplicate content errors by adding a
                  timestamp to your tweet
                </p>
              </div>
            </div>
          )}

          {/* TikTok-specific settings */}
          {platform === "tiktok" && (
            <>
              <div>
                <Label htmlFor="privacy">Privacy Level</Label>
                <Select
                  value={privacyLevel}
                  onValueChange={(value) =>
                    setPrivacyLevel(value as PrivacyLevel)
                  }
                >
                  <SelectTrigger id="privacy">
                    <SelectValue placeholder="Select privacy level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="FRIENDS">Friends Only</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                  </SelectContent>
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
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

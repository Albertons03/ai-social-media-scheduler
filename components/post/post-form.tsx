'use client';

import * as React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Upload, Calendar, Loader2 } from 'lucide-react';
import { Platform, PrivacyLevel } from '@/lib/types/database.types';

interface PostFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isEditing?: boolean;
}

export function PostForm({ onSubmit, initialData, isEditing = false }: PostFormProps) {
  const [platform, setPlatform] = useState<Platform>(initialData?.platform || 'tiktok');
  const [content, setContent] = useState(initialData?.content || '');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [scheduledFor, setScheduledFor] = useState(initialData?.scheduled_for || '');
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(initialData?.privacy_level || 'PUBLIC');
  const [allowComments, setAllowComments] = useState(initialData?.allow_comments ?? true);
  const [allowDuet, setAllowDuet] = useState(initialData?.allow_duet ?? true);
  const [allowStitch, setAllowStitch] = useState(initialData?.allow_stitch ?? true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    toast.loading('Generating content with AI...', { id: 'ai-generate' });
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content || 'Generate an engaging social media post',
          platform,
          tone: 'engaging',
          length: 'medium',
        }),
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const data = await response.json();
      setContent(data.content);
      toast.success('Content generated successfully!', { id: 'ai-generate' });
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.', { id: 'ai-generate' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Saving post...', { id: 'post-save' });

    try {
      let mediaUrl = initialData?.media_url;
      let thumbnailUrl = initialData?.thumbnail_url;

      // Upload media file if provided
      if (mediaFile) {
        toast.loading('Uploading media...', { id: 'post-save' });
        const formData = new FormData();
        formData.append('file', mediaFile);
        formData.append('type', 'media');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload media');
        const data = await response.json();
        mediaUrl = data.url;
      }

      // Upload thumbnail if provided
      if (thumbnailFile) {
        toast.loading('Uploading thumbnail...', { id: 'post-save' });
        const formData = new FormData();
        formData.append('file', thumbnailFile);
        formData.append('type', 'thumbnail');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload thumbnail');
        const data = await response.json();
        thumbnailUrl = data.url;
      }

      const postData = {
        platform,
        content,
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        media_type: mediaFile ? (mediaFile.type.startsWith('video/') ? 'video' : 'image') : initialData?.media_type,
        scheduled_for: scheduledFor || null,
        status: scheduledFor ? 'scheduled' : 'draft',
        privacy_level: platform === 'tiktok' ? privacyLevel : undefined,
        allow_comments: platform === 'tiktok' ? allowComments : undefined,
        allow_duet: platform === 'tiktok' ? allowDuet : undefined,
        allow_stitch: platform === 'tiktok' ? allowStitch : undefined,
      };

      await onSubmit(postData);
      toast.success(isEditing ? 'Post updated successfully!' : 'Post created successfully!', { id: 'post-save' });
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('Failed to save post. Please try again.', { id: 'post-save' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Post' : 'Create New Post'}</CardTitle>
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
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
            </Select>
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
                {isGenerating ? 'Generating...' : 'Generate with AI'}
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
              onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* Thumbnail Upload (for videos) */}
          {(mediaFile?.type.startsWith('video/') || initialData?.media_type === 'video') && (
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

          {/* Schedule Date */}
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
          </div>

          {/* TikTok-specific settings */}
          {platform === 'tiktok' && (
            <>
              <div>
                <Label htmlFor="privacy">Privacy Level</Label>
                <Select
                  id="privacy"
                  value={privacyLevel}
                  onChange={(e) => setPrivacyLevel(e.target.value as PrivacyLevel)}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isLoading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
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

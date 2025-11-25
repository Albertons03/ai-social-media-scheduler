'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarView } from '@/components/calendar/calendar-view';
import { PostForm } from '@/components/post/post-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Plus, CalendarOff } from 'lucide-react';
import { Post } from '@/lib/types/database.types';

export default function SchedulePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (postData: any) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error('Failed to create post');

      await fetchPosts();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const handleDateClick = (date: Date) => {
    // Open create modal with pre-filled date
    setIsCreateModalOpen(true);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Schedule Posts</h1>
            <p className="text-gray-600 mt-2">
              Manage and schedule your social media posts
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Calendar View */}
        <CalendarView
          posts={posts.filter((p) => p.scheduled_for)}
          onDateClick={handleDateClick}
          onPostClick={handlePostClick}
        />

        {/* Upcoming Posts List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">All Posts</h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y">
            {posts.length === 0 ? (
              <div className="p-16 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <CalendarOff className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Get started by creating your first social media post. Use AI to generate engaging content!
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            post.platform === 'tiktok'
                              ? 'bg-pink-100 text-pink-700'
                              : post.platform === 'linkedin'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {post.platform}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : post.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : post.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {post.content.substring(0, 100)}
                        {post.content.length > 100 ? '...' : ''}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {post.scheduled_for
                          ? `Scheduled for ${new Date(post.scheduled_for).toLocaleString()}`
                          : post.published_at
                          ? `Published ${new Date(post.published_at).toLocaleString()}`
                          : 'Draft'}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{post.views_count} views</p>
                      <p>{post.likes_count} likes</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogClose onClose={() => setIsCreateModalOpen(false)} />
          </DialogHeader>
          <PostForm onSubmit={handleCreatePost} />
        </DialogContent>
      </Dialog>

      {/* View/Edit Post Modal */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Post Details</DialogTitle>
              <DialogClose onClose={() => setSelectedPost(null)} />
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Content</h3>
                <p className="text-gray-700">{selectedPost.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Platform</h3>
                  <p className="text-gray-700 capitalize">{selectedPost.platform}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <p className="text-gray-700 capitalize">{selectedPost.status}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Views</h3>
                  <p className="text-gray-700">{selectedPost.views_count.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Likes</h3>
                  <p className="text-gray-700">{selectedPost.likes_count.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Comments</h3>
                  <p className="text-gray-700">{selectedPost.comments_count.toLocaleString()}</p>
                </div>
              </div>
              {selectedPost.media_url && (
                <div>
                  <h3 className="font-semibold mb-2">Media</h3>
                  {selectedPost.media_type === 'video' ? (
                    <video src={selectedPost.media_url} controls className="w-full rounded-lg" />
                  ) : (
                    <img src={selectedPost.media_url} alt="Post media" className="w-full rounded-lg" />
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

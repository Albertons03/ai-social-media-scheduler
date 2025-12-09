import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/upload - Upload media file to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string; // 'media' or 'thumbnail'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPEG, PNG, WebP) and videos (MP4, MOV) are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB for TikTok videos per their API, 10MB for images)
    let maxSize = 10 * 1024 * 1024; // 10MB for images
    if (file.type.startsWith('video/')) {
      maxSize = 50 * 1024 * 1024; // 50MB for videos (TikTok API limit)
    }
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max size: ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Validate video format for TikTok requirements
    if (file.type.startsWith('video/')) {
      // TikTok requires MP4 format
      if (file.type !== 'video/mp4' && file.type !== 'video/quicktime') {
        return NextResponse.json(
          { error: 'Video must be in MP4 or MOV format for TikTok compatibility.' },
          { status: 400 }
        );
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const filename = `${user.id}/${timestamp}-${randomString}.${extension}`;

    // Determine bucket based on file type
    const bucket = fileType === 'thumbnail' ? 'thumbnails' : 'media';

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: `Failed to upload file: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filename);

    return NextResponse.json({
      url: publicUrl,
      filename: data.path,
      type: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete a file from Supabase Storage
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const bucket = searchParams.get('bucket') || 'media';

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Verify the file belongs to the user
    if (!filename.startsWith(user.id)) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this file' },
        { status: 403 }
      );
    }

    const { error } = await supabase.storage.from(bucket).remove([filename]);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

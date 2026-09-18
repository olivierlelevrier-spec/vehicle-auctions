import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const announcementId = formData.get('announcementId') as string;

    if (!file || !announcementId) {
      return NextResponse.json(
        { error: 'Missing file or announcement ID' },
        { status: 400 }
      );
    }

    // In production, upload to Supabase Storage or AWS S3
    // For now, return a placeholder image URL
    const filename = `${announcementId}-${Date.now()}-${file.name}`;

    return NextResponse.json({
      success: true,
      url: `/images/${filename}`,
      filename: filename,
      message: 'Photo uploaded successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename safely
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.name.split('.').pop() || 'jpeg';
    const filename = `product-upload-${uniqueSuffix}.${extension}`;
    
    const uploadDir = path.join(process.cwd(), 'public/images');
    const filepath = path.join(uploadDir, filename);

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    await fs.writeFile(filepath, buffer);

    return NextResponse.json({ url: `/images/${filename}` });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

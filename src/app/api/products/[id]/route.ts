import { NextResponse } from 'next/server';
import { updateProduct, deleteProduct, getProductById } from '@/lib/data';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const resolvedParams = await params;
    const updated = await updateProduct(resolvedParams.id, body);
    if (!updated) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const success = await deleteProduct(resolvedParams.id);
  if (!success) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

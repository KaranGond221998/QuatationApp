import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const type = (formData.get('type') as string) || 'asset'; // 'logo', 'signature', 'stamp'
        const vendorId = (formData.get('vendor_id') as string) || 'general';

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
        }

        const supabase = getServerSupabase();
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Clean filename
        const rawExt = file.name.split('.').pop()?.toLowerCase() || 'png';
        const ext = ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(rawExt) ? rawExt : 'png';
        const cleanVendorId = vendorId.replace(/[^a-zA-Z0-9_-]/g, '');
        const fileName = `${cleanVendorId}/${type}-${Date.now()}.${ext}`;

        const { data, error } = await supabase.storage
            .from('vendor-assets')
            .upload(fileName, buffer, {
                contentType: file.type || `image/${ext === 'svg' ? 'svg+xml' : ext}`,
                upsert: true,
            });

        if (error) {
            console.error('Supabase storage upload error:', error);
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('vendor-assets')
            .getPublicUrl(fileName);

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName: fileName,
            message: `${type.toUpperCase()} uploaded successfully`,
        });
    } catch (error: any) {
        console.error('API Upload error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'File upload failed' },
            { status: 500 }
        );
    }
}

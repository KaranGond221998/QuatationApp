import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/authGuard';
import { getTenantStoragePath } from '@/lib/multiTenant';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) return unauthorizedResponse();

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const type = ((formData.get('type') as string) || 'asset').toLowerCase(); // 'logo', 'signature', 'stamp', 'qr', 'barcode'
        const vendorId = formData.get('vendor_id') as string | null;
        const autoUpdateDb = formData.get('auto_update_db') !== 'false';

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ success: false, message: 'File too large. Maximum size is 5 MB.' }, { status: 400 });
        }

        const supabase = getServerSupabase();

        // Resolve vendor and node_id
        let targetVendor: any = null;
        let nodeId = 'general';

        if (vendorId) {
            const { data: v } = await supabase
                .from('vendors')
                .select('id, name, node_id')
                .eq('id', vendorId)
                .single();
            if (v) {
                targetVendor = v;
                nodeId = v.node_id || v.id;
            }
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Clean filename and extension
        const rawExt = file.name.split('.').pop()?.toLowerCase() || 'png';
        const ext = ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(rawExt) ? rawExt : 'png';
        const cleanType = ['logo', 'signature', 'stamp', 'qr', 'barcode'].includes(type) ? type : 'asset';
        const storageType = cleanType === 'barcode' ? 'qr' : cleanType as any;

        const fileName = getTenantStoragePath(
            nodeId,
            storageType,
            `${Date.now()}.${ext}`
        );

        const { error } = await supabase.storage
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

        // Optionally auto-update vendor record in database
        let updatedColumn = null;
        if (targetVendor && autoUpdateDb) {
            const updatePayload: Record<string, string> = {};
            if (cleanType === 'logo') {
                updatePayload.logo_url = publicUrl;
                updatedColumn = 'logo_url';
            } else if (cleanType === 'signature') {
                updatePayload.signature_url = publicUrl;
                updatedColumn = 'signature_url';
            } else if (cleanType === 'stamp') {
                updatePayload.stamp_url = publicUrl;
                updatedColumn = 'stamp_url';
            } else if (cleanType === 'qr' || cleanType === 'barcode') {
                updatePayload.qr_code_url = publicUrl;
                updatedColumn = 'qr_code_url';
            }

            if (Object.keys(updatePayload).length > 0) {
                await supabase
                    .from('vendors')
                    .update(updatePayload)
                    .eq('id', targetVendor.id);
            }
        }

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName: fileName,
            nodeId: nodeId,
            updatedColumn,
            message: `${cleanType.toUpperCase()} uploaded successfully to tenant vault`,
        });
    } catch (error: any) {
        console.error('API Upload error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'File upload failed' },
            { status: 500 }
        );
    }
}

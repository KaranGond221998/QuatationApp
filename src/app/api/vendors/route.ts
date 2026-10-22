import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

// GET - List all vendors or get single vendor
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const slug = searchParams.get('slug');
        const activeOnly = searchParams.get('active') === 'true';

        const supabase = getServerSupabase();

        if (id) {
            const { data, error } = await supabase
                .from('vendors')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return NextResponse.json({ success: true, data });
        }

        if (slug) {
            const { data, error } = await supabase
                .from('vendors')
                .select('*')
                .eq('slug', slug)
                .single();
            if (error) throw error;
            return NextResponse.json({ success: true, data });
        }

        let query = supabase
            .from('vendors')
            .select('*, quotations(count)')
            .order('name', { ascending: true });

        if (activeOnly) {
            query = query.eq('status', 'active');
        }

        const { data, error } = await query;
        if (error) throw error;

        return NextResponse.json({ success: true, data: data || [] });
    } catch (error: any) {
        console.error('Fetch vendors error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to fetch vendors' }, { status: 500 });
    }
}

// POST - Create a new vendor and optionally create their login credentials
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name,
            tagline,
            gstin,
            phone,
            alternate_phone,
            email,
            password,
            head_office,
            registered_office,
            bank_name,
            bank_branch,
            account_name,
            account_number,
            ifsc,
            upi_id,
            logo_url,
            signature_url,
            authorized_signatory,
            default_margin,
            role = 'vendor'
        } = body;

        if (!name) {
            return NextResponse.json({ success: false, message: 'Vendor/Company name is required' }, { status: 400 });
        }

        const supabase = getServerSupabase();

        // Generate unique slug
        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

        // 1. Insert into vendors table
        const vendorPayload: any = {
            name: name.trim(),
            slug,
            tagline: tagline || null,
            gstin: gstin || null,
            phone: phone || null,
            alternate_phone: alternate_phone || null,
            email: email || null,
            head_office: head_office || null,
            registered_office: registered_office || null,
            bank_name: bank_name || null,
            bank_branch: bank_branch || null,
            account_name: account_name || name.trim().toUpperCase(),
            account_number: account_number || null,
            ifsc: ifsc || null,
            upi_id: upi_id || null,
            logo_url: logo_url || '/logo.png',
            signature_url: signature_url || '/signature.png',
            authorized_signatory: authorized_signatory || null,
            default_margin: Number(default_margin) || 0,
            status: 'active',
        };

        const { data: newVendor, error: vendorError } = await supabase
            .from('vendors')
            .insert([vendorPayload])
            .select()
            .single();

        if (vendorError) throw vendorError;

        let authUser: any = null;

        // 2. If email and password provided, create Supabase Auth User
        if (email && password) {
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: email.trim(),
                password: password,
                email_confirm: true,
                user_metadata: {
                    vendor_id: newVendor.id,
                    vendor_name: newVendor.name,
                    role: role,
                }
            });

            if (authError) {
                console.warn('Auth user creation warning:', authError.message);
            } else if (authData?.user) {
                authUser = authData.user;
                // Insert into vendor_users
                await supabase.from('vendor_users').insert([{
                    id: authUser.id,
                    vendor_id: newVendor.id,
                    role: role,
                    full_name: authorized_signatory || name,
                    email: email.trim(),
                }]);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Vendor created successfully',
            data: newVendor,
            authCreated: !!authUser,
        });
    } catch (error: any) {
        console.error('Create vendor error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to create vendor' }, { status: 500 });
    }
}

// PUT - Update vendor details
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Vendor ID is required' }, { status: 400 });
        }

        const supabase = getServerSupabase();

        const updatePayload: any = {
            ...updates,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('vendors')
            .update(updatePayload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Vendor updated successfully', data });
    } catch (error: any) {
        console.error('Update vendor error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to update vendor' }, { status: 500 });
    }
}

// DELETE - Deactivate/Delete vendor
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'Vendor ID is required' }, { status: 400 });
        }

        const supabase = getServerSupabase();

        // Soft delete (set status to suspended)
        const { error } = await supabase
            .from('vendors')
            .update({ status: 'suspended', updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Vendor deactivated successfully' });
    } catch (error: any) {
        console.error('Delete vendor error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to deactivate vendor' }, { status: 500 });
    }
}

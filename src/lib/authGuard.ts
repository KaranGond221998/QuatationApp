import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Validates the caller's Supabase JWT from the Authorization header
 * or from the sb-access-token cookie. Returns the authenticated user
 * or null if unauthenticated.
 *
 * For server API routes that use the service_role key for DB ops but
 * still need to verify that the caller is a real logged-in user.
 */
export async function getAuthenticatedUser(request: Request) {
    try {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY || '';

        // Create a client with the anon key (NOT service role) so we can
        // verify the user's JWT without elevating privileges.
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Try Authorization header first
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (!error && user) return user;
        }

        // Try cookie-based session (browser requests from Next.js client)
        const cookieHeader = request.headers.get('cookie') || '';
        const cookies = Object.fromEntries(
            cookieHeader.split(';').map(c => {
                const [k, ...v] = c.trim().split('=');
                return [k, v.join('=')];
            })
        );

        // Supabase stores the access token in cookies with various naming patterns
        const accessToken =
            cookies['sb-access-token'] ||
            cookies[`sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`] ||
            '';

        if (accessToken) {
            // Parse the token from the cookie (Supabase stores JSON in the cookie)
            let token = accessToken;
            try {
                const parsed = JSON.parse(decodeURIComponent(accessToken));
                if (Array.isArray(parsed) && parsed.length > 0) {
                    token = parsed[0]; // [access_token, refresh_token]
                } else if (parsed.access_token) {
                    token = parsed.access_token;
                }
            } catch {
                // Token is already a raw JWT string
            }

            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (!error && user) return user;
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Returns a 401 JSON response for unauthenticated requests.
 */
export function unauthorizedResponse(message = 'Authentication required') {
    return NextResponse.json(
        { success: false, message },
        { status: 401 }
    );
}

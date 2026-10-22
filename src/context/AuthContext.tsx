'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Vendor } from '@/types';

interface AuthContextType {
    user: any | null;
    vendor: Vendor | null;
    role: 'super_admin' | 'vendor' | 'salesperson' | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    refreshVendor: () => Promise<void>;
    switchVendor: (vendor: Vendor) => void;
    allVendors: Vendor[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [role, setRole] = useState<'super_admin' | 'vendor' | 'salesperson' | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [allVendors, setAllVendors] = useState<Vendor[]>([]);

    // Fetch vendor details for authenticated user
    const loadUserData = useCallback(async (authUser: any) => {
        try {
            if (!authUser) {
                setUser(null);
                setRole(null);
                // Default to first active vendor or fallback
                const res = await fetch('/api/vendors?active=true');
                const json = await res.json();
                if (json.success && json.data?.length > 0) {
                    setAllVendors(json.data);
                    setVendor(json.data[0]);
                }
                return;
            }

            setUser(authUser);

            // Fetch vendor_users relation
            const { data: vUserData, error: vUserErr } = await supabase
                .from('vendor_users')
                .select('*, vendors(*)')
                .eq('id', authUser.id)
                .single();

            if (vUserData) {
                setRole(vUserData.role as any);
                if (vUserData.vendors) {
                    setVendor(vUserData.vendors);
                }
            } else {
                // If user metadata has vendor_id
                const vendorId = authUser.user_metadata?.vendor_id;
                const userRole = authUser.user_metadata?.role || 'vendor';
                setRole(userRole as any);
                if (vendorId) {
                    const { data: vData } = await supabase
                        .from('vendors')
                        .select('*')
                        .eq('id', vendorId)
                        .single();
                    if (vData) setVendor(vData);
                }
            }

            // Also load all vendors for admin
            const res = await fetch('/api/vendors');
            const json = await res.json();
            if (json.success && json.data) {
                setAllVendors(json.data);
                // If no specific vendor was assigned, pick the first
                if (!vendor && json.data.length > 0) {
                    setVendor(json.data[0]);
                }
            }
        } catch (err) {
            console.error('Error loading user vendor profile:', err);
        } finally {
            setLoading(false);
        }
    }, [vendor]);

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            loadUserData(session?.user || null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            loadUserData(session?.user || null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [loadUserData]);

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                await loadUserData(data.user);
            }
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Login failed' };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        // Reset to default vendor
        if (allVendors.length > 0) {
            setVendor(allVendors[0]);
        }
    };

    const refreshVendor = async () => {
        if (user) {
            await loadUserData(user);
        }
    };

    const switchVendor = (targetVendor: Vendor) => {
        if (role === 'super_admin') {
            setVendor(targetVendor);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                vendor,
                role,
                loading,
                signIn,
                signOut,
                refreshVendor,
                switchVendor,
                allVendors,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

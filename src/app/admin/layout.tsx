'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Chip,
    Container,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LaunchIcon from '@mui/icons-material/Launch';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, role, loading, signOut } = useAuth();

    // Check loading
    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0b192c' }}>
                <CircularProgress sx={{ color: '#ff9800' }} />
            </Box>
        );
    }

    // Role-based access control: Only super_admin / developer can access /admin
    const isDeveloper = user && role === 'super_admin';

    if (!isDeveloper) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0b192c 0%, #1e3e62 100%)',
                    p: 3,
                }}
            >
                <Container maxWidth="sm">
                    <Box
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            bgcolor: 'rgba(17, 24, 39, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            textAlign: 'center',
                            color: '#fff',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        }}
                    >
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                bgcolor: 'rgba(239, 68, 68, 0.15)',
                                border: '2px solid rgba(239, 68, 68, 0.4)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                            }}
                        >
                            <LockPersonIcon sx={{ fontSize: 36, color: '#ef4444' }} />
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                            Platform Owner Area
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                            Layer 1 is reserved for the platform developer / owner to configure vendors, baseline catalogs, and credentials.
                            {user ? ` You are currently signed in as a vendor (${user.email}).` : ' You are not currently signed in.'}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                onClick={() => router.push('/login')}
                                sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' }, fontWeight: 700 }}
                            >
                                Sign In as Developer
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => router.push('/')}
                                sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', fontWeight: 700 }}
                            >
                                Go to Vendor Quotation App
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        );
    }

    const navItems = [
        { label: 'Overview', href: '/admin', icon: <DashboardIcon sx={{ fontSize: 18 }} /> },
        { label: 'Vendors & Remote Control', href: '/admin/vendors', icon: <StorefrontIcon sx={{ fontSize: 18 }} /> },
        { label: 'Global Quotations', href: '/admin/quotations', icon: <ReceiptIcon sx={{ fontSize: 18 }} /> },
        { label: 'Structure Catalog', href: '/admin/structure-catalog', icon: <Inventory2Icon sx={{ fontSize: 18 }} /> },
        { label: 'Products', href: '/admin/products', icon: <InventoryIcon sx={{ fontSize: 18 }} /> },
        { label: 'BOM Components', href: '/admin/components', icon: <SettingsInputComponentIcon sx={{ fontSize: 18 }} /> },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f1f5f9' }}>
            <AppBar position="sticky" sx={{ bgcolor: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.1)' }} elevation={0}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', minHeight: 56, px: { xs: 2, md: 3 } }}>
                    {/* Brand & Mode */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AdminPanelSettingsIcon sx={{ color: '#ff9800', fontSize: 24 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                                Platform Master Console
                            </Typography>
                        </Box>
                        <Chip
                            label="Layer 1: Developer Owner"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255, 152, 0, 0.15)',
                                color: '#ff9800',
                                border: '1px solid rgba(255, 152, 0, 0.3)',
                                fontWeight: 800,
                                fontSize: '0.7rem',
                                height: 22,
                            }}
                        />
                    </Box>

                    {/* Nav Links */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                                    <Button
                                        size="small"
                                        startIcon={item.icon}
                                        sx={{
                                            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                                            bgcolor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' },
                                            textTransform: 'none',
                                            fontWeight: isActive ? 700 : 500,
                                            fontSize: '0.8rem',
                                            px: 1.2,
                                            py: 0.5,
                                            borderRadius: 2,
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </Box>

                    {/* Right side controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                size="small"
                                endIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
                                sx={{
                                    bgcolor: '#ff9800',
                                    '&:hover': { bgcolor: '#f57c00' },
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '0.8rem',
                                    borderRadius: 2,
                                }}
                            >
                                Quotation App (Layer 2)
                            </Button>
                        </Link>

                        <Tooltip title={`Signed in as: ${user.email}`}>
                            <Chip
                                label={user.email}
                                size="small"
                                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: '0.72rem', maxWidth: 160 }}
                            />
                        </Tooltip>

                        <IconButton
                            size="small"
                            onClick={() => signOut()}
                            title="Sign Out"
                            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ef4444' } }}
                        >
                            <LogoutIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box component="main">
                {children}
            </Box>
        </Box>
    );
}

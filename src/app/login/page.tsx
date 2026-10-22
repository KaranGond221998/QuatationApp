'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Chip,
    Divider,
    Stack
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { signIn, user, vendor, role } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        if (!email || !password) {
            setErrorMsg('Please enter both email and password.');
            return;
        }

        setLoading(true);
        const res = await signIn(email, password);
        setLoading(false);

        if (!res.success) {
            setErrorMsg(res.error || 'Invalid email or password.');
        } else {
            // Route based on actual user role, not email string
            if (role === 'super_admin') {
                router.push('/admin');
            } else {
                router.push('/vendor/dashboard');
            }
        }
    };

    const fillCredentials = (demoEmail: string, demoPass: string) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        setErrorMsg('');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0b192c 0%, #1e3e62 50%, #000000 100%)',
                p: 2,
            }}
        >
            <Container maxWidth="sm">
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255, 152, 0, 0.15)',
                            border: '2px solid rgba(255, 152, 0, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1.5,
                            boxShadow: '0 0 25px rgba(255, 152, 0, 0.3)'
                        }}
                    >
                        <WbSunnyIcon sx={{ fontSize: 36, color: '#ff9800' }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                        Solar Vendor Portal
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                        Multi-Vendor Solar Quotation & Commercial Architecture
                    </Typography>
                </Box>

                <Card
                    sx={{
                        borderRadius: 4,
                        bgcolor: 'rgba(17, 24, 39, 0.85)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                        {user ? (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                                    Logged in as <strong>{user.email}</strong> ({role || 'Vendor'})
                                </Alert>
                                <Typography sx={{ color: '#fff', mb: 2 }}>
                                    Active Vendor: <strong>{vendor?.name || 'Karan Solar Shop'}</strong>
                                </Typography>
                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <Button
                                        variant="contained"
                                        onClick={() => router.push('/')}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' }, fontWeight: 700 }}
                                    >
                                        Go to Quotation Builder
                                    </Button>
                                    {role === 'super_admin' && (
                                        <Button
                                            variant="outlined"
                                            onClick={() => router.push('/admin/vendors')}
                                            sx={{ color: '#ff9800', borderColor: '#ff9800' }}
                                        >
                                            Vendor Management
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        ) : (
                            <form onSubmit={handleLogin}>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                                    Sign In with ID & Password
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                                    Enter your registered vendor credentials to access your brand quotation generator.
                                </Typography>

                                {errorMsg && (
                                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                                        {errorMsg}
                                    </Alert>
                                )}

                                <TextField
                                    fullWidth
                                    label="Email Address / Vendor ID"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="vendor@company.com"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        mb: 2.5,
                                        '& .MuiInputBase-root': { bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' },
                                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    sx={{ color: 'rgba(255,255,255,0.6)' }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        mb: 3,
                                        '& .MuiInputBase-root': { bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' },
                                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                                    }}
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        py: 1.4,
                                        borderRadius: 2,
                                        bgcolor: '#ff9800',
                                        '&:hover': { bgcolor: '#f57c00' },
                                        fontWeight: 800,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        boxShadow: '0 8px 20px rgba(255,152,0,0.3)',
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In to Dashboard'}
                                </Button>

                                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', px: 1, fontWeight: 700, letterSpacing: '0.5px' }}>
                                        ONE-CLICK DEMO ACCESS (2 LAYERS)
                                    </Typography>
                                </Divider>

                                <Stack spacing={1.5}>
                                    {/* Layer 1: Developer / Owner */}
                                    <Box
                                        onClick={() => fillCredentials('admin@karansolar.com', 'AdminPassword@123')}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: 'rgba(33, 150, 243, 0.08)',
                                            border: '1px solid rgba(33, 150, 243, 0.25)',
                                            cursor: 'pointer',
                                            transition: '0.2s',
                                            '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.15)', borderColor: '#2196f3' },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <AdminPanelSettingsIcon sx={{ color: '#2196f3' }} />
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                    <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700 }}>
                                                        Layer 1: Developer Owner
                                                    </Typography>
                                                    <Chip label="Platform Owner" size="small" sx={{ bgcolor: 'rgba(33,150,243,0.2)', color: '#60a5fa', fontWeight: 800, fontSize: '0.65rem', height: 18 }} />
                                                </Box>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    admin@karansolar.com • Manages all vendors & catalogs
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip label="Select" size="small" sx={{ bgcolor: '#2196f3', color: '#fff', fontWeight: 700, fontSize: '0.72rem' }} />
                                    </Box>

                                    {/* Layer 2: Vendor */}
                                    <Box
                                        onClick={() => fillCredentials('karan@solar.com', 'VendorPassword@123')}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: 'rgba(255, 152, 0, 0.08)',
                                            border: '1px solid rgba(255, 152, 0, 0.25)',
                                            cursor: 'pointer',
                                            transition: '0.2s',
                                            '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.15)', borderColor: '#ff9800' },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <StorefrontIcon sx={{ color: '#ff9800' }} />
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                    <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700 }}>
                                                        Layer 2: Vendor Workspace
                                                    </Typography>
                                                    <Chip label="Solar Shop" size="small" sx={{ bgcolor: 'rgba(255,152,0,0.2)', color: '#ffb74d', fontWeight: 800, fontSize: '0.65rem', height: 18 }} />
                                                </Box>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    karan@solar.com • Karan Solar Shop (Varanasi)
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip label="Select" size="small" sx={{ bgcolor: '#ff9800', color: '#fff', fontWeight: 700, fontSize: '0.72rem' }} />
                                    </Box>
                                </Stack>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

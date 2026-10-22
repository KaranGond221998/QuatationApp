'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Grid,
    Alert,
    CircularProgress,
    Divider,
    Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useAuth } from '@/context/AuthContext';

export default function VendorProfilePage() {
    const router = useRouter();
    const { user, vendor, refreshVendor, loading: authLoading } = useAuth();

    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [phone, setPhone] = useState('');
    const [alternatePhone, setAlternatePhone] = useState('');
    const [email, setEmail] = useState('');
    const [signatory, setSignatory] = useState('');
    const [gstin, setGstin] = useState('');
    const [headOffice, setHeadOffice] = useState('');
    const [registeredOffice, setRegisteredOffice] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankBranch, setBankBranch] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [upiId, setUpiId] = useState('');
    const [defaultMargin, setDefaultMargin] = useState(0);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (vendor) {
            setName(vendor.name || '');
            setTagline(vendor.tagline || '');
            setPhone(vendor.phone || '');
            setAlternatePhone(vendor.alternate_phone || '');
            setEmail(vendor.email || '');
            setSignatory(vendor.authorized_signatory || '');
            setGstin(vendor.gstin || '');
            setHeadOffice(vendor.head_office || '');
            setRegisteredOffice(vendor.registered_office || '');
            setBankName(vendor.bank_name || '');
            setBankBranch(vendor.bank_branch || '');
            setAccountName(vendor.account_name || '');
            setAccountNumber(vendor.account_number || '');
            setIfsc(vendor.ifsc || '');
            setUpiId(vendor.upi_id || '');
            setDefaultMargin(Number(vendor.default_margin) || 0);
        }
    }, [user, vendor, authLoading, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendor?.id) return;

        setSaving(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await fetch('/api/vendors', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: vendor.id,
                    name: name.trim(),
                    tagline: tagline.trim() || null,
                    phone: phone.trim() || null,
                    alternate_phone: alternatePhone.trim() || null,
                    email: email.trim() || null,
                    authorized_signatory: signatory.trim() || null,
                    gstin: gstin.trim() || null,
                    head_office: headOffice.trim() || null,
                    registered_office: registeredOffice.trim() || null,
                    bank_name: bankName.trim() || null,
                    bank_branch: bankBranch.trim() || null,
                    account_name: accountName.trim() || null,
                    account_number: accountNumber.trim() || null,
                    ifsc: ifsc.trim() || null,
                    upi_id: upiId.trim() || null,
                    default_margin: Number(defaultMargin) || 0,
                }),
            });

            const json = await res.json();
            if (!json.success) throw new Error(json.message);

            await refreshVendor();
            setSuccessMsg('Shop profile and bank details updated successfully!');
        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 4 }}>
            <Container maxWidth="md">
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.push('/vendor/dashboard')}
                            sx={{ borderColor: '#cbd5e1', color: '#475569' }}
                        >
                            Dashboard
                        </Button>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                Shop Profile & Branding
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Manage your shop details printed on every customer proposal and PDF
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {successMsg && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMsg('')}>
                        {successMsg}
                    </Alert>
                )}

                {errorMsg && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMsg('')}>
                        {errorMsg}
                    </Alert>
                )}

                {/* Stamp & Seal Preview Card */}
                <Card sx={{ mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ff9800', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VerifiedIcon fontSize="small" /> Official Signature & Company Stamp
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                            <Box
                                component="img"
                                src={vendor?.signature_url || '/signature.png'}
                                alt="Signature & Stamp"
                                sx={{ height: 80, objectFit: 'contain', bgcolor: '#f8fafc', p: 1, borderRadius: 2, border: '1px dashed #cbd5e1' }}
                            />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                    {vendor?.authorized_signatory || 'Authorized Signatory'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    This transparent seal is automatically stamped onto all customer PDFs and WhatsApp quotations.
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <form onSubmit={handleSave}>
                    {/* Company Details */}
                    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e3a5f', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <StorefrontIcon fontSize="small" /> Shop Identification
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Shop / Business Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Authorized Signatory Name"
                                        value={signatory}
                                        onChange={(e) => setSignatory(e.target.value)}
                                        placeholder="Karan Gond"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Tagline / Motto"
                                        value={tagline}
                                        onChange={(e) => setTagline(e.target.value)}
                                        placeholder="ILLUMINATING YOUR FUTURE WITH CLEAN ENERGY"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Primary Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91 9005770466"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Alternate / WhatsApp Phone"
                                        value={alternatePhone}
                                        onChange={(e) => setAlternatePhone(e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Contact Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="GSTIN Number"
                                        value={gstin}
                                        onChange={(e) => setGstin(e.target.value)}
                                        placeholder="09APKPM6299L1ZW"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Head Office Address"
                                        value={headOffice}
                                        onChange={(e) => setHeadOffice(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Bank Details */}
                    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#10b981', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccountBalanceIcon fontSize="small" /> Bank Details (For Client Payments)
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Bank Name"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        placeholder="HDFC Bank"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Branch"
                                        value={bankBranch}
                                        onChange={(e) => setBankBranch(e.target.value)}
                                        placeholder="Shivpur, Varanasi"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Account Beneficiary Name"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="KARAN SOLAR SHOP"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Account Number"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="IFSC Code"
                                        value={ifsc}
                                        onChange={(e) => setIfsc(e.target.value)}
                                        placeholder="HDFC0004807"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="UPI ID (for QR Code)"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="vyapar.173575988777@hdfcbank"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="contained"
                            type="submit"
                            size="large"
                            disabled={saving}
                            startIcon={<SaveIcon />}
                            sx={{
                                bgcolor: '#ff9800',
                                '&:hover': { bgcolor: '#f57c00' },
                                fontWeight: 800,
                                px: 4,
                                py: 1.2,
                                borderRadius: 2
                            }}
                        >
                            {saving ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save Profile Changes'}
                        </Button>
                    </Box>
                </form>
            </Container>
        </Box>
    );
}

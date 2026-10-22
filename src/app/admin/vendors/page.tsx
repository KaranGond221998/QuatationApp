'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    Alert,
    CircularProgress,
    Tooltip,
    Stack,
    Tabs,
    Tab,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyIcon from '@mui/icons-material/Key';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import TuneIcon from '@mui/icons-material/Tune';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerifiedIcon from '@mui/icons-material/Verified';
import LaunchIcon from '@mui/icons-material/Launch';
import LockResetIcon from '@mui/icons-material/LockReset';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '@/context/AuthContext';
import { Vendor } from '@/types';

export default function AdminVendorsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialVendorParam = searchParams.get('vendor_id');

    const { user, role, switchVendor, vendor: activeVendor } = useAuth();

    const [activeTab, setActiveTab] = useState(0); // 0 = Live Call Remote Control, 1 = All Vendors Directory
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog state for creating new vendor
    const [dialogOpen, setDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Remote Control Active Selected Vendor
    const [remoteVendorId, setRemoteVendorId] = useState<string>('');
    const [remoteVendor, setRemoteVendor] = useState<any | null>(null);
    const [remoteSaving, setRemoteSaving] = useState(false);
    const [remoteSuccess, setRemoteSuccess] = useState('');
    const [remoteError, setRemoteError] = useState('');

    // Remote Control Form Fields
    const [rcName, setRcName] = useState('');
    const [rcTagline, setRcTagline] = useState('');
    const [rcPhone, setRcPhone] = useState('');
    const [rcAlternatePhone, setRcAlternatePhone] = useState('');
    const [rcEmail, setRcEmail] = useState('');
    const [rcSignatory, setRcSignatory] = useState('');
    const [rcGstin, setRcGstin] = useState('');
    const [rcHeadOffice, setRcHeadOffice] = useState('');
    const [rcRegisteredOffice, setRcRegisteredOffice] = useState('');
    const [rcBankName, setRcBankName] = useState('');
    const [rcBankBranch, setRcBankBranch] = useState('');
    const [rcAccountName, setRcAccountName] = useState('');
    const [rcAccountNumber, setRcAccountNumber] = useState('');
    const [rcIfsc, setRcIfsc] = useState('');
    const [rcUpiId, setRcUpiId] = useState('');
    const [rcDefaultMargin, setRcDefaultMargin] = useState(0);
    const [rcLogoUrl, setRcLogoUrl] = useState('/logo.png');
    const [rcSignatureUrl, setRcSignatureUrl] = useState('/signature.png');
    const [rcStampUrl, setRcStampUrl] = useState('/stamp.png');
    const [rcPreferredPanelBrand, setRcPreferredPanelBrand] = useState('Adani');
    const [rcPreferredInverterBrand, setRcPreferredInverterBrand] = useState('Polycab');
    const [rcPreferredStructureMake, setRcPreferredStructureMake] = useState('APOLLO');
    const [rcCustomTerms, setRcCustomTerms] = useState('');
    const [rcResetPassword, setRcResetPassword] = useState('');

    // Upload refs for remote control
    const rcLogoInputRef = useRef<HTMLInputElement>(null);
    const rcSigInputRef = useRef<HTMLInputElement>(null);
    const rcStampInputRef = useRef<HTMLInputElement>(null);
    const [uploadingRcAsset, setUploadingRcAsset] = useState<string | null>(null);

    // Create Modal Form Fields
    const [modalName, setModalName] = useState('');
    const [modalEmail, setModalEmail] = useState('');
    const [modalPassword, setModalPassword] = useState('');
    const [modalPhone, setModalPhone] = useState('');
    const [modalSignatory, setModalSignatory] = useState('');
    const [modalGstin, setModalGstin] = useState('');
    const [modalHeadOffice, setModalHeadOffice] = useState('');
    const [modalBankName, setModalBankName] = useState('');
    const [modalAccountName, setModalAccountName] = useState('');
    const [modalAccountNumber, setModalAccountNumber] = useState('');
    const [modalIfsc, setModalIfsc] = useState('');
    const [modalUpiId, setModalUpiId] = useState('');
    const [modalDefaultMargin, setModalDefaultMargin] = useState(0);

    const loadVendors = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/vendors');
            const json = await res.json();
            if (json.success) {
                const list = json.data || [];
                setVendors(list);

                // Auto select vendor for Remote Control
                if (list.length > 0) {
                    const targetId = initialVendorParam || remoteVendorId || list[0].id;
                    const found = list.find((v: any) => v.id === targetId) || list[0];
                    selectVendorForRemoteControl(found);
                }
            }
        } catch (err) {
            console.error('Failed to load vendors:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVendors();
    }, [initialVendorParam]);

    const selectVendorForRemoteControl = (v: any) => {
        if (!v) return;
        setRemoteVendorId(v.id);
        setRemoteVendor(v);
        setRcName(v.name || '');
        setRcTagline(v.tagline || '');
        setRcPhone(v.phone || '');
        setRcAlternatePhone(v.alternate_phone || '');
        setRcEmail(v.email || '');
        setRcSignatory(v.authorized_signatory || '');
        setRcGstin(v.gstin || '');
        setRcHeadOffice(v.head_office || '');
        setRcRegisteredOffice(v.registered_office || '');
        setRcBankName(v.bank_name || '');
        setRcBankBranch(v.bank_branch || '');
        setRcAccountName(v.account_name || '');
        setRcAccountNumber(v.account_number || '');
        setRcIfsc(v.ifsc || '');
        setRcUpiId(v.upi_id || '');
        setRcDefaultMargin(Number(v.default_margin) || 0);
        setRcLogoUrl(v.logo_url || '/logo.png');
        setRcSignatureUrl(v.signature_url || '/signature.png');
        setRcStampUrl(v.stamp_url || '/stamp.png');
        setRcResetPassword('');

        const compSettings = v.components_settings || {};
        setRcPreferredPanelBrand(compSettings.preferredPanelBrand || 'Adani');
        setRcPreferredInverterBrand(compSettings.preferredInverterBrand || 'Polycab');
        setRcPreferredStructureMake(compSettings.preferredStructureMake || 'APOLLO');
        setRcCustomTerms(compSettings.customTerms || '');

        setRemoteError('');
        setRemoteSuccess('');
    };

    const handleRemoteSelectChange = (vendorId: string) => {
        const found = vendors.find(v => v.id === vendorId);
        if (found) {
            selectVendorForRemoteControl(found);
        }
    };

    // Upload Asset from Admin Remote Control
    const handleRemoteUpload = async (file: File, type: 'logo' | 'signature' | 'stamp') => {
        if (!remoteVendorId) return;
        setUploadingRcAsset(type);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            formData.append('vendor_id', remoteVendorId);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const json = await res.json();
            if (!json.success) throw new Error(json.message);

            if (type === 'logo') setRcLogoUrl(json.url);
            if (type === 'signature') setRcSignatureUrl(json.url);
            if (type === 'stamp') setRcStampUrl(json.url);

            setRemoteSuccess(`${type.toUpperCase()} uploaded to cloud bucket! Click "Save Changes" to apply.`);
        } catch (err: any) {
            setRemoteError(err.message || 'Upload failed');
        } finally {
            setUploadingRcAsset(null);
        }
    };

    // Save Remote Control Updates
    const handleSaveRemote = async () => {
        if (!remoteVendorId) return;
        setRemoteSaving(true);
        setRemoteError('');
        setRemoteSuccess('');

        try {
            const componentsSettings = {
                preferredPanelBrand: rcPreferredPanelBrand,
                preferredInverterBrand: rcPreferredInverterBrand,
                preferredStructureMake: rcPreferredStructureMake,
                customTerms: rcCustomTerms,
            };

            const payload: any = {
                id: remoteVendorId,
                name: rcName.trim(),
                tagline: rcTagline.trim() || null,
                phone: rcPhone.trim() || null,
                alternate_phone: rcAlternatePhone.trim() || null,
                email: rcEmail.trim() || null,
                authorized_signatory: rcSignatory.trim() || null,
                gstin: rcGstin.trim() || null,
                head_office: rcHeadOffice.trim() || null,
                registered_office: rcRegisteredOffice.trim() || null,
                bank_name: rcBankName.trim() || null,
                bank_branch: rcBankBranch.trim() || null,
                account_name: rcAccountName.trim() || null,
                account_number: rcAccountNumber.trim() || null,
                ifsc: rcIfsc.trim() || null,
                upi_id: rcUpiId.trim() || null,
                logo_url: rcLogoUrl,
                signature_url: rcSignatureUrl,
                stamp_url: rcStampUrl,
                default_margin: Number(rcDefaultMargin) || 0,
                components_settings: componentsSettings,
            };

            if (rcResetPassword.trim().length >= 6) {
                payload.password = rcResetPassword.trim();
            }

            const res = await fetch('/api/vendors', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const json = await res.json();
            if (!json.success) throw new Error(json.message);

            setRemoteSuccess(`Settings for "${rcName}" updated successfully! Changes are immediately live in their workspace.`);
            setRcResetPassword('');

            // Reload vendors in background
            const reloadRes = await fetch('/api/vendors');
            const reloadJson = await reloadRes.json();
            if (reloadJson.success) setVendors(reloadJson.data || []);
        } catch (err: any) {
            setRemoteError(err.message || 'Failed to update vendor settings');
        } finally {
            setRemoteSaving(false);
        }
    };

    // Open Modal for New Vendor Creation
    const handleOpenCreate = () => {
        setModalName('');
        setModalEmail('');
        setModalPassword('');
        setModalPhone('');
        setModalSignatory('');
        setModalGstin('');
        setModalHeadOffice('');
        setModalBankName('');
        setModalAccountName('');
        setModalAccountNumber('');
        setModalIfsc('');
        setModalUpiId('');
        setModalDefaultMargin(0);
        setErrorMsg('');
        setDialogOpen(true);
    };

    const handleCreateVendor = async () => {
        if (!modalName.trim()) {
            setErrorMsg('Vendor / Company name is required');
            return;
        }

        setSaving(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await fetch('/api/vendors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: modalName.trim(),
                    email: modalEmail.trim() || null,
                    password: modalPassword.trim() || null,
                    phone: modalPhone.trim() || null,
                    authorized_signatory: modalSignatory.trim() || null,
                    gstin: modalGstin.trim() || null,
                    head_office: modalHeadOffice.trim() || null,
                    bank_name: modalBankName.trim() || null,
                    account_name: modalAccountName.trim() || null,
                    account_number: modalAccountNumber.trim() || null,
                    ifsc: modalIfsc.trim() || null,
                    upi_id: modalUpiId.trim() || null,
                    default_margin: Number(modalDefaultMargin) || 0,
                }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message);

            setSuccessMsg(`Vendor "${modalName}" created with login credentials!`);
            setDialogOpen(false);
            loadVendors();
        } catch (err: any) {
            setErrorMsg(err.message || 'Operation failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async (id: string) => {
        if (!confirm('Are you sure you want to deactivate this vendor?')) return;
        try {
            const res = await fetch(`/api/vendors?id=${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (json.success) {
                loadVendors();
            }
        } catch (err) {
            console.error('Failed to deactivate vendor:', err);
        }
    };

    const handleSimulate = (v: any) => {
        switchVendor(v);
        router.push('/');
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 3 }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.push('/admin')}
                            sx={{ borderColor: '#cbd5e1', color: '#475569' }}
                        >
                            Overview
                        </Button>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                    Vendor Control & Live Call Override
                                </Typography>
                                <Chip label="Layer 1 Master Console" size="small" sx={{ bgcolor: '#0f172a', color: '#fff', fontWeight: 800 }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Select any active vendor to automatically fetch their settings, modify components, or adjust margins verbally on call
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddBusinessIcon />}
                        onClick={handleOpenCreate}
                        sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' }, fontWeight: 700 }}
                    >
                        Register New Vendor
                    </Button>
                </Box>

                {/* Mode Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={activeTab} onChange={(_e, v) => setActiveTab(v)}>
                        <Tab
                            icon={<PhoneInTalkIcon sx={{ fontSize: 18 }} />}
                            iconPosition="start"
                            label="Live Call Remote Control"
                            sx={{ fontWeight: 700, textTransform: 'none', fontSize: 14 }}
                        />
                        <Tab
                            icon={<StorefrontIcon sx={{ fontSize: 18 }} />}
                            iconPosition="start"
                            label={`All Vendors Directory (${vendors.length})`}
                            sx={{ fontWeight: 700, textTransform: 'none', fontSize: 14 }}
                        />
                    </Tabs>
                </Box>

                {/* TAB 0: LIVE CALL REMOTE CONTROL */}
                {activeTab === 0 && (
                    <Box>
                        {/* Vendor Dropdown Selector Bar */}
                        <Card sx={{ mb: 3, borderRadius: 3, border: '2px solid #2563eb', bgcolor: '#eff6ff', boxShadow: '0 4px 20px rgba(37,99,235,0.1)' }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, md: 5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: 2,
                                                    bgcolor: '#2563eb',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    boxShadow: '0 4px 10px rgba(37,99,235,0.3)',
                                                }}
                                            >
                                                <PhoneInTalkIcon sx={{ fontSize: 24 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e3a8a', lineHeight: 1.2 }}>
                                                    Active Vendor On-Call Selector
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 600 }}>
                                                    Instantly fetches settings & components for live phone discussion
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel sx={{ fontWeight: 700 }}>Choose Vendor to Manage</InputLabel>
                                            <Select
                                                value={remoteVendorId}
                                                label="Choose Vendor to Manage"
                                                onChange={(e) => handleRemoteSelectChange(e.target.value)}
                                                sx={{ bgcolor: '#fff', fontWeight: 700 }}
                                            >
                                                {vendors.map((v) => (
                                                    <MenuItem key={v.id} value={v.id}>
                                                        🏢 {v.name} {v.phone ? `(${v.phone})` : ''}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                        <Button
                                            variant="contained"
                                            startIcon={remoteSaving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SaveIcon />}
                                            onClick={handleSaveRemote}
                                            disabled={remoteSaving || !remoteVendorId}
                                            sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, fontWeight: 700 }}
                                        >
                                            {remoteSaving ? 'Saving...' : 'Save Changes'}
                                        </Button>

                                        {remoteVendor && (
                                            <Button
                                                variant="outlined"
                                                endIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
                                                onClick={() => handleSimulate(remoteVendor)}
                                                sx={{ borderColor: '#2563eb', color: '#2563eb', fontWeight: 700, bgcolor: '#fff' }}
                                                title="Open Quotation Builder simulating this vendor"
                                            >
                                                Builder
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {remoteSuccess && (
                            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setRemoteSuccess('')}>
                                {remoteSuccess}
                            </Alert>
                        )}

                        {remoteError && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setRemoteError('')}>
                                {remoteError}
                            </Alert>
                        )}

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                <CircularProgress />
                            </Box>
                        ) : !remoteVendor ? (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <Typography color="text.secondary">No vendor selected.</Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {/* Left Column: Components, Pricing & Credentials */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    {/* 1. Pricing Engine & Component Settings */}
                                    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: '4px solid #f59e0b' }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <TuneIcon sx={{ color: '#d97706' }} />
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                                    Component Defaults & Custom Margins
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
                                                Adjust what this vendor sees by default on their quotation builder.
                                            </Typography>

                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        label="Custom Profit Margin (₹ / kW)"
                                                        value={rcDefaultMargin}
                                                        onChange={(e) => setRcDefaultMargin(Number(e.target.value))}
                                                        helperText="Automatically applied to baseline products"
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Preferred Panel Brand</InputLabel>
                                                        <Select
                                                            value={rcPreferredPanelBrand}
                                                            label="Preferred Panel Brand"
                                                            onChange={(e) => setRcPreferredPanelBrand(e.target.value)}
                                                        >
                                                            {['Adani', 'Waaree', 'Goldi', 'Rayzon', 'Premier', 'Vikram Solar', 'Other'].map(b => (
                                                                <MenuItem key={b} value={b}>{b}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Preferred Inverter Brand</InputLabel>
                                                        <Select
                                                            value={rcPreferredInverterBrand}
                                                            label="Preferred Inverter Brand"
                                                            onChange={(e) => setRcPreferredInverterBrand(e.target.value)}
                                                        >
                                                            {['Polycab', 'Growatt', 'Deye', 'Solis', 'Sungrow', 'GoodWe', 'Luminous', 'Other'].map(b => (
                                                                <MenuItem key={b} value={b}>{b}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Structure Make Specification</InputLabel>
                                                        <Select
                                                            value={rcPreferredStructureMake}
                                                            label="Structure Make Specification"
                                                            onChange={(e) => setRcPreferredStructureMake(e.target.value)}
                                                        >
                                                            <MenuItem value="APOLLO">APOLLO (Default)</MenuItem>
                                                            <MenuItem value="TATA">TATA</MenuItem>
                                                            <MenuItem value="APOLLO / TATA">APOLLO / TATA</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={2}
                                                        label="Custom Proposal Terms & Notes"
                                                        value={rcCustomTerms}
                                                        onChange={(e) => setRcCustomTerms(e.target.value)}
                                                        placeholder="e.g. 50% advance with order, net metering included."
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                    {/* 2. On-Call Credentials & Password Reset */}
                                    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: '4px solid #6366f1' }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <LockResetIcon sx={{ color: '#4f46e5' }} />
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                                    Credentials & On-Call Password Reset
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                                                If vendor forgot credentials on the call, you can verbally issue a new password immediately.
                                            </Typography>

                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Login Email"
                                                        type="email"
                                                        value={rcEmail}
                                                        onChange={(e) => setRcEmail(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Reset Password On Call"
                                                        type="text"
                                                        placeholder="Enter new password (min 6 chars)"
                                                        value={rcResetPassword}
                                                        onChange={(e) => setRcResetPassword(e.target.value)}
                                                        helperText="Leave empty to keep existing password"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                    {/* 3. Official Bank & Settlement */}
                                    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: '4px solid #10b981' }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <AccountBalanceIcon sx={{ color: '#059669' }} />
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                                    Bank Account & UPI Settlement
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                                                Printed on the vendor's customer quotations for direct payments.
                                            </Typography>

                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Bank Name" value={rcBankName} onChange={(e) => setRcBankName(e.target.value)} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Branch Name" value={rcBankBranch} onChange={(e) => setRcBankBranch(e.target.value)} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Account Holder Name" value={rcAccountName} onChange={(e) => setRcAccountName(e.target.value)} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Account Number" value={rcAccountNumber} onChange={(e) => setRcAccountNumber(e.target.value)} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="IFSC Code" value={rcIfsc} onChange={(e) => setRcIfsc(e.target.value.toUpperCase())} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="UPI ID / VPA" value={rcUpiId} onChange={(e) => setRcUpiId(e.target.value)} />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Right Column: Brand Assets & Company Details */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    {/* Brand Visual Assets */}
                                    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: '4px solid #ef4444' }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <VerifiedIcon sx={{ color: '#dc2626' }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                                        Visual Brand Seals & Assets
                                                    </Typography>
                                                </Box>
                                                <Chip label="Cloud Stored" size="small" sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 700 }} />
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
                                                View what this vendor has uploaded or upload assets directly on their behalf.
                                            </Typography>

                                            <Grid container spacing={2}>
                                                {/* Logo */}
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Box sx={{ p: 1.5, borderRadius: 2, border: '1px dashed #cbd5e1', textAlign: 'center', bgcolor: '#f8fafc' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                                                            Shop Logo
                                                        </Typography>
                                                        <Box sx={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, bgcolor: '#fff', borderRadius: 1 }}>
                                                            <Box component="img" src={rcLogoUrl || '/logo.png'} alt="Logo" sx={{ maxHeight: 60, maxWidth: '100%', objectFit: 'contain' }} onError={(e: any) => { e.target.src = '/logo.png'; }} />
                                                        </Box>
                                                        <input type="file" ref={rcLogoInputRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleRemoteUpload(f, 'logo'); }} />
                                                        <Button size="small" variant="outlined" startIcon={uploadingRcAsset === 'logo' ? <CircularProgress size={12} /> : <CloudUploadIcon sx={{ fontSize: 13 }} />} onClick={() => rcLogoInputRef.current?.click()} disabled={!!uploadingRcAsset} sx={{ fontSize: 10, textTransform: 'none', py: 0.2 }}>
                                                            {uploadingRcAsset === 'logo' ? 'Uploading...' : 'Replace'}
                                                        </Button>
                                                    </Box>
                                                </Grid>

                                                {/* Signature */}
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Box sx={{ p: 1.5, borderRadius: 2, border: '1px dashed #cbd5e1', textAlign: 'center', bgcolor: '#f8fafc' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                                                            Signature
                                                        </Typography>
                                                        <Box sx={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, bgcolor: '#fff', borderRadius: 1 }}>
                                                            <Box component="img" src={rcSignatureUrl || '/signature.png'} alt="Signature" sx={{ maxHeight: 60, maxWidth: '100%', objectFit: 'contain' }} onError={(e: any) => { e.target.src = '/signature.png'; }} />
                                                        </Box>
                                                        <input type="file" ref={rcSigInputRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleRemoteUpload(f, 'signature'); }} />
                                                        <Button size="small" variant="outlined" startIcon={uploadingRcAsset === 'signature' ? <CircularProgress size={12} /> : <CloudUploadIcon sx={{ fontSize: 13 }} />} onClick={() => rcSigInputRef.current?.click()} disabled={!!uploadingRcAsset} sx={{ fontSize: 10, textTransform: 'none', py: 0.2 }}>
                                                            {uploadingRcAsset === 'signature' ? 'Uploading...' : 'Replace'}
                                                        </Button>
                                                    </Box>
                                                </Grid>

                                                {/* Stamp */}
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Box sx={{ p: 1.5, borderRadius: 2, border: '1px dashed #cbd5e1', textAlign: 'center', bgcolor: '#f8fafc' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                                                            Stamp Seal
                                                        </Typography>
                                                        <Box sx={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, bgcolor: '#fff', borderRadius: 1 }}>
                                                            <Box component="img" src={rcStampUrl || '/stamp.png'} alt="Stamp" sx={{ maxHeight: 60, maxWidth: '100%', objectFit: 'contain' }} onError={(e: any) => { e.target.src = '/stamp.png'; }} />
                                                        </Box>
                                                        <input type="file" ref={rcStampInputRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleRemoteUpload(f, 'stamp'); }} />
                                                        <Button size="small" variant="outlined" startIcon={uploadingRcAsset === 'stamp' ? <CircularProgress size={12} /> : <CloudUploadIcon sx={{ fontSize: 13 }} />} onClick={() => rcStampInputRef.current?.click()} disabled={!!uploadingRcAsset} sx={{ fontSize: 10, textTransform: 'none', py: 0.2 }}>
                                                            {uploadingRcAsset === 'stamp' ? 'Uploading...' : 'Replace'}
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                    {/* Company Identification & Addresses */}
                                    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: '4px solid #0284c7' }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <StorefrontIcon sx={{ color: '#0284c7' }} />
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                                    Company Details & Legal Info
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
                                                Identity details printed on every quotation header.
                                            </Typography>

                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Shop / Company Name" value={rcName} onChange={(e) => setRcName(e.target.value)} required />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Authorized Signatory Name" value={rcSignatory} onChange={(e) => setRcSignatory(e.target.value)} />
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField fullWidth label="Company Tagline" value={rcTagline} onChange={(e) => setRcTagline(e.target.value)} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Primary Phone" value={rcPhone} onChange={(e) => setRcPhone(e.target.value)} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="WhatsApp Phone" value={rcAlternatePhone} onChange={(e) => setRcAlternatePhone(e.target.value)} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="GSTIN Number" value={rcGstin} onChange={(e) => setRcGstin(e.target.value)} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField fullWidth label="Status" value={remoteVendor.status || 'active'} disabled />
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField fullWidth label="Head Office Address" value={rcHeadOffice} onChange={(e) => setRcHeadOffice(e.target.value)} />
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField fullWidth label="Registered Office Address" value={rcRegisteredOffice} onChange={(e) => setRcRegisteredOffice(e.target.value)} />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                    {/* Save Button Floating / Sticky at bottom */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={remoteSaving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <SaveIcon />}
                                            onClick={handleSaveRemote}
                                            disabled={remoteSaving}
                                            sx={{
                                                bgcolor: '#2563eb',
                                                '&:hover': { bgcolor: '#1d4ed8' },
                                                fontWeight: 800,
                                                px: 4,
                                                py: 1.5,
                                                boxShadow: '0 8px 20px rgba(37,99,235,0.3)',
                                            }}
                                        >
                                            {remoteSaving ? 'Saving Changes...' : 'Save Changes to Vendor Workspace'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                )}

                {/* TAB 1: ALL VENDORS DIRECTORY */}
                {activeTab === 1 && (
                    <Box>
                        {successMsg && (
                            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMsg('')}>
                                {successMsg}
                            </Alert>
                        )}

                        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>Vendor / Company</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Contact Info</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>GSTIN</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Margin / kW</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Quotes</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {vendors.map((v) => (
                                            <TableRow key={v.id} hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Box
                                                            component="img"
                                                            src={v.logo_url || '/logo.png'}
                                                            alt="Logo"
                                                            sx={{ width: 36, height: 36, objectFit: 'contain', bgcolor: '#f1f5f9', borderRadius: 1.5, p: 0.5 }}
                                                            onError={(e: any) => { e.target.src = '/logo.png'; }}
                                                        />
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                                                {v.name}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                                Signatory: {v.authorized_signatory || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{v.phone || '-'}</Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>{v.email || '-'}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                        {v.gstin || '-'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={`₹${v.default_margin || 0}/kW`}
                                                        size="small"
                                                        sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={<ReceiptIcon sx={{ fontSize: '13px !important' }} />}
                                                        label={v.quotations?.[0]?.count ?? 0}
                                                        size="small"
                                                        sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={v.status}
                                                        size="small"
                                                        color={v.status === 'active' ? 'success' : 'default'}
                                                        sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                                        <Tooltip title="Manage on Call">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => {
                                                                    selectVendorForRemoteControl(v);
                                                                    setActiveTab(0);
                                                                }}
                                                                sx={{ color: '#2563eb' }}
                                                            >
                                                                <PhoneInTalkIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Simulate Vendor">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleSimulate(v)}
                                                                sx={{ color: '#ff9800' }}
                                                            >
                                                                <VisibilityIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Deactivate">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDeactivate(v.id)}
                                                                sx={{ color: '#ef4444' }}
                                                            >
                                                                <DeleteOutlineIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Box>
                )}

                {/* CREATE VENDOR DIALOG */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ fontWeight: 800 }}>
                        Register New Vendor Account
                    </DialogTitle>
                    <DialogContent dividers>
                        {errorMsg && (
                            <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>
                        )}

                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Company / Shop Name *" value={modalName} onChange={(e) => setModalName(e.target.value)} required />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Authorized Signatory Name" value={modalSignatory} onChange={(e) => setModalSignatory(e.target.value)} placeholder="Karan Gond" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Vendor Login Email" type="email" value={modalEmail} onChange={(e) => setModalEmail(e.target.value)} placeholder="vendor@shop.com" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Vendor Password" type="text" value={modalPassword} onChange={(e) => setModalPassword(e.target.value)} placeholder="Min 6 characters" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Phone Number" value={modalPhone} onChange={(e) => setModalPhone(e.target.value)} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="GSTIN" value={modalGstin} onChange={(e) => setModalGstin(e.target.value)} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth type="number" label="Default Profit Margin (₹/kW)" value={modalDefaultMargin} onChange={(e) => setModalDefaultMargin(Number(e.target.value))} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Head Office Address" value={modalHeadOffice} onChange={(e) => setModalHeadOffice(e.target.value)} />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 1 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                                        BANK SETTLEMENT DETAILS
                                    </Typography>
                                </Divider>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Bank Name" value={modalBankName} onChange={(e) => setModalBankName(e.target.value)} placeholder="HDFC Bank" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Account Holder" value={modalAccountName} onChange={(e) => setModalAccountName(e.target.value)} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Account Number" value={modalAccountNumber} onChange={(e) => setModalAccountNumber(e.target.value)} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="IFSC Code" value={modalIfsc} onChange={(e) => setModalIfsc(e.target.value.toUpperCase())} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="UPI ID" value={modalUpiId} onChange={(e) => setModalUpiId(e.target.value)} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5 }}>
                        <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
                        <Button variant="contained" onClick={handleCreateVendor} disabled={saving} sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' }, fontWeight: 700 }}>
                            {saving ? 'Creating...' : 'Provision Vendor Account'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

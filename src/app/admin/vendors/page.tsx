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
    Divider
} from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyIcon from '@mui/icons-material/Key';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useAuth } from '@/context/AuthContext';
import { Vendor } from '@/types';

export default function AdminVendorsPage() {
    const router = useRouter();
    const { user, role, switchVendor, vendor: activeVendor } = useAuth();

    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<any | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [saving, setSaving] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [signatory, setSignatory] = useState('');
    const [gstin, setGstin] = useState('');
    const [headOffice, setHeadOffice] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [upiId, setUpiId] = useState('');
    const [defaultMargin, setDefaultMargin] = useState(0);

    const loadVendors = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/vendors');
            const json = await res.json();
            if (json.success) {
                setVendors(json.data || []);
            }
        } catch (err) {
            console.error('Failed to load vendors:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVendors();
    }, []);

    const handleOpenCreate = () => {
        setEditingVendor(null);
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setSignatory('');
        setGstin('');
        setHeadOffice('');
        setBankName('');
        setAccountName('');
        setAccountNumber('');
        setIfsc('');
        setUpiId('');
        setDefaultMargin(0);
        setErrorMsg('');
        setDialogOpen(true);
    };

    const handleOpenEdit = (v: any) => {
        setEditingVendor(v);
        setName(v.name || '');
        setEmail(v.email || '');
        setPassword(''); // keep blank unless resetting
        setPhone(v.phone || '');
        setSignatory(v.authorized_signatory || '');
        setGstin(v.gstin || '');
        setHeadOffice(v.head_office || '');
        setBankName(v.bank_name || '');
        setAccountName(v.account_name || '');
        setAccountNumber(v.account_number || '');
        setIfsc(v.ifsc || '');
        setUpiId(v.upi_id || '');
        setDefaultMargin(Number(v.default_margin) || 0);
        setErrorMsg('');
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setErrorMsg('Vendor/Company name is required');
            return;
        }

        setSaving(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            if (editingVendor) {
                // Update
                const res = await fetch('/api/vendors', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editingVendor.id,
                        name: name.trim(),
                        email: email.trim() || null,
                        phone: phone.trim() || null,
                        authorized_signatory: signatory.trim() || null,
                        gstin: gstin.trim() || null,
                        head_office: headOffice.trim() || null,
                        bank_name: bankName.trim() || null,
                        account_name: accountName.trim() || null,
                        account_number: accountNumber.trim() || null,
                        ifsc: ifsc.trim() || null,
                        upi_id: upiId.trim() || null,
                        default_margin: Number(defaultMargin) || 0,
                    }),
                });
                const json = await res.json();
                if (!json.success) throw new Error(json.message);
                setSuccessMsg('Vendor updated successfully!');
            } else {
                // Create
                const res = await fetch('/api/vendors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim() || null,
                        password: password.trim() || null,
                        phone: phone.trim() || null,
                        authorized_signatory: signatory.trim() || null,
                        gstin: gstin.trim() || null,
                        head_office: headOffice.trim() || null,
                        bank_name: bankName.trim() || null,
                        account_name: accountName.trim() || null,
                        account_number: accountNumber.trim() || null,
                        ifsc: ifsc.trim() || null,
                        upi_id: upiId.trim() || null,
                        default_margin: Number(defaultMargin) || 0,
                    }),
                });
                const json = await res.json();
                if (!json.success) throw new Error(json.message);
                setSuccessMsg(`Vendor "${name}" created with ID & login credentials!`);
            }

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

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.push('/admin')}
                            sx={{ borderColor: '#ccc', color: '#555' }}
                        >
                            Admin Hub
                        </Button>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                Vendor SaaS Management
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Manage multi-tenant vendors, their login credentials, branding seals & quotations
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddBusinessIcon />}
                        onClick={handleOpenCreate}
                        sx={{
                            bgcolor: '#ff9800',
                            '&:hover': { bgcolor: '#f57c00' },
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 3,
                            py: 1.2
                        }}
                    >
                        Register New Vendor
                    </Button>
                </Box>

                {successMsg && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMsg('')}>
                        {successMsg}
                    </Alert>
                )}

                {/* Active Vendor Banner */}
                <Card sx={{ mb: 4, borderRadius: 3, bgcolor: '#0f172a', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <StorefrontIcon sx={{ fontSize: 40, color: '#ff9800' }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                                        Currently Active Simulation Tenant
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
                                        {activeVendor?.name || 'Default System'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                                        Authorized Signatory: <strong>{activeVendor?.authorized_signatory || 'N/A'}</strong> &bull; Bank: {activeVendor?.bank_name || 'HDFC Bank'}
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                variant="outlined"
                                onClick={() => router.push('/')}
                                sx={{ color: '#ff9800', borderColor: '#ff9800', fontWeight: 700 }}
                            >
                                Open Quotation Builder as this Vendor
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Vendors Table */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <CardContent sx={{ p: 0 }}>
                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ minWidth: 700 }}>
                                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Vendor / Company</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Login / Email</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Signatory</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Phone & Location</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Quotes</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                                <CircularProgress size={32} />
                                            </TableCell>
                                        </TableRow>
                                    ) : vendors.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#64748b' }}>
                                                No vendors found. Click &quot;Register New Vendor&quot; to add your first client.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        vendors.map((v) => {
                                            const quoteCount = v.quotations?.[0]?.count ?? 0;
                                            const isActive = v.status === 'active';
                                            const isCurrent = activeVendor?.id === v.id;

                                            return (
                                                <TableRow key={v.id} hover sx={{ bgcolor: isCurrent ? 'rgba(255, 152, 0, 0.05)' : 'inherit' }}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                                    {v.name}
                                                                </Typography>
                                                                {isCurrent && (
                                                                    <Chip label="Current Active" size="small" sx={{ bgcolor: '#ff9800', color: '#fff', fontSize: '0.65rem', height: 18, mt: 0.5 }} />
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#334155' }}>
                                                            {v.email || '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                                                            {v.authorized_signatory || '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#334155' }}>
                                                            {v.phone || '—'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                            {v.head_office || ''}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip label={`${quoteCount} Quotes`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={v.status}
                                                            size="small"
                                                            color={isActive ? 'success' : 'default'}
                                                            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                            <Tooltip title="Switch to this Vendor profile">
                                                                <IconButton size="small" onClick={() => switchVendor(v)} sx={{ color: '#ff9800' }}>
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Edit Profile & Bank details">
                                                                <IconButton size="small" onClick={() => handleOpenEdit(v)} sx={{ color: '#2563eb' }}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            {isActive && (
                                                                <Tooltip title="Deactivate Vendor">
                                                                    <IconButton size="small" onClick={() => handleDeactivate(v.id)} sx={{ color: '#ef4444' }}>
                                                                        <DeleteOutlineIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Dialog: Create / Edit Vendor */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ fontWeight: 800, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {editingVendor ? `Edit Vendor: ${editingVendor.name}` : 'Register New Vendor with ID & Password'}
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        {errorMsg && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                {errorMsg}
                            </Alert>
                        )}

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ff9800', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StorefrontIcon fontSize="small" /> Company Profile & Branding
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Company / Shop Name *"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Surya Solar Enterprise"
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Authorized Signatory Name *"
                                    value={signatory}
                                    onChange={(e) => setSignatory(e.target.value)}
                                    placeholder="e.g. Rajesh Kumar"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Contact Phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 9876543210"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="GSTIN Number"
                                    value={gstin}
                                    onChange={(e) => setGstin(e.target.value)}
                                    placeholder="09AAAAA0000A1Z5"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Office Address"
                                    value={headOffice}
                                    onChange={(e) => setHeadOffice(e.target.value)}
                                    placeholder="Plot No. 12, Main Road, City, Pincode"
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2563eb', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <KeyIcon fontSize="small" /> Login Credentials
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Login Email Address *"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="vendor@company.com"
                                    helperText="This email will be the Vendor Login ID"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label={editingVendor ? 'Reset Password (optional)' : 'Vendor Initial Password *'}
                                    type="text"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimum 6 characters"
                                    helperText="Give this password to the vendor to log in"
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#10b981', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccountBalanceIcon fontSize="small" /> Bank Details (Printed on Quotation)
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Bank Name"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="State Bank of India / HDFC"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Account Name"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    placeholder="Account Beneficiary Name"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Account Number"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="Account Number"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="IFSC Code"
                                    value={ifsc}
                                    onChange={(e) => setIfsc(e.target.value)}
                                    placeholder="SBIN0001234"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="UPI ID (for QR code)"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="company@upi"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Default Margin per Quotation (₹)"
                                    value={defaultMargin}
                                    onChange={(e) => setDefaultMargin(Number(e.target.value))}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                        <Button onClick={() => setDialogOpen(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={saving}
                            sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' }, fontWeight: 700, px: 3 }}
                        >
                            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : editingVendor ? 'Update Vendor' : 'Create Vendor & Issue Credentials'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

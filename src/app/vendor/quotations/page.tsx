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
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    CircularProgress,
    Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useAuth } from '@/context/AuthContext';

export default function VendorQuotationsPage() {
    const router = useRouter();
    const { user, vendor, loading: authLoading } = useAuth();

    const [quotations, setQuotations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        const fetchQuotes = async () => {
            if (!vendor?.id) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/quotations?vendor_id=${vendor.id}&limit=200`);
                const json = await res.json();
                if (json.success) {
                    setQuotations(json.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch vendor quotes:', err);
            } finally {
                setLoading(false);
            }
        };

        if (vendor?.id) {
            fetchQuotes();
        }
    }, [user, vendor, authLoading, router]);

    const filteredQuotes = quotations.filter((q) => {
        if (!searchQuery) return true;
        const qText = searchQuery.toLowerCase();
        return (
            (q.customer_name && q.customer_name.toLowerCase().includes(qText)) ||
            (q.customer_phone && q.customer_phone.includes(qText)) ||
            (q.quote_number && q.quote_number.toLowerCase().includes(qText))
        );
    });

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 4 }}>
            <Container maxWidth="lg">
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
                                My Quotation History
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Quotations issued by <strong>{vendor?.name || 'Your Shop'}</strong>
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => router.push('/')}
                        sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' }, fontWeight: 700, borderRadius: 2 }}
                    >
                        Create Quotation
                    </Button>
                </Box>

                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search by customer name, phone number, or quote ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#94a3b8' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ maxWidth: 500 }}
                            />
                        </Box>

                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ minWidth: 700 }}>
                                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Quote #</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Customer</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Phone & Location</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Capacity</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Total Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Date</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                                <CircularProgress size={30} />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredQuotes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#64748b' }}>
                                                No quotations found matching your search.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredQuotes.map((q) => (
                                            <TableRow key={q.id} hover>
                                                <TableCell sx={{ fontWeight: 700, color: '#1e3a5f' }}>
                                                    {q.quote_number || '—'}
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                    {q.customer_name}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{q.customer_phone || '—'}</Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>{q.customer_address || ''}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {q.capacity_kw ? `${q.capacity_kw} kW` : 'B2B/Custom'}
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 800, color: '#1e3a5f' }}>
                                                    ₹{Number(q.total_amount || 0).toLocaleString('en-IN')}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={q.status || 'draft'}
                                                        size="small"
                                                        color={q.status === 'WhatsApp Sent' || q.status === 'sent' ? 'success' : 'default'}
                                                        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ color: '#64748b' }}>
                                                    {new Date(q.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                        <Tooltip title="Edit / Print / View Quotation">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => router.push(`/?edit=${q.id}`)}
                                                                sx={{ color: '#2563eb' }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {q.pdf_url && (
                                                            <Tooltip title="View Uploaded PDF">
                                                                <IconButton
                                                                    size="small"
                                                                    component="a"
                                                                    href={q.pdf_url}
                                                                    target="_blank"
                                                                    sx={{ color: '#dc2626' }}
                                                                >
                                                                    <PictureAsPdfIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        {q.customer_phone && (
                                                            <Tooltip title="Open WhatsApp Chat">
                                                                <IconButton
                                                                    size="small"
                                                                    component="a"
                                                                    href={`https://wa.me/91${q.customer_phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${q.customer_name}, here is your quotation details from ${vendor?.name}: Total ₹${Number(q.total_amount || 0).toLocaleString('en-IN')}`)}`}
                                                                    target="_blank"
                                                                    sx={{ color: '#16a34a' }}
                                                                >
                                                                    <WhatsAppIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

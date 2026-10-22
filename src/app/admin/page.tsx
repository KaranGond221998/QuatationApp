"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Inventory,
  SettingsInputComponent,
  Receipt,
  Home,
  Add,
  Construction,
  Inventory2,
  Storefront,
} from "@mui/icons-material";
import Link from "next/link";
import { companyDetails } from "@/lib/companyDetails";

type DashboardStats = {
  totalQuotations: number;
  draftQuotations: number;
  sentQuotations: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuotations: 0,
    draftQuotations: 0,
    sentQuotations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/quotations?limit=100");
        const data = await res.json();
        if (data.success) {
          const quotations = data.data || [];
          setStats({
            totalQuotations: quotations.length,
            draftQuotations: quotations.filter((q: any) => q.status === "draft").length,
            sentQuotations: quotations.filter((q: any) => q.status === "sent").length,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    {
      title: "Rooftop Quotation",
      description: "On-grid, Off-grid & Hybrid Solar Quotations",
      icon: <Add sx={{ fontSize: 40 }} />,
      color: "#16a34a",
      href: "/",
    },
    {
      title: "Structure / B2B Quote",
      description: "Apollo & Tata Solar Structures, Wires & Kits",
      icon: <Construction sx={{ fontSize: 40 }} />,
      color: "#d97706",
      href: "/?tab=ApolloB2B",
    },
    {
      title: "Structure Catalog",
      description: "Browse 41 mounting structures, clamps & cables",
      icon: <Inventory2 sx={{ fontSize: 40 }} />,
      color: "#2563eb",
      href: "/admin/structure-catalog",
    },
    {
      title: "Solar Products",
      description: "Manage rooftop panels & inverters",
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: "#0891b2",
      href: "/admin/products",
    },
    {
      title: "Bill of Materials",
      description: "Customize components for solar systems",
      icon: <SettingsInputComponent sx={{ fontSize: 40 }} />,
      color: "#f59e0b",
      href: "/admin/components",
    },
    {
      title: "Saved Quotations",
      description: "View, edit, search & export quotations",
      icon: <Receipt sx={{ fontSize: 40 }} />,
      color: "#9333ea",
      href: "/admin/quotations",
    },
    {
      title: "Vendor SaaS Portal",
      description: "Manage multi-tenant vendors, IDs, passwords & seals",
      icon: <Storefront sx={{ fontSize: 40 }} />,
      color: "#ea580c",
      href: "/admin/vendors",
    },
  ];


  return (
    <Box sx={{ p: 3, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="#1a237e">
              {companyDetails.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admin Dashboard
            </Typography>
          </Box>
          <Link href="/">
            <Button variant="outlined" startIcon={<Home />}>
              Back to Home
            </Button>
          </Link>
        </Box>

        {/* Stats Cards */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{ borderRadius: 2, borderLeft: "4px solid #4CAF50" }}>
                <CardContent>
                  <Typography variant="h3" fontWeight="bold" color="#4CAF50">
                    {stats.totalQuotations}
                  </Typography>
                  <Typography color="text.secondary">Total Quotations</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{ borderRadius: 2, borderLeft: "4px solid #FF9800" }}>
                <CardContent>
                  <Typography variant="h3" fontWeight="bold" color="#FF9800">
                    {stats.draftQuotations}
                  </Typography>
                  <Typography color="text.secondary">Draft Quotations</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{ borderRadius: 2, borderLeft: "4px solid #2196F3" }}>
                <CardContent>
                  <Typography variant="h3" fontWeight="bold" color="#2196F3">
                    {stats.sentQuotations}
                  </Typography>
                  <Typography color="text.secondary">Sent Quotations</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Menu Cards */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.title}>
              <Link href={item.href} style={{ textDecoration: "none" }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 4 }}>
                    <Box sx={{ color: item.color, mb: 2 }}>{item.icon}</Box>
                    <Typography variant="h6" fontWeight="bold">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>

        {/* Company Info */}
        <Card sx={{ mt: 4, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Company Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  GSTIN: {companyDetails.gstin}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Head Office: {companyDetails.headOffice}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone: {companyDetails.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {companyDetails.email}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

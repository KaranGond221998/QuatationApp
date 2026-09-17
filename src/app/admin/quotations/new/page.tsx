"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function NewQuotationRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?tab=ApolloB2B");
  }, [router]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 2 }}>
      <CircularProgress color="warning" />
      <Typography variant="body2" color="text.secondary">
        Opening Apollo Structure & BOS Quotation Studio...
      </Typography>
    </Box>
  );
}

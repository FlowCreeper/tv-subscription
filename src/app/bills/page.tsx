"use client";

import { useEffect, useState } from "react";
import useApi from "../fetch";
import { Autocomplete, Grid, TextField, Typography, Box, Paper } from "@mui/material";

export default function Bills() {
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);
  const [pdfBlobs, setPdfBlobs] = useState<Blob[]>([]);

  const { data: customers = [] } = useApi("/customers");
  const { data: subscriptions = [] } = useApi("/subscriptions");

  useEffect(() => {
    return () => {
      pdfBlobs.forEach((blob) => URL.revokeObjectURL(URL.createObjectURL(blob)));
    };
  }, [pdfBlobs]);

  const fetchBills = async (id: string | number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_LINK}/booklets/${id}`);
      const blob = await response.blob();
      setPdfBlobs([blob]);
    } catch (err) {
      console.error("Erro ao buscar boletos", err);
      setPdfBlobs([]);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Consulta de Boletos
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ sm: 6, xs: 12 }} >
          <Autocomplete
            fullWidth
            options={subscriptions}
            getOptionLabel={(option: any) => {
              const customer = customers.find(
                (obj: { id: number }) => obj.id === option.customer_id
              );
              return `${option.id} - ${customer?.name ?? "Cliente desconhecido"}`;
            }}
            onChange={(_, selected) => {
              if (selected) {
                setSelectedSubscriptionId(selected.id);
                fetchBills(selected.id);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Assinatura" variant="outlined" />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 4 }} height={'100%'}>
        <Grid container spacing={3} height={'100%'}>
          {pdfBlobs.length > 0 ? (
            pdfBlobs.map((blob, index) => {
              const url = URL.createObjectURL(blob);
              return (
                <Grid height={'100%'}  size={{ xs: 12 }} key={index}>
                  <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                    <iframe
                      src={url}
                      width="100%"
                      height="100%"
                      title={`Boleto ${index + 1}`}
                      style={{ border: "none" }}
                    />
                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" color="textSecondary">
                Nenhum boleto disponível.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

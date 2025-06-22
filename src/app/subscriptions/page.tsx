"use client"

import { useState } from "react";
import DataTable from "../.components/DataTable";
import LogPaper from "../.components/LogPaper";
import useApi from "../.lib/fetch";
import { Autocomplete, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Refresh } from "@mui/icons-material";

export default function Subscription() {
  const [formError, setFormError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [planId, setPlanId] = useState<number | null>(null);
  const [packageId, setPackageId] = useState<number | null>(null);
  const [serviceIds, setServiceIds] = useState<number[]>([]);
  
  const { data: customers } = useApi("/customers");
  const { data: plans } = useApi("/plans");
  const { data: packages } = useApi("/packages");
  const { data: services } = useApi("/adicional_services");
  const { data, error, loading, fetch } = useApi("/subscriptions");

  const selectedPackage = (packages || []).find((p: {id: number}) => p.id === packageId);
  const packageServiceIds = selectedPackage?.adicional_services?.map((s: any) => s.id) || [];

  const availableAdditionalServices = (services || []).filter(
    (s: any) => !packageServiceIds.includes(s.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!planId && !packageId) {
      setFormError("Você deve selecionar um plano ou um pacote.");
      return;
    }
    if (planId && packageId) {
      setFormError("Você não pode selecionar ambos: plano e pacote.");
      return;
    }

    setFormError(null);

    try {
      await fetch("POST", {
        subscription: { 
          customer_id: customerId, 
          plan_id: planId, 
          package_id: packageId, 
          adicional_service_ids: serviceIds, 
        }
      });

      // Refresh subscription list after creation
      await fetch("GET");

    } catch (err) {
      console.error("Erro ao criar assinatura", err);
    }
  };

  const handleRefreshClick = async () => {
    await fetch("GET");
  }

  const handleDelete = async (ids: number[]) => {
    for (const id of ids) {
      await fetch("DELETE", null, id);
    }
    await fetch("GET");
  };

  const columns: GridColDef[] = [
    { field: 'customer_id', headerName: 'Cliente', type: 'string', width: 120,
      valueFormatter: (params) => (customers || []).find((obj: {id: number}) => obj.id === params).name || params,
    },
    {
      field: 'plan_or_package',
      headerName: 'Plano/Pacote',
      width: 160,
      valueGetter: (_p, row) => {
        const plan = plans?.find((p: any) => p.id === row.plan_id);
        const pkg = packages?.find((p: any) => p.id === row.package_id);
        return plan?.name || pkg?.name;
      }
    },
    { field: 'adicional_services', headerName: 'Serviços Adicionais', width: 150,
      renderCell: (params) => {
        const subs_services = params.value;
        const names = subs_services.map((s: any) => s.name).join(', ');
        return <span>{names}</span>;
      },
    },
  ]
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6 }} flexGrow={1}>
        <LogPaper title="Criar Assinatura">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <FormControl fullWidth required>
                <InputLabel id="customer-select-label">Cliente</InputLabel>
                <Select
                  labelId="customer-select-label"
                  value={customerId ?? ""}
                  label="Cliente"
                  onChange={(e) => setCustomerId(Number(e.target.value))}
                >
                  {(customers || []).map((customer: any) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.id} - {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Grid container size={{ xs: 12 }}>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="plan-select-label">Plano</InputLabel>
                    <Select
                      labelId="plan-select-label"
                      value={planId ?? ""}
                      label="Plano"
                      onChange={(e) => {
                        setPlanId(Number(e.target.value));
                        setPackageId(null); // mutually exclusive
                      }}
                    >
                      {(plans || []).map((plan: any) => (
                        <MenuItem key={plan.id} value={plan.id}>
                          {plan.id} - {plan.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="package-select-label">Pacote</InputLabel>
                    <Select
                      labelId="package-select-label"
                      value={packageId ?? ""}
                      label="Pacote"
                      onChange={(e) => {
                        setPackageId(Number(e.target.value));
                        setPlanId(null); // mutually exclusive
                      }}
                    >
                      {(packages || []).map((pkg: any) => (
                        <MenuItem key={pkg.id} value={pkg.id}>
                          {pkg.id} - {pkg.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Autocomplete
                  multiple
                  options={availableAdditionalServices}
                  getOptionLabel={(option: { id: number, name: string }) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(_, selected) => {
                    const uniqueServices = Array.from(new Set(selected.map((s) => s.id)));
                    setServiceIds(uniqueServices);
                  }}
                  renderInput={(params) => <TextField {...params} label="Serviços adicionais" />}
                />
              </Grid>

              {formError && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="error">{formError}</Typography>
                </Grid>
              )}
              <Grid size={{ xs: 12 }}>
                <Button variant="contained" color="primary" type="submit">
                  Criar Assinatura
                </Button>
              </Grid>
            </Grid>
          </form>
        </LogPaper>
      </Grid>
      <Grid size={{ xs: 10 }} flexGrow={1}>
      { error ? 
        <Grid container position='relative'>
          <Typography sx={{ position: 'absolute', top: "50%"}}>{error}</Typography>
          <IconButton sx={{ position: 'absolute', right: 0}} onClick={handleRefreshClick}><Refresh /></IconButton>
        </Grid> 
        :
        <LogPaper title="Assinaturas">
          { loading ? " Loading" : <DataTable columns={columns} rows={data} onDelete={handleDelete} />} 
        </LogPaper>
      }
      </Grid>
    </Grid>
  );
}

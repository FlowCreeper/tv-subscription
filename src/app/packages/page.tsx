"use client"

import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../.components/DataTable";
import LogPaper from "../.components/LogPaper";
import { Autocomplete, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useApi from "../.lib/fetch";
import { Refresh } from "@mui/icons-material";

export default function Package() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [formError, setFormError] = useState<string | null>(null);
  const [planId, setPlanId] = useState<number | null>(null);
  const [serviceIds, setServiceIds] = useState<number[]>([]);
  
  const { data: plans = [] } = useApi("/plans");
  const { data: services = [] } = useApi("/adicional_services");
  const { data, error, loading, fetch } = useApi("/packages");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      return setFormError("O nome é obrigatório.");
    }

    if (price !== '' && price < 0) {
      return setFormError("O preço não pode ser negativo");
    }

    setFormError(null);

    try {
      await fetch("POST", {
        package: { 
          name: name, 
          plan_id: planId, 
          adicional_service_ids: serviceIds, 
          price: price === "" ? null : price },
      });

      // Optionally refresh package list after creation
      await fetch("GET");

      setName("");
      setPrice("");
    } catch (err) {
      console.error("Erro ao criar pacote", err);
    }
  };

  const handleRefreshClick = async () => {
    await fetch("GET");
  }

  const handleEdit = async (updatedRow: any) => {
    const { id, name, price } = updatedRow;
    await fetch("PUT", { name, price }, id); // ID in URL
    await fetch("GET");
    return updatedRow;
  };

  const handleDelete = async (ids: number[]) => {
    for (const id of ids) {
      await fetch("DELETE", null, id); // ID in URL, no body
    }
    await fetch("GET");
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', type: 'string', width: 120, editable: true },
    { field: 'plan_id', headerName: 'Plano', type: 'string', width: 120, editable: true,
      valueFormatter: (params) => (plans || {}).find((obj: {id: number}) => obj.id === params).name || params,
    },
    { field: 'adicional_services', headerName: 'Serviços', width: 120, editable: true,
      renderCell: (params) => {
        const services = params.value || [];
        const names = services.map((s: any) => s.name).join(', ');
        return <span>{names}</span>;
      },
    },
    { field: 'price', headerName: 'Preço', type: 'number', width: 100, editable: true, 
      valueFormatter: (params) => 
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(params), 
    },
  ]
  columns
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6 }} flexGrow={1}>
        <LogPaper title="Criar Pacote">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Preço"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) === 0 ? "" : Number(e.target.value))}
                  slotProps={{ htmlInput: { step: 0.01 } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth required>
                  <InputLabel id="plan-select-label">Plano</InputLabel>
                  <Select
                    labelId="plan-select-label"
                    value={planId ?? ""}
                    label="Plano"
                    onChange={(e) => setPlanId(Number(e.target.value))}
                  >
                    {(plans || []).map((plan: any) => (
                      <MenuItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Autocomplete
                  multiple
                  options={(services || [])}
                  getOptionLabel={(option: { id: number, name: string }) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(_, selected) => setServiceIds((selected).map((s) => s.id))}
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
                  Criar Pacote
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
        <LogPaper title="Pacotes">
          { loading ? " Loading" : <DataTable columns={columns} rows={data} onRowEdit={handleEdit} onDelete={handleDelete} />} 
        </LogPaper>
      }
      </Grid>
    </Grid>
  );
}

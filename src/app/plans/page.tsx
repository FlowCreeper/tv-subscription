"use client"

import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../components/DataTable";
import LogPaper from "../components/LogPaper";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useApi from "../fetch";

export default function Plan() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [formError, setFormError] = useState<string | null>(null);
  
  const { data, error, loading, fetch } = useApi("/plans");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      return setFormError("O nome é obrigatório.");
    }

    if (!price || price < 0) {
      return setFormError("O preço não pode ser negativo");
    }

    setFormError(null);

    try {
      await fetch("POST", {
        plan: { name: name, price: price },
      });

      // Optionally refresh plan list after creation
      await fetch("GET");

      setName("");
      setPrice("");
    } catch (err) {
      console.error("Erro ao criar plano", err);
    }
  };

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
    { field: 'price', headerName: 'Preço', type: 'number', width: 100, editable: true, 
      valueFormatter: (params) => 
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(params), 
    },
  ]
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6 }} flexGrow={1}>
        <LogPaper title="Criar Plano">
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
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  slotProps={{ htmlInput: { step: 0.01 } }}
                />
              </Grid>
              {formError && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="error">{formError}</Typography>
                </Grid>
              )}
              <Grid size={{ xs: 12 }}>
                <Button variant="contained" color="primary" type="submit">
                  Criar Plano
                </Button>
              </Grid>
            </Grid>
          </form>
        </LogPaper>
      </Grid>
      <Grid size={{ xs: 10 }} flexGrow={1}>
      { error ? error :
        <LogPaper title="Planos">
          { loading ? " Loading" : <DataTable columns={columns} rows={data} onRowEdit={handleEdit} onDelete={handleDelete} />} 
        </LogPaper>
      }
      </Grid>
    </Grid>
  );
}

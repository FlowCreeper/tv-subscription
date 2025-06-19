"use client"

import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../components/DataTable";
import LogPaper from "../components/LogPaper";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useApi from "../fetch";

export default function Customers() {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [formError, setFormError] = useState<string | null>(null);
  
  const { data, error, loading, fetch } = useApi("/customers");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      return setFormError("O nome é obrigatório.");
    }

    if (!age || age < 18) {
      return setFormError("A idade deve ser 18 ou mais.");
    }

    setFormError(null);

    try {
      await fetch("POST", {
        customer: { name, age },
      });

      // Optionally refresh customer list after creation
      await fetch("GET");

      setName("");
      setAge("");
    } catch (err) {
      console.error("Erro ao criar cliente", err);
    }
  };

  const handleEdit = async (updatedRow: any) => {
    const { id, name, age } = updatedRow;
    await fetch("PUT", { name, age }, id); // ID in URL
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
    { field: 'age', headerName: 'Idade', type: 'number', width: 90, editable: true },
  ]
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6 }} flexGrow={1}>
        <LogPaper title="Criar Cliente: ">
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
                  label="Idade"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                  slotProps={{ htmlInput: { min: 18 } }}
                />
              </Grid>
              {formError && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="error">{formError}</Typography>
                </Grid>
              )}
              <Grid size={{ xs: 12 }}>
                <Button variant="contained" color="primary" type="submit">
                  Criar Cliente
                </Button>
              </Grid>
            </Grid>
          </form>
        </LogPaper>
      </Grid>
      <Grid size={{ xs: 10 }} flexGrow={1}>
      { error ? error :
        <LogPaper title="Clientes">
          { loading ? " Loading" : <DataTable columns={columns} rows={data} onRowEdit={handleEdit} onDelete={handleDelete} />} 
        </LogPaper>
      }
      </Grid>
    </Grid>
  );
}

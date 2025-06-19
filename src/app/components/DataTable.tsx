import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box, Button } from "@mui/material";

type DataTableProps = {
  columns: GridColDef[];
  rows: any[];
  onRowEdit?: (updatedRow: GridRowModel) => Promise<any>;
  onDelete?: (ids: number[]) => void;
};

export default function DataTable({ columns, rows, onRowEdit, onDelete }: DataTableProps) {
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  const fullColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    ...columns,
    { field: 'created_at', headerName: 'Cadastrado em', type: 'string', width: 180 },
    { field: 'updated_at', headerName: 'Editado em', type: 'string', width: 180 },
  ]

  const handleDeleteClick = () => {
    if (onDelete && selectedRows.length > 0) {
      onDelete(selectedRows);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteClick}
          disabled={selectedRows.length === 0}
        >
          Deletar Selecionados
        </Button>
      </Box>

      <DataGrid
        rows={(rows || []).map((obj: { id: number; created_at: string; updated_at: string }) => ({
          ...obj,
          created_at: new Date(obj.created_at).toLocaleString(),
          updated_at: new Date(obj.updated_at).toLocaleString(),
        }))}
        columns={fullColumns}
        checkboxSelection
        pageSizeOptions={[5, 10]}
        onRowSelectionModelChange={(newSelection) => {
          let numericIds: number[] = []
          newSelection.ids
            .forEach((id) => numericIds.push(Number(id)))
          setSelectedRows(numericIds);
        }}
        processRowUpdate={onRowEdit}
        sx={{ border: 0 }}
      />
    </>
  );
}

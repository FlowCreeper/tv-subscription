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
        rows={rows}
        columns={columns}
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

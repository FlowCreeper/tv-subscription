import { Paper, Typography } from "@mui/material";
import { ReactNode } from "react";

type LogPaperProps = {
  children: ReactNode;
  title: string;
};

export default function LogPaper({ children, title }: LogPaperProps) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography mb={1}> {title} </Typography>
      
      {children}
    </Paper>
  );
}

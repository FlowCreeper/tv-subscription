import { Paper } from "@mui/material";
import { ReactNode } from "react";

type LogPaperProps = {
  children: ReactNode;
  title: string;
};

export default function LogPaper({ children, title }: LogPaperProps) {
  

  return (
    <Paper sx={{ p: 3 }}>
      {title}:
      {children}
    </Paper>
  );
}

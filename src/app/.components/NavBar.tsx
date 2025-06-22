"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Button, ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import { AccountBox, CreditCard, Description, Folder, NoteAdd, Person } from "@mui/icons-material";

const drawerWidth = 240;

const drawerContent = [
  { text: "Clientes",             icon: <Person />,       href: "/customers" },
  { text: "Planos",               icon: <Description />,  href: "/plans" },
  { text: "Serviços Adicionais",  icon: <NoteAdd />,      href: "/services" },
  { text: "Pacotes",              icon: <Folder />,       href: "/packages" },
  { text: "Assinaturas",          icon: <AccountBox />,   href: "/subscriptions" },
  { text: "Cobranças",            icon: <CreditCard />,   href: "/bills"} ,
]

type NavBarProps = {
  children: Readonly<React.ReactNode>;
};

export default function NavBar({ children }: NavBarProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} enableColorOnDark>
          <Toolbar>
            <Button href='/' sx={{ color: 'rgb(0,0,0)' }} >
              <Typography variant="h6" noWrap component="div">
                TV Subscription Management
              </Typography>
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {drawerContent.map((obj) => (
                <ListItem key={obj.text} disablePadding>
                  <ListItemButton href={obj.href}>
                    <ListItemIcon>
                      {obj.icon}
                    </ListItemIcon>
                    <ListItemText primary={obj.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Toolbar />
          {children}        
        </Box>
      </Box>
    </ThemeProvider>
  );
}

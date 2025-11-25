"use client";

import { clearData } from "@/utils/storage";
import {
  Category,
  Home,
  Image,
  Menu as MenuIcon,
  RestartAlt,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all data? This will clear your local changes and reload from the API."
      )
    ) {
      clearData();
      window.location.reload();
    }
  };

  const navItems = [
    { label: "Home", icon: <Home />, path: "/" },
    { label: "Categories", icon: <Category />, path: "/categories" },
    { label: "Images", icon: <Image />, path: "/images" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Image Management
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <Link
              href={item.path}
              style={{
                textDecoration: "none",
                color: "inherit",
                width: "100%",
              }}
            >
              <ListItemButton selected={pathname === item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
          >
            <ListItemIcon>
              <RestartAlt color="error" />
            </ListItemIcon>
            <ListItemText
              primary="Reset Data"
              primaryTypographyProps={{ color: "error" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Image Management
        </Typography>
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  color="inherit"
                  startIcon={item.icon}
                  sx={{
                    backgroundColor:
                      pathname === item.path
                        ? "rgba(255, 255, 255, 0.1)"
                        : "transparent",
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button
              color="inherit"
              startIcon={<RestartAlt />}
              onClick={handleReset}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                  borderColor: "white",
                },
              }}
              variant="outlined"
            >
              Reset Data
            </Button>
          </Box>
        )}
      </Toolbar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

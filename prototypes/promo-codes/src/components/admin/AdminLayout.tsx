import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TuneIcon from "@mui/icons-material/Tune";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Promo Codes", path: "/admin", icon: <ConfirmationNumberIcon fontSize="small" />, exact: true },
  { label: "Rate Plan Policies", path: "/admin/rate-plans", icon: <TuneIcon fontSize="small" /> },
];

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const location = useLocation();

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar
        sx={{
          px: 2,
          minHeight: "56px !important",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              bgcolor: "primary.main",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "white", fontWeight: 700, fontSize: "0.8rem" }}>K</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", lineHeight: 1.2 }}>Kontrol</Typography>
            <Typography sx={{ fontSize: "0.625rem", color: "grey.500", lineHeight: 1 }}>Promo Codes</Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton size="small" onClick={() => setDrawerOpen(false)}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, pt: 1, flex: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.exact}
            selected={isActive(item.path, item.exact)}
            onClick={() => isMobile && setDrawerOpen(false)}
            sx={{
              borderRadius: "6px",
              mb: 0.5,
              py: 0.75,
              color: "grey.700",
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
                "& .MuiListItemIcon-root": { color: "white" },
              },
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: "0.8125rem", fontWeight: 500 }} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        <ListItemButton
          component={NavLink}
          to="/checkout"
          onClick={() => isMobile && setDrawerOpen(false)}
          sx={{
            borderRadius: "6px",
            py: 0.75,
            color: "grey.500",
            "&:hover": { bgcolor: "grey.100", color: "grey.700" },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
            <ShoppingCartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Checkout Demo" primaryTypographyProps={{ fontSize: "0.8125rem" }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Top AppBar - mobile only */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ minHeight: "56px !important" }}>
            <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 1, color: "grey.700" }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: "primary.main",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "white", fontWeight: 700, fontSize: "0.8rem" }}>K</Typography>
              </Box>
              <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "grey.900" }}>
                Kontrol
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: isMobile ? 0 : DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "background.paper",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: "auto",
          bgcolor: "background.default",
          p: { xs: 2, sm: 3 },
          pt: isMobile ? "72px" : { xs: 2, sm: 3 },
          maxWidth: "100%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

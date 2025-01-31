import { Link, useNavigate, useLocation } from "react-router-dom";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";

import useAuthStore from "../store/useAuthStore";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          UserDash
        </Typography>

        {isAuthenticated ? (
          <>
            {location.pathname !== "/dashboard" && (
              <Button color="inherit" component={Link} to="/dashboard" sx={{ mr: 2 }}>
                Dashboard
              </Button>
            )}
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login" sx={{ mr: 2 }}>
              Login
            </Button>
            <Button variant="contained" component={Link} to="/signup">
              Get Started
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

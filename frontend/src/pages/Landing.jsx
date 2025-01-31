import { Link } from "react-router-dom"
import { Container, Typography, Button, Box } from "@mui/material"
import { GitHub } from "@mui/icons-material"
import Navbar from "../components/Navbar"

export default function Landing() {
  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

        <Container
          maxWidth="lg"
          sx={{
            mt: 8,
            mb: 8,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mb: 4,
              background: "linear-gradient(45deg, #6b46c1 30%, #d53f8c 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontWeight: "bold",
            }}
          >
            Manage your users with ease using our modern dashboard
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            A powerful user management system with intuitive controls. Add, edit, and manage users seamlessly
            with our modern interface.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="contained" size="large" component={Link} to="/signup">
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<GitHub />}
              href="https://github.com/TarunVuppala/authentication"
              target="_blank"
            >
              GitHub
            </Button>
          </Box>
        </Container>
      </Box>
    </>

  )
}

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Container, Paper, Typography, TextField, Button, Box, Grid, Link as MuiLink } from "@mui/material"
import { toast } from "react-toastify"

import useAuthStore from "../store/useAuthStore"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    const result = await login(email, password)

    if (result.success) {
      toast.success("Login successful")
      navigate("/dashboard")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
            Please enter your credentials to continue
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <MuiLink component={Link} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login


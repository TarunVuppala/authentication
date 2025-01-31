import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Container, Paper, Typography, TextField, Button, Box, Grid, Link as MuiLink } from "@mui/material"
import { toast } from "react-toastify"

import useAuthStore from "../store/useAuthStore"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signup, isLoading, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleSignup = async (e) => {
    e.preventDefault()
    const result = await signup(email, password)

    if (result.success) {
      toast.success(result.message)
      navigate("/login")
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
            Create Account
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
            Fill in your information to get started
          </Typography>
          <form onSubmit={handleSignup}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <MuiLink component={Link} to="/login" variant="body2">
                  {"Already have an account? Sign In"}
                </MuiLink>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

export default Signup


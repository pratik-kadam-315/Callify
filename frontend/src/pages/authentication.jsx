import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { AuthContext } from "../contexts/AuthContext";
import { Typography, useTheme } from "@mui/material";

export default function Authentication() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success"); // success | error
  const [formState, setFormState] = React.useState(0); // 0 = login, 1 = register
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);
  const theme = useTheme();

  const handleAuth = async () => {
    try {
      // LOGIN
      if (formState === 0) {
        await handleLogin(username, password);
        setMessage("Login successful");
        setSeverity("success");
        setOpen(true);
      }

      // REGISTER
      if (formState === 1) {
        const result = await handleRegister(name, username, password);
        setMessage(result || "Registered successfully");
        setSeverity("success");
        setOpen(true);

        // reset form
        setFormState(0);
        setName("");
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Something went wrong";

      setMessage(errorMessage);
      setSeverity("error");
      setOpen(true);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "calc(100vh - 64px)" }}>
      {/* LEFT IMAGE */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            "url(https://source.unsplash.com/random?technology)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* RIGHT FORM */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: '400px',
            width: '100%'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
            {formState === 0 ? "Welcome Back" : "Create Account"}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {formState === 0 ? "Sign in to continue to Callify" : "Join the future of video calling"}
          </Typography>

          {/* SWITCH BUTTONS */}
          <Box sx={{ mb: 3, mt: 2, bgcolor: 'background.default', p: 0.5, borderRadius: 3 }}>
            <Button
              variant={formState === 0 ? "contained" : "text"}
              onClick={() => setFormState(0)}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Sign In
            </Button>
            <Button
              variant={formState === 1 ? "contained" : "text"}
              onClick={() => setFormState(1)}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Sign Up
            </Button>
          </Box>

          {/* FORM */}
          <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
            {formState === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus={formState === 0}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
              onClick={handleAuth}
            >
              {formState === 0 ? "Login" : "Register"}
            </Button>
          </Box>
        </Box>
      </Grid>

      {/* SNACKBAR */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

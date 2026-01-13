import { useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

type Severity = "success" | "error" | "warning" | "info";

export const useSnackbar = () => {
  const [state, setState] = useState({
    open: false,
    message: "",
    severity: "success" as Severity,
  });

  const showSnackbar = useCallback((message: string, severity: Severity = "success") => {
    setState({ open: true, message, severity });
  }, []);

  const showSuccess = useCallback((message: string) => {
    showSnackbar(message, "success");
  }, [showSnackbar]);

  const showError = useCallback((message: string) => {
    showSnackbar(message, "error");
  }, [showSnackbar]);

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const SnackbarComponent = (
    <Snackbar
      open={state.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={state.severity} sx={{ width: "100%" }}>
        {state.message}
      </Alert>
    </Snackbar>
  );

  return {
    showSnackbar,
    showSuccess,
    showError,
    SnackbarComponent,
  };
};

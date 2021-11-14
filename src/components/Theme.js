import { createTheme } from "@mui/material/styles";
import green from "@mui/material/colors/green";
import grey from "@mui/material/colors/grey";
import red from "@mui/material/colors/red";

let theme = createTheme({
    palette: {
        primary: grey,
        secondary: green,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
});

const Theme = createTheme(theme, {
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: "white",
                    borderRadius: "0.8rem",
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: "gray",
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: "white !important",
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    borderRadius: "0.8rem",
                    color: "white !important",
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                container: {
                    backdropFilter: "brightness(75%)",
                },
                paper: {
                    borderRadius: "0.8rem",
                    textAlign: "center",
                    backgroundColor: "#40434a",
                    color: "white",
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecoration: "none",
                },
            },
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    paddingBottom: "20px",
                },
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    backgroundColor: "#292a2e !important",
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: "rgb(32, 32, 32) !important",
                    color: "rgb(212, 212, 212) !important",
                    borderRadius: "0.5rem",
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    paddingTop: "10px !important",
                    paddingBottom: "10px !important",
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    backgroundColor: "rgba(32, 32, 32, 1) !important",
                    color: "rgb(212, 212, 212) !important",
                    borderRadius: "0.5rem",
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: "gray !important",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(32, 32, 32, 1)",
                    color: "rgb(212, 212, 212)",
                    borderRadius: "0.5rem",
                },
            },
        },
        MuiSnackbarContent: {
            styleOverrides: {
                root: {
                    borderRadius: "0.6rem",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "500",
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                body1: {
                    color: "rgba(255, 255, 255, 0.85) !important",
                },
            },
        },
    },
});

export default Theme;

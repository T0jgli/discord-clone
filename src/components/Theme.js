import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';

const Theme = createMuiTheme({
    palette: {
        primary: grey,
        secondary: green,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    overrides: {
        MuiButton: {
            root: {
                color: 'white',
                borderRadius: "0.8rem"
            },
        },
        MuiFormLabel: {
            root: {
                color: "gray"
            }
        },
        MuiInputBase: {
            input: {
                color: "white"
            }
        },
        MuiTab: {
            root: {
                borderRadius: "0.8rem"
            }
        },
        MuiDialog: {
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
        MuiDialogContent: {
            root: {
                paddingBottom: "20px"
            }
        },
        MuiDialogActions: {
            root: {
                backgroundColor: "#292a2e !important"
            }
        },
        MuiMenu: {
            paper: {
                backgroundColor: "rgb(32, 32, 32) !important",
                color: "rgb(212, 212, 212) !important",
                borderRadius: "0.5rem",
            }
        },
        MuiListItem: {
            root: {
                paddingTop: "10px !important",
                paddingBottom: "10px !important"
            }
        },
        MuiPopover: {
            paper: {
                backgroundColor: "rgba(32, 32, 32, 1) !important",
                color: "rgb(212, 212, 212) !important",
                borderRadius: "0.5rem",
            }
        },
        MuiCheckbox: {
            root: {
                color: "gray !important"
            }
        },
        MuiPaper: {
            root: {
                backgroundColor: "rgba(32, 32, 32, 1)",
                color: "rgb(212, 212, 212)",
                borderRadius: "0.5rem",
            }
        },
        MuiSnackbarContent: {
            root: {
                borderRadius: "0.6rem",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: "500",
            }
        },
        MuiTypography: {
            body1: {
                color: "rgba(255, 255, 255, 0.85) !important"
            }
        }
    },
});

export default Theme

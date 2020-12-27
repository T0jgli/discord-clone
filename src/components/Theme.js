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
                backgroundColor: "#474b53",
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
                backgroundColor: "#363a3f"
            }
        },
        MuiMenu: {
            paper: {
                top: "8% !important",
                left: "0% !important",
                width: "25%",
                minWidth: "200px",
                backgroundColor: "rgb(32, 32, 32) !important",
                color: "rgb(212, 212, 212) !important",
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

import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { selectlanguage, selectsnackbar, setsnackbar } from "../lib/redux/AppSlice";
import { useDispatch, useSelector } from "react-redux";

const Snackbars = () => {
    const dispatch = useDispatch();

    const language = useSelector(selectlanguage);
    const snackbaropen = useSelector(selectsnackbar);
    return (
        <Snackbar
            open={snackbaropen?.open}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: snackbaropen?.signout ? "right" : "center",
            }}
            autoHideDuration={snackbaropen?.filesizeerror ? 5000 : 3000}
            onClose={(event, reason) => {
                if (reason === "clickaway") {
                    return;
                }
                dispatch(setsnackbar({ snackbar: { ...snackbaropen, open: false } }));
            }}
        >
            <MuiAlert
                elevation={5}
                variant="filled"
                onClose={(event, reason) => {
                    if (reason === "clickaway") {
                        return;
                    }
                    dispatch(setsnackbar({ snackbar: { ...snackbaropen, open: false } }));
                }}
                severity={snackbaropen?.type}
            >
                {language === "hu" ? snackbaropen?.hu : snackbaropen?.en}
            </MuiAlert>
        </Snackbar>
    );
};

export default Snackbars;

import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { selectlanguage, selectsnackbar, setsnackbar } from "../lib/AppSlice"
import { useDispatch, useSelector } from 'react-redux'

const Snackbars = () => {
    const dispatch = useDispatch()

    const language = useSelector(selectlanguage)
    const snackbaropen = useSelector(selectsnackbar)
    return (
        <Snackbar open={snackbaropen?.open} anchorOrigin={{ vertical: snackbaropen?.signout ? 'top' : 'bottom', horizontal: snackbaropen?.signout ? 'right' : 'center' }}
            autoHideDuration={snackbaropen?.filesizeerror ? (5000) : (3000)} onClose={(event, reason) => {
                if (reason === "clickaway") { return; };
                dispatch(setsnackbar({ snackbar: { ...snackbaropen, open: false } }))
            }}>
            <MuiAlert elevation={5} variant="filled"
                onClose={(event, reason) => { if (reason === "clickaway") { return; }; dispatch(setsnackbar({ snackbar: { ...snackbaropen, open: false } })) }}
                severity={snackbaropen?.type}
            >
                {language === "hu" ? (snackbaropen?.hu) : (snackbaropen?.en)}
            </MuiAlert>
        </Snackbar>
    )
}

export default Snackbars

import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { selectlanguage, selectsnackbar, setsnackbar } from "../lib/AppSlice"
import { useDispatch, useSelector } from 'react-redux'

function Alert (props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Snackbars = () => {
    const language = useSelector(selectlanguage)
    const snackbaropen = useSelector(selectsnackbar)
    const dispatch = useDispatch()
    return (
        <Snackbar open={snackbaropen?.open} autoHideDuration={snackbaropen?.filesizeerror ? (5000) : (3000)} onClose={(event, reason) => {
            if (reason === "clickaway") { return; };
            dispatch(setsnackbar({ snackbar: { ...snackbaropen, open: false } }))
        }}>
            <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; dispatch(setsnackbar({ snackbar: { ...snackbaropen, open: false } })) }}
                severity={snackbaropen?.type}>{language === "hu" ? (snackbaropen?.hu) : (snackbaropen?.en)}
            </Alert>
        </Snackbar>
    )
}

export default Snackbars

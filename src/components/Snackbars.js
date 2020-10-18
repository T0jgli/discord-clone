import React, { useState, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { selectlanguage } from "../features/AppSlice"
import { useSelector } from 'react-redux'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function Snackbars({ copystate, setcopystate, channelcreated, setchannelcreated, channeldeleted,
    setchanneldeleted, channerror, setchannerror, filesizeerror, setfilesizeerror, filesize,
    signouttoast, setsignouttoast, logintoast, setlogintoast, loginerror, setloginerror, loginmessage, categoriecreated, setcategoriecreated }) {
    const language = useSelector(selectlanguage)
    const [converted, setconverted] = useState(null)

    useEffect(() => {
        if (filesize) {
            setconverted(formatBytes(filesize))
        }
    }, [filesize])

    return (
        <>
            <Snackbar open={loginerror} autoHideDuration={6000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setloginerror({...loginerror, open: false}) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setloginerror({...loginerror, open: false}) }}
                    severity="error">{loginmessage}
                </Alert>
            </Snackbar>

            <Snackbar open={signouttoast} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setsignouttoast(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setsignouttoast(false) }}
                    severity="warning">{language === "hun" ? ("Sikeres kijelentkezés!") : ("Successful sign out!")}
                </Alert>
            </Snackbar>

            <Snackbar
                open={logintoast} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setlogintoast(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setlogintoast(false) }}
                    severity="success">{language === "hun" ? ("Sikeres bejelentkezés!") : ("Successful login!")}
                </Alert>
            </Snackbar>

            <Snackbar
                open={categoriecreated} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcategoriecreated(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcategoriecreated(false) }}
                    severity="success">{language === "hun" ? ("Kategória létrehozva!") : ("Categorie created!")}
                </Alert>
            </Snackbar>

            <Snackbar open={copystate} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcopystate(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcopystate(false) }}
                    severity="info">{language === "hun" ? ("A link vágólapra másolva!") : ("Link copied to clipboard!")}
                </Alert>
            </Snackbar>

            <Snackbar open={channelcreated}
                autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchannelcreated(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchannelcreated(false) }}
                    severity="success">{language === "hun" ? ("Csatorna létrehozva!") : ("Channel created!")}
                </Alert>
            </Snackbar>

            <Snackbar open={channeldeleted}
                autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchanneldeleted(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchanneldeleted(false) }}
                    severity="warning">{language === "hun" ? ("Csatorna sikeresen törölve!") : ("Channel deleted!")}
                </Alert>
            </Snackbar>

            <Snackbar open={channerror} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchannerror(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchannerror(false) }}
                    severity="error">{language === "hun" ? ("Azért ehhez meg kéne adni egy nevet is!") : ("I think you should write a name first!")}
                </Alert>
            </Snackbar>

            <Snackbar open={filesizeerror} autoHideDuration={6000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setfilesizeerror(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setfilesizeerror(false) }}
                    severity="error">{language === "hun" ? (`A fájl mérete ${converted}, amely meghaladja a maximális méretet (50 MB)!`) :
                        (`File size is ${converted}, which exceeds the maximum size!`)}
                </Alert>
            </Snackbar>

        </>
    )
}

export default Snackbars

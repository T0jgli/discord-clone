import React, { useState, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { selectlanguage } from "../features/AppSlice"
import { useSelector } from 'react-redux'

function Alert (props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function formatBytes (bytes, decimals = 1) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function Snackbars ({ copystate, delmessagesuccess, setdelmessagesuccess, setcopystate, channelcreated, setchannelcreated, channeldeleted,
    setchanneldeleted, channerror, setchannerror, filesizeerror, setfilesizeerror,
    signouttoast, setsignouttoast, logintoast, setlogintoast, loginerror, setloginerror, loginmessage, categoriecreated, setcategoriecreated,
    setfiledelete, filedelete, categoriedeleted, setcategoriedeleted, categoriedeletederror, setcategoriedeletederror, setcategorieprivateprompt,
    categorieprivateprompt
}) {
    const language = useSelector(selectlanguage)
    const [converted, setconverted] = useState(null)

    useEffect(() => {
        if (filesizeerror) {
            setconverted(formatBytes(filesizeerror.size))
        }
    }, [filesizeerror])

    return (
        <>
            <Snackbar open={loginerror?.open} autoHideDuration={3000}
                onClose={(event, reason) => { if (reason === "clickaway") { return; }; setloginerror({ ...loginerror, open: false }) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setloginerror({ ...loginerror, open: false }) }}
                    severity="error">{loginmessage}
                </Alert>
            </Snackbar>

            <Snackbar open={filedelete?.prompt} autoHideDuration={3000}
                onClose={(event, reason) => { if (reason === "clickaway") { return; }; setfiledelete({ ...filedelete, prompt: false }) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setfiledelete({ ...filedelete, prompt: false }) }}
                    severity="warning"> {language === "hu" ? (`${filedelete?.type} sikeresen eltávolítva!`) : (`${filedelete?.type} sucessfully deleted!`)}
                </Alert>
            </Snackbar>

            <Snackbar open={categorieprivateprompt?.prompt} autoHideDuration={3000}
                onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcategorieprivateprompt({ ...categorieprivateprompt, prompt: false }) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcategorieprivateprompt({ ...categorieprivateprompt, prompt: false }) }}
                    severity="info">
                    {language === "hu" ? (categorieprivateprompt?.type === "public" ? ("A kategória mostantól publikus!") : ("A kategória mostantól privát!")) :
                        ("Categorie successfully set to " + categorieprivateprompt?.type)
                    }
                </Alert>
            </Snackbar>

            <Snackbar open={signouttoast} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setsignouttoast(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setsignouttoast(false) }}
                    severity="warning">{language === "hu" ? ("Sikeres kijelentkezés!") : ("Successful sign out!")}
                </Alert>
            </Snackbar>

            <Snackbar
                open={logintoast} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setlogintoast(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setlogintoast(false) }}
                    severity="success">{language === "hu" ? ("Sikeres bejelentkezés!") : ("Successful login!")}
                </Alert>
            </Snackbar>

            <Snackbar
                open={categoriecreated} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcategoriecreated(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcategoriecreated(false) }}
                    severity="success">{language === "hu" ? ("Kategória létrehozva!") : ("Categorie created!")}
                </Alert>
            </Snackbar>

            <Snackbar
                open={categoriedeletederror} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcategoriedeletederror(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcategoriedeletederror(false) }}
                    severity="error">{language === "hu" ? ("Kategória nem üres, előbb töröld a csatornáit!") : ("Categorie is not empty, first delete the channels!")}
                </Alert>
            </Snackbar>

            <Snackbar
                open={categoriedeleted} autoHideDuration={3000}
                onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcategoriedeleted(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcategoriedeleted(false) }}
                    severity="warning">{language === "hu" ? ("Kategória sikeresen törölve!") : ("Categorie deleted!")}
                </Alert>
            </Snackbar>

            <Snackbar open={copystate} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcopystate(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcopystate(false) }}
                    severity="info">{language === "hu" ? ("A link vágólapra másolva!") : ("Link copied to clipboard!")}
                </Alert>
            </Snackbar>

            <Snackbar open={channelcreated}
                autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchannelcreated(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchannelcreated(false) }}
                    severity="success">{language === "hu" ? ("Csatorna létrehozva!") : ("Channel created!")}
                </Alert>
            </Snackbar>

            <Snackbar open={channeldeleted}
                autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchanneldeleted(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchanneldeleted(false) }}
                    severity="warning">{language === "hu" ? ("Csatorna sikeresen törölve!") : ("Channel deleted!")}
                </Alert>
            </Snackbar>

            <Snackbar open={delmessagesuccess}
                autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setdelmessagesuccess(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setdelmessagesuccess(false) }}
                    severity="warning">{language === "hu" ? ("Üzenet sikeresen törölve!") : ("Message deleted!")}
                </Alert>
            </Snackbar>

            <Snackbar open={channerror} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchannerror(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setchannerror(false) }}
                    severity="error">{language === "hu" ? ("Azért ehhez meg kéne adni egy nevet is!") : ("I think you should write a name first!")}
                </Alert>
            </Snackbar>

            <Snackbar open={filesizeerror?.prompt} autoHideDuration={5000}
                onClose={(event, reason) => { if (reason === "clickaway") { return; }; setfilesizeerror({ ...filesizeerror, prompt: false }) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setfilesizeerror({ ...filesizeerror, prompt: false }) }}
                    severity="error">{language === "hu" ? (`A fájl mérete ${converted}, amely meghaladja a maximális méretet (50 MB)!`) :
                        (`File size is ${converted}, which exceeds the maximum size!`)}
                </Alert>
            </Snackbar>

        </>
    )
}

export default Snackbars

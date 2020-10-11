import { Avatar, Button, IconButton } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { selectChannelId } from '../../features/AppSlice'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import db from '../../firebase/firebase'
import { useSelector } from 'react-redux'
import Link from '@material-ui/core/Link';
import CloseIcon from '@material-ui/icons/Close';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Message({ timestamp, user, message, imageurl, fileurl, filename, language }) {
    const [dialog, setdialog] = useState(false)
    const [runned, setrunned] = useState(false)
    const [counter, setcounter] = useState(0)
    const [copystate, setcopystate] = useState(false)
    const channelid = useSelector(selectChannelId)

    const countfunc = () => {
        if (!runned) {
            db.collection("channels")
                .doc(channelid)
                .collection("messages")
                .onSnapshot(snapshot => snapshot.docs.map(doc => {
                    if (doc.data().user.uid === user.uid) {
                        setcounter(counter => counter + 1)
                    }
                }))
            setrunned(true)
        }
        setdialog(true)
    }

    const copy = () => {
        if (imageurl) {
            navigator.clipboard.writeText(imageurl)
        }
        else {
            navigator.clipboard.writeText(fileurl)
        }
        document.execCommand("copy");
        setcopystate(true)
    }
    return (
        <>
            <div className="message">
                <Avatar onClick={() => { countfunc() }} src={user.photo} />
                <div  className="message__info">
                    <h4  onClick={() => { countfunc() }}>{user.displayname}<span>{new Date(timestamp?.toDate()).toUTCString()}</span></h4>
                    <p>{message}</p>
                    {imageurl && (<img onClick={() => window.open(imageurl, "_blank")} src={imageurl} />)}
                    {fileurl && (
                        <>
                            <a href={fileurl} download>
                            <Button variant="contained">
                                <InsertDriveFileIcon style={{ marginRight: "5px" }} /> {filename}
                            </Button>
                            </a>
                            <IconButton style={{background: "transparent"}} color="default" onClick={copy}>
                                <FileCopyIcon />
                            </IconButton>
                        </>)}
                </div>
            </div>
            <Dialog open={dialog} onClose={() => setdialog(false)}>
                <DialogContent>
                    <img src={user.photo} />
                    <DialogTitle>
                        <p style={{ fontWeight: "bold" }}>{user.displayname}</p>
                    </DialogTitle>
                    <DialogContentText>
                        <Link href={"mailto: " + user.email} color="inherit">{user.email}</Link>
                        <br />
                        <br />
                        {language === "hun" ? ("Összes üzenete a csatornán:") : ("All messages on the channel:")} {counter}
                    </DialogContentText>
                </DialogContent>
                <div className="dialog__closeicon">
                    <IconButton onClick={() => setdialog(false)}>
                        <CloseIcon />
                    </IconButton>
                </div>

            </Dialog>
            {copystate && (<Snackbar open={copystate} autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcopystate(false) }}>
                <Alert onClose={(event, reason) => { if (reason === "clickaway") { return; }; setcopystate(false) }}
                    severity="info">{language === "hun" ? ("A link vágólapra másolva!") : ("Link copied to clipboard!")}
                </Alert>
            </Snackbar>)}
        </>
    )
}

export default Message

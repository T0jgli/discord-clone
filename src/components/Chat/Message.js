import React, { forwardRef, useState } from 'react'

import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DescriptionIcon from '@material-ui/icons/Description';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';

import { selectcategorieid, selectChannelId, selectlanguage, setsnackbar } from '../../lib/AppSlice'
import db, { storage } from '../../lib/firebase'
import { useDispatch, useSelector } from 'react-redux'

import Userdialog from '../Dialogs/Userdialog';
import { selectUser } from '../../lib/userSlice';

function getdays (messagetime) {
    let today = new Date()
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1)
    let todaybool = false
    let yesterdaybool = false
    if (messagetime.getDate() === today.getDate() && messagetime.getMonth() === today.getMonth()) {
        todaybool = true;
    }
    if (messagetime.getDate() === yesterday.getDate() && messagetime.getMonth() === yesterday.getMonth()) {
        yesterdaybool = true
    }

    if (todaybool) return "Today"
    else if (yesterdaybool) return "Yesterday"
    else return null

}

function geturl (message) {
    let exactprefix, messageendindex = "", messageafterurl = "", messagebeforeurl = "", messageurl = "", newmessage = [];
    let prefixes = ["www.", "https://", "http://", "ftp://"]
    prefixes.map((prefix) => {
        if (message.includes(prefix)) {
            exactprefix = prefix
        }
        return null
    })
    if (exactprefix) {
        for (let index = message.indexOf(exactprefix); index < message.length; index++) {
            if (message[index] === ' ') {
                break;
            }
            else {
                messageurl += message[index]
                messageendindex = index
            }
        }
        for (let index = 0; index < message.indexOf(exactprefix); index++) {
            messagebeforeurl += message[index]
        }
        for (let index = messageendindex + 1; index < message.length; index++) {
            messageafterurl += message[index]

        }
    }
    newmessage.push(messageurl)
    newmessage.push(messagebeforeurl)
    newmessage.push(messageafterurl)
    if (exactprefix) {
        return newmessage
    }
    else {
        return null
    }
}

function messagetimefunc (t) {
    let minute = t.getMinutes()
    let seconds = t.getSeconds()
    if (minute < 10) {
        minute = "0" + t.getMinutes()
    }
    if (seconds < 10)
        seconds = "0" + t.getSeconds()
    return minute + ":" + seconds
}

const Message = forwardRef(({ timestamp, user,
    message, imageurl, imagename, fileurl, filename, id, setlightbox, searched }, ref) => {
    const dispatch = useDispatch()

    const userloggedin = useSelector(selectUser)
    const channelid = useSelector(selectChannelId)
    const categorieid = useSelector(selectcategorieid)
    const language = useSelector(selectlanguage)

    const [dialog, setdialog] = useState(false)
    const [runned, setrunned] = useState(false)
    const [deleteprompt, setdeleteprompt] = useState(false)
    const [lastlogin, setlastlogin] = useState(null)
    const [counter, setcounter] = useState(0)

    let messagetime = new Date(timestamp?.toDate())
    const countfunc = () => {
        if (!runned) {
            db.collection("categories").doc(categorieid).collection("channels")
                .doc(channelid)
                .collection("messages")
                .onSnapshot(snapshot => snapshot.docs.map(doc => {
                    if (doc.data().user.uid === user.uid) {
                        setcounter(counter => counter + 1)
                    }
                    return null
                }))
            db.collection("users")
                .doc(user.uid).get().then(doc => {
                    let lastlogintime = new Date(doc.data().lastlogin?.toDate());
                    setlastlogin(lastlogintime.toLocaleString("hu-HU"))
                }).then(() => { setdialog(true); setrunned(true) })
        }
        else {
            setdialog(true)

        }
    }

    const copy = () => {
        if (imageurl) {
            navigator.clipboard.writeText(imageurl)
        }
        else {
            navigator.clipboard.writeText(fileurl)
        }
        document.execCommand("copy");
        dispatch(setsnackbar({
            snackbar: {
                open: true,
                type: "info",
                hu: "A link vágólapra másolva!",
                en: "Link copied to clipboard!"
            }
        }))
    }

    const deletefunc = () => {
        if (imageurl) {
            let ref = storage.ref().child(`images/${imagename}`)
            ref.delete()
        }
        if (fileurl) {
            let ref = storage.ref().child(`files/${filename}`)
            ref.delete()
        }
        db.collection("categories").doc(categorieid)
            .collection("channels").doc(channelid)
            .collection("messages").doc(id).delete();
        dispatch(setsnackbar({
            snackbar: {
                open: true,
                type: "success",
                hu: "Üzenet sikeresen törölve!",
                en: "Message deleted!"
            }
        }))
    }
    return (
        <>
            <div ref={ref} className={searched ? ("message searched") : ("message")}>
                <Avatar onClick={() => { countfunc() }} src={user.photo} />
                <div className="message__info">
                    <h4>
                        <span onClick={() => { countfunc() }} className="name">{user.displayname}</span>
                        {timestamp && (
                            <span className="time">
                                {getdays(messagetime) === "Today" ?
                                    language === "hu" ? ("Ma " + messagetime?.getHours() + ":" + messagetimefunc(messagetime)) :
                                        ("Today " + messagetime?.getHours() + ":" + messagetimefunc(messagetime)) :
                                    getdays(messagetime) === "Yesterday" ?
                                        language === "hu" ? ("Tegnap " + messagetime?.getHours() + ":" + messagetimefunc(messagetime)) :
                                            ("Yesterday " + messagetime?.getHours() + ":" + messagetimefunc(messagetime)) :
                                        (messagetime?.toLocaleString('hu-HU'))}
                            </span>)}
                    </h4>

                    <p>
                        {geturl(message) ?
                            (
                                <>
                                    {geturl(message)[1]}
                                    <a rel="noopener noreferrer" href={geturl(message)[0]} className="message__url" target="_blank" >{geturl(message)[0]}</a>
                                    {geturl(message)[2]}
                                </>
                            ) :
                            (message)}
                    </p>

                    {imageurl && (<img alt="messageImage"
                        onClick={() => setlightbox({ toggler: true, url: imageurl, user: user.displayname, timestamp: timestamp })} src={imageurl} />)}
                    {fileurl && (
                        <>
                            <a href={fileurl} rel="noreferrer"
                                target={filename.split(".").slice(-1)[0] === "pdf" ? ("_blank") : undefined} download>
                                <Button variant="contained">
                                    {filename.split(".").slice(-1)[0] === "pdf" ? (
                                        <DescriptionIcon fontSize="small" style={{ marginRight: "5px" }} />
                                    ) : (
                                            <InsertDriveFileIcon fontSize="small" style={{ marginRight: "5px" }} />
                                        )}
                                    {filename.split("__")[0]
                                        + "." + filename.split(".").slice(-1)[0]
                                    }
                                </Button>
                            </a>
                            <Tooltip title={language === "hu" ? ("Fájl URL másolása") : ("Copy file URL")} placement="right">
                                <IconButton style={{ background: "transparent" }} color="default" onClick={copy}>
                                    <FileCopyIcon />
                                </IconButton>
                            </Tooltip>
                        </>)}
                </div>
                {user.uid === userloggedin.uid && (
                    <div className="message__delicon">
                        <Tooltip title={language === "hu" ? ("Üzenet törlése") : ("Delete message")} placement="left">
                            <IconButton onClick={() => setdeleteprompt(true)} >
                                <DeleteIcon style={{ color: "grey" }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}

            </div>

            <Dialog onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    deletefunc()
                }
                if (e.key === "Escape" || e.key === "Backspace") {
                    setdeleteprompt(false)
                }
            }} open={deleteprompt} onClose={() => setdeleteprompt(false)}>
                <DialogContent>
                    <DialogTitle>
                        {language === "hu" ? ("Biztosan törlöd az üzenetet?") : ("Are you sure you want to delete this message?")}
                    </DialogTitle>
                </DialogContent>
                <DialogActions >
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => { setdeleteprompt(false) }}>{language === "hu" ? ("Nem") : ("No")}</Button>
                    <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                        onClick={() => { deletefunc() }}>{language === "hu" ? ("Igen") : ("Yes")}</Button>
                </DialogActions>
            </Dialog>

            <Userdialog lastlogin={lastlogin} dialog={dialog} setdialog={setdialog} user={user} counter={counter} />
        </>
    )
})

export default Message

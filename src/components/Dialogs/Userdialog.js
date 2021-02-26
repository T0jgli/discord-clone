import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectlanguage } from '../../lib/AppSlice';

import CloseIcon from '@material-ui/icons/Close';
import Link from '@material-ui/core/Link';
import { IconButton, Dialog, DialogContent, DialogContentText, DialogTitle, Grow, Fade, Avatar } from '@material-ui/core'
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import hu from 'timeago.js/lib/lang/hu';
import db from '../../lib/firebase';

function Userdialog ({ dialog, setdialog, avatar, categorieid, channelid }) {
    const language = useSelector(selectlanguage)
    const [username, setusername] = useState(null)
    const [lastlogin, setlastlogin] = useState(null)
    const [counter, setcounter] = useState(0)
    const [runned, setrunned] = useState(false)

    const countfunc = () => {

        if (runned) return

        setrunned(true)
        const cleanup = db.collection("categories").doc(categorieid).collection("channels")
            .doc(channelid)
            .collection("messages")
            .onSnapshot(snapshot => snapshot.docs.map(doc => {
                if (doc.data().user.uid === dialog.user.uid) {
                    setcounter(counter => counter + 1)
                }
                return null
            }))
        return () => cleanup()
    }


    useEffect(() => {
        timeago.register('hu', hu);
        if (dialog.open) {
            db.collection("users")
                .doc(dialog?.user?.uid).get().then(doc => {
                    let lastlogintime = new Date(doc.data().lastlogin?.toDate());
                    setlastlogin(lastlogintime.toLocaleString("hu-HU"))
                })
            db.collection("users").doc(dialog?.user?.uid).get().then(u => {
                if (u.exists)
                    setusername(u.data().displayname)
            })
            if (!avatar)
                return countfunc()
        }

    }, [dialog])

    return (
        <Dialog TransitionComponent={Grow} open={dialog?.open} onClose={() => setdialog({ ...dialog, open: false })}>
            <DialogContent>
                {dialog?.user?.photo ? (
                    <img src={dialog?.user?.photo} alt="userphoto" style={{ borderRadius: "50%" }} />
                ) : dialog?.user?.photoUrl ? (
                    <img src={dialog?.user?.photoUrl} alt="userphoto" style={{ borderRadius: "50%" }} />
                ) : (
                            <Avatar className="userdialog__myavatar" src={dialog?.user?.photo}>
                                {dialog?.user?.displayname.substring(0, 1)}
                            </Avatar>
                        )}

                <DialogTitle>
                    <span style={{ fontWeight: "bold" }}>{dialog?.user?.displayname}</span>
                    <br />
                    {username && username !== dialog?.user?.displayname && (
                        <Fade in>
                            <span>({username})</span>
                        </Fade>

                    )}
                </DialogTitle>
                <DialogContentText>
                    <Link href={"mailto: " + dialog?.user?.email} color="inherit">{dialog?.user?.email}</Link>
                    <br />
                    <br />
                    {!avatar && (language === "hu" ? (<span>Összes üzenete a csatornán: <span>{counter}</span></span>) :
                        (<span>All messages on the channel: <span>{counter}</span></span>))}
                    {!avatar && (<br />)}
                    <span style={{ marginTop: "15px", fontWeight: "bolder", display: "inline-block" }}>{language === "hu" ? ("Utoljára bejelentkezve: ") : ("Last login: ")}
                        <TimeAgo datetime={lastlogin} locale={language === "hu" ? ("hu") : ("en")} /></span>
                </DialogContentText>
                {avatar && (<DialogContentText style={{ color: "gray", fontStyle: "italic" }}>
                    Uid: #{dialog?.user?.uid.substring(0, 5)}
                </DialogContentText>)}
            </DialogContent>
            <div className="dialog__closeicon">
                <IconButton onClick={() => setdialog({ ...dialog, open: false })}>
                    <CloseIcon />
                </IconButton>
            </div>

        </Dialog>

    )
}

export default Userdialog

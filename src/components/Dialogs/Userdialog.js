import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectlanguage } from '../../lib/AppSlice';

import CloseIcon from '@material-ui/icons/Close';
import Link from '@material-ui/core/Link';
import { IconButton, Dialog, DialogContent, DialogContentText, DialogTitle, Grow, Fade } from '@material-ui/core'
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import hu from 'timeago.js/lib/lang/hu';
import db from '../../lib/firebase';
import { selectUser } from '../../lib/userSlice';

function Userdialog ({ dialog, setdialog, counter, avatar, lastlogin }) {
    const language = useSelector(selectlanguage)
    const [username, setusername] = useState(null)
    const user = useSelector(selectUser)

    useEffect(() => {
        timeago.register('hu', hu);
        if (dialog)
            db.collection("users").doc(user.uid).get().then(u => {
                if (u.exists)
                    setusername(u.data().displayname)
            })


    }, [user, dialog])
    return (
        <Dialog TransitionComponent={Grow} open={dialog} onClose={() => setdialog(false)}>
            <DialogContent>
                <img src={user.photo} alt="userphoto" style={{ borderRadius: "50%" }} />
                <DialogTitle>
                    <span style={{ fontWeight: "bold" }}>{user.displayname}</span>
                    <br />
                    {username && username !== user.displayname && (
                        <Fade in>
                            <span>({username})</span>
                        </Fade>

                    )}
                </DialogTitle>
                <DialogContentText>
                    <Link href={"mailto: " + user.email} color="inherit">{user.email}</Link>
                    <br />
                    <br />
                    {!avatar && (language === "hu" ? (<span>Összes üzenete a csatornán: <span>{counter}</span></span>) :
                        (<span>All messages on the channel: <span>{counter}</span></span>))}
                    {!avatar && (<br />)}
                    <span style={{ marginTop: "15px", fontWeight: "bolder", display: "inline-block" }}>{language === "hu" ? ("Utoljára bejelentkezve: ") : ("Last login: ")}
                        <TimeAgo datetime={lastlogin} locale={language === "hu" ? ("hu") : ("en")} /></span>
                </DialogContentText>
                {avatar && (<DialogContentText style={{ color: "gray", fontStyle: "italic" }}>
                    Uid: #{user.uid.substring(0, 5)}
                </DialogContentText>)}
            </DialogContent>
            <div className="dialog__closeicon">
                <IconButton onClick={() => setdialog(false)}>
                    <CloseIcon />
                </IconButton>
            </div>

        </Dialog>

    )
}

export default Userdialog

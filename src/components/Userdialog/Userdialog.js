import React, { useEffect, useState } from 'react'
import "./Userdialog.css"
import { useSelector } from 'react-redux';
import { selectlanguage } from '../../lib/AppSlice';

import CloseIcon from '@material-ui/icons/Close';
import Link from '@material-ui/core/Link';
import { IconButton, Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import hu from 'timeago.js/lib/lang/hu';
import db from '../../lib/firebase';

function Userdialog ({ dialog, setdialog, user, counter, avatar, lastlogin }) {
    const language = useSelector(selectlanguage)
    const [username, setusername] = useState(null)

    useEffect(() => {
        timeago.register('hu', hu);
        db.collection("users").doc(user.uid).get().then(u => {
            setusername(u.data().displayname)
        })
    }, [user.uid])
    return (
        <Dialog open={dialog} onClose={() => setdialog(false)}>
            <DialogContent>
                <img src={user.photo} alt="userphoto" style={{ borderRadius: "50%" }} />
                <DialogTitle>
                    <span style={{ fontWeight: "bold" }}>{user.displayname}</span>
                    <br />
                    {username !== user.displayname && (
                        <span>({username})</span>
                    )}
                </DialogTitle>
                <DialogContentText>
                    <Link href={"mailto: " + user.email} color="inherit">{user.email}</Link>
                    <br />
                    <br />
                    {!avatar && (language === "hu" ? (<span>Összes üzenete a csatornán: <span>{counter}</span></span>) :
                        (<span>All messages on the channel: <span>{counter}</span></span>))}
                    <br />
                    {!avatar &&
                        (<span style={{ marginTop: "15px", fontWeight: "bolder", display: "inline-block" }}>{language === "hu" ? ("Utoljára bejelentkezve: ") : ("Last login: ")}
                            <TimeAgo datetime={lastlogin} locale={language === "hu" ? ("hu") : ("en")} /></span>)
                    }
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

import React from 'react'
import { useSelector } from 'react-redux';
import { selectlanguage } from '../../features/AppSlice';

import CloseIcon from '@material-ui/icons/Close';
import Link from '@material-ui/core/Link';
import { IconButton, Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import "./Userdialog.css"
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import hu from 'timeago.js/lib/lang/hu';

function Userdialog({ dialog, setdialog, user, counter, avatar, lastlogin }) {
    const language = useSelector(selectlanguage)
    timeago.register('hu', hu);
    return (
        <Dialog open={dialog} onClose={() => setdialog(false)}>
            <DialogContent>
                <img src={user.photo} style={{ borderRadius: "50%" }} />
                <DialogTitle>
                    <p style={{ fontWeight: "bold" }}>{user.displayname}</p>
                </DialogTitle>
                <DialogContentText>
                    <Link href={"mailto: " + user.email} color="inherit">{user.email}</Link>
                    <br />
                    <br />
                    {!avatar && (language === "hun" ? (<p>Összes üzenete a csatornán: <span>{counter}</span></p>) :
                        (<p>All messages on the channel: <span>{counter}</span></p>))}
                    {!avatar && (language === "hun" ?
                        (<p style={{ marginTop: "10px", fontWeight: "bolder" }}>Utoljára bejelentkezve: <TimeAgo datetime={lastlogin} locale={language === "hun" ? ("hu") : ("en")} /></p>) :
                        (<p style={{ marginTop: "10px", fontWeight: "bolder" }}>Last login: <TimeAgo datetime={lastlogin} locale={language === "hun" ? ("hu") : ("en")} /></p>))}

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

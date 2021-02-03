import React, { useEffect, useState } from 'react'
import {
    Dialog, Avatar, DialogContent, DialogTitle,
    IconButton, Tooltip, Grow
} from '@material-ui/core'
import db from '../../lib/firebase'
import { selectlanguage } from '../../lib/AppSlice'
import { useSelector } from 'react-redux'
import CloseIcon from '@material-ui/icons/Close';

const AllusersDialog = ({ usersmenu, setusersmenu }) => {
    const [users, setusers] = useState([])
    const language = useSelector(selectlanguage)

    useEffect(() => {
        if (usersmenu) {
            db.collection("users").orderBy("lastlogin", "desc").onSnapshot(snapshot => {
                setusers(snapshot.docs.map(snap => snap.data()))
            })
        }


    }, [usersmenu])

    return (
        <Dialog TransitionComponent={Grow} open={usersmenu} onClose={() => setusersmenu(false)}>
            <DialogContent>
                <DialogTitle>
                    {language === "hu" ? ("Felhasználók") : ("Users")}
                </DialogTitle>
                <DialogContent>
                    {users?.map((user, i) => (
                        <div className="userdialog__div" key={i}>
                            <div className="userdialog__avatar">
                                <Avatar src={user.photoUrl} />
                            </div>
                            <div className="userdialog__text">
                                <Tooltip title={language === "hu" ? `Utoljára bejelentkezve: ${user.lastlogin?.toDate().toLocaleString()}` :
                                    `Last login: ${user.lastlogin?.toDate().toLocaleString()}`}>
                                    <p style={{ opacity: "0.8", cursor: "default" }}>{user.displayname}</p>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </DialogContent>
            </DialogContent>
            <div className="dialog__closeicon">
                <IconButton onClick={() => setusersmenu(false)}>
                    <CloseIcon />
                </IconButton>
            </div>

        </Dialog>
    )
}

export default AllusersDialog

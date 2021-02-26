import React, { useEffect, useState } from 'react'
import {
    Dialog, Avatar, DialogContent, DialogTitle,
    IconButton, Grow
} from '@material-ui/core'
import db from '../../lib/firebase'
import { selectlanguage } from '../../lib/AppSlice'
import { useSelector } from 'react-redux'
import CloseIcon from '@material-ui/icons/Close';
import UserDialog from "./UserDialog"

const AllusersDialog = ({ usersmenu, setusersmenu }) => {
    const [users, setusers] = useState([])
    const language = useSelector(selectlanguage)
    const [dialog, setdialog] = useState({
        open: false,
        user: null
    })


    useEffect(() => {
        if (usersmenu) {
            const cleanup = db.collection("users").orderBy("lastlogin", "desc").onSnapshot(snapshot => {
                setusers(snapshot.docs.map(snap => (
                    {
                        ...snap.data(),
                        uid: snap.id
                    }
                )))
            })
            return () => cleanup()
        }
    }, [usersmenu])

    return (
        <>
            <Dialog TransitionComponent={Grow} open={usersmenu} onClose={() => setusersmenu(false)}>
                <DialogContent>
                    <DialogTitle>
                        {language === "hu" ? ("Felhasználók") : ("Users")}
                    </DialogTitle>
                    <DialogContent>
                        {users?.map((user, i) => (
                            <div className="userdialog__div" key={i} onClick={() => setdialog({
                                open: true,
                                user: {
                                    ...user,
                                    displayname: user.newusername || user.displayname
                                }
                            })}>
                                <div className="userdialog__avatar">
                                    <Avatar src={user.photoUrl} />
                                </div>
                                <div className="userdialog__text">
                                    <p style={{ opacity: "0.8", cursor: "default" }}>{user.displayname}</p>
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

            </Dialog >
            <UserDialog avatar setdialog={setdialog} dialog={dialog} />
        </>
    )
}

export default AllusersDialog

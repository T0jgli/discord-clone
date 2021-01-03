import React, { useState } from 'react'
import { selectlanguage, setlanguage, setsnackbar } from "../../lib/AppSlice"
import { useDispatch, useSelector } from 'react-redux'

import { SnackbarContent, Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField, Tooltip } from '@material-ui/core'

import Snackbar from '@material-ui/core/Snackbar';
import Giphy from "react-hooks-giphy";

import { auth, googleprovider } from "../../lib/firebase"
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const Login = () => {
    const dispatch = useDispatch()
    const language = useSelector(selectlanguage)
    const [langtoast, setlangtoast] = useState(false)
    const [open, setopen] = useState(false)
    const [logindata, setlogindata] = useState({ email: "", password: "" })

    const signinwithgoogle = () => {
        auth.signInWithPopup(googleprovider).then(() => {
            dispatch(setsnackbar({
                snackbar: {
                    open: true,
                    type: "success",
                    hu: "Sikeres bejelentkezés!",
                    en: "Successful login!"
                }
            }))

        }).catch(error => alert(error.message))

    }

    const signin = () => {
        auth.signInWithEmailAndPassword(logindata.email, logindata.password).catch(error => {
            dispatch(setsnackbar({
                snackbar: {
                    open: true,
                    type: "error",
                    hu: error.message,
                    en: error.message
                }
            }))

            setlogindata({ email: "", password: "" })
        })
    }

    return (
        <>
            <div className="login">
                <div className="login__logo">
                    <img src="/dclogo.png" alt="" />

                    <div className="loginlogo__gifdiv">
                        <Giphy tag="doggy" />
                    </div>
                </div>
                <div className="login__language">
                    <img src="/hu.png"
                        className={language !== "hu" && ("login__language__languageactive")}
                        onClick={() => {
                            localStorage.removeItem("language");
                            setlangtoast(true);
                            dispatch(setlanguage({
                                language: "hu"
                            }))
                        }} alt="huimage" />
                    <img src="/uk.png"
                        className={language === "hu" && ("login__language__languageactive")}
                        onClick={() => {
                            localStorage.setItem("language", "en", 365);
                            setlangtoast(true);
                            dispatch(setlanguage({
                                language: "en"
                            }))
                        }} alt="ukimage" />

                </div>
                <Button onClick={() => setopen(true)}>{language === "hu" ? ("Bejelentkezés") : ("Sign In")}</Button>

                <Snackbar open={langtoast} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    autoHideDuration={3000} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setlangtoast(false) }}>
                    <SnackbarContent message={language === "hu" ? ("Nyelv sikeresen beállítva") : ("Language set")}
                    />
                </Snackbar>

            </div>

            <Dialog open={open} onClose={() => setopen(false)}>
                <DialogContent>
                    <DialogTitle style={{ margin: "10px", fontWeight: "bold", fontSize: "larger" }}>
                        {language === "hu" ? ("Bejelentkezés") : ("Sign In!")}
                    </DialogTitle>
                    <ArrowDropDownIcon />
                    <form onKeyPress={(e) => { if (e.key === "Enter") { signin() } }}>
                        <TextField variant="filled" autoFocus style={{ margin: "10px" }}
                            value={logindata.email} fullWidth type="email" name="email"
                            onChange={(e) => setlogindata({ ...logindata, email: e.target.value })} label={language === "hu" ? ("Email cím") : ("Email address")} />
                        <TextField variant="filled" style={{ margin: "10px" }}
                            value={logindata.password} fullWidth type="password" name="password"
                            onChange={(e) => setlogindata({ ...logindata, password: e.target.value })} label={language === "hu" ? ("Jelszó") : ("Password")} />
                    </form>
                </DialogContent>
                <div className={"login__googlelogindiv"}>
                    <Tooltip arrow title={language === "hu" ? ("Bejelentkezés Google-vel") : ("Sign in with Google")}>
                        <img alt="googleicon" onClick={signinwithgoogle} src="/googleicon.png" />
                    </Tooltip>
                </div>

                <DialogActions>
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setopen(false)}>{language === "hu" ? ("Mégse") : ("Cancel")}</Button>
                    <Button onClick={signin} style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                    >{language === "hu" ? ("Mehet") : ("Let's go")}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Login

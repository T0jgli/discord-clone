import React, { useEffect, useState } from 'react'
import "./Login.css"
import { selectlanguage } from "../../features/AppSlice"
import { useSelector } from 'react-redux'

import { SnackbarContent, Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField } from '@material-ui/core'

import Snackbar from '@material-ui/core/Snackbar';
import Giphy from "react-hooks-giphy";

import { auth, googleprovider } from "../../firebase/firebase"
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Snackbars from '../Snackbars'

function Login({ getCookie, setCookie, settoast }) {
    const [langtoast, setlangtoast] = useState(false)
    const [counter, setcounter] = useState(3)
    const [open, setopen] = useState(false)
    const [error, seterror] = useState({open: false, message: ""})
    const [logindata, setlogindata] = useState({ email: "", password: "" })
    const language = useSelector(selectlanguage)

    const signinwithgoogle = () => {
        auth.signInWithPopup(googleprovider).catch(error => alert(error.message))
        settoast(true)
    }

    const signin = () => {
        auth.signInWithEmailAndPassword(logindata.email, logindata.password).catch(error => {
            seterror({open: true, message: error.message}); setlogindata({email: "", password: ""})
        })
    }


    const counterinterval = () => {
        setInterval(() => {
            setcounter(counter => counter - 1)
        }, 1000)
    }

    useEffect(() => {
        if (counter === 0) {
            window.location.reload(false)
        }
    }, [counter])

    return (
        <>
            <div className="login">
                <div className="login__logo">
                    <img src="/dclogo.png" alt="" />
                    <div className="login__gifdiv">
                        <Giphy tag="doggy"/>
                    </div>
                </div>
                <div className="login__language">

                    <img src="/hu.png"
                        className={getCookie("language") === "hun" ? ("login__languageimg") : ("login__languageactive")}
                        onClick={() => { setCookie("language", "hun", 365); setlangtoast(true); counterinterval() }} alt="huimage" />
                    <img src="/uk.png"
                        className={getCookie("language") !== "hun" ? ("login__languageimg") : ("login__languageactive")}
                        onClick={() => { setCookie("language", "eng", 365); setlangtoast(true); counterinterval() }} alt="ukimage" />

                </div>
                <Button onClick={() => setopen(true)}>{language === "hun" ? ("Bejelentkezés") : ("Sign In")}</Button>

                <Snackbar open={langtoast} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setlangtoast(false) }}>
                    <SnackbarContent message={language === "hun" ? ("Nyelv sikeresen beállítva...") : ("Language set...")}
                        action={<Button style={{ color: "white", fontWeight: "bold" }}
                            onClick={() => { window.location.reload(false) }}>{language === "hun" ? ("Újratöltés " + counter) : ("Reload " + counter)}</Button>} />
                </Snackbar>

            </div>

            <Dialog open={open} onClose={() => setopen(false)}>
                <DialogContent>
                    <DialogTitle style={{ margin: "10px", fontWeight: "bold", fontSize: "larger" }}>
                        {language === "hun" ? ("Bejelentkezés") : ("Sign In!")}
                    </DialogTitle>
                    <ArrowDropDownIcon />
                    <form onKeyPress={(e) => {if(e.key === "Enter"){signin()}}}>
                        <TextField variant="filled" autoFocus style={{ margin: "10px" }}
                            value={logindata.email} fullWidth type="email" name="email"
                            onChange={(e) => setlogindata({ ...logindata, email: e.target.value })} label={language === "hun" ? ("Email cím") : ("Email address")} />
                        <TextField variant="filled" style={{ margin: "10px" }}
                            value={logindata.password} fullWidth type="password" name="password"
                            onChange={(e) => setlogindata({ ...logindata, password: e.target.value })} label={language === "hun" ? ("Jelszó") : ("Password")} />
                    </form>
                </DialogContent>
                    <div className="googlelogindiv">
                    <img onClick={signinwithgoogle} src="/googleicon.png"/>

                    </div>
                <DialogActions>
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => setopen(false)}>{language === "hun" ? ("Mégse") : ("Cancel")}</Button>
                    <Button onClick={signin} style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}
                    >{language === "hun" ? ("Mehet") : ("Let's go")}</Button>
                </DialogActions>
            </Dialog>
            <Snackbars loginerror={error.open} setloginerror={seterror} loginmessage={error.message}/>

        </>
    )
}

export default Login

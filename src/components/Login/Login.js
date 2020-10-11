import { Button, SnackbarContent } from '@material-ui/core'
import { auth, googleprovider } from "../../firebase/firebase"
import React, { useEffect, useState } from 'react'
import "./Login.css"
import Snackbar from '@material-ui/core/Snackbar';

function Login({ getCookie, setCookie, language, settoast }) {
    const signin = () => {
        auth.signInWithPopup(googleprovider).catch(error => alert(error.message))
        settoast(true)
    }

    const [langtoast, setlangtoast] = useState(false)
    const [counter, setcounter] = useState(3)

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
        <div className="login">
            <div className="login__logo">
                <img src="/dclogo.png" alt="" />
            </div>
            <div className="login__language">

                <img src="/hu.png"
                    className={getCookie("language") === "hun" ? ("login__languageimg") : ("login__languageactive")}
                    onClick={() => { setCookie("language", "hun", 365); setlangtoast(true); counterinterval() }} alt="huimage"/>
                <img src="/uk.png"
                    className={getCookie("language") !== "hun" ? ("login__languageimg") : ("login__languageactive")}
                    onClick={() => { setCookie("language", "eng", 365); setlangtoast(true); counterinterval() }} alt="ukimage"/>

            </div>
            <Button onClick={signin}>{language === "hun" ? ("Bejelentkezés") : ("Sign In")}</Button>

            {langtoast && (
                <Snackbar open={langtoast} onClose={(event, reason) => { if (reason === "clickaway") { return; }; setlangtoast(false) }}>
                    <SnackbarContent message={language === "hun" ? ("Nyelv sikeresen beállítva") : ("Language set")}
                        action={<Button style={{ color: "white", fontWeight: "bold" }}
                            onClick={() => { window.location.reload(false) }}>{language === "hun" ? ("Újratöltés " + counter) : ("Reload " + counter)}</Button>} />
                </Snackbar>)}

        </div>
    )
}

export default Login

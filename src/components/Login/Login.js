import React, { useState } from "react";
import { selectlanguage, setlanguage, setsnackbar } from "../../lib/redux/AppSlice";
import { useDispatch, useSelector } from "react-redux";

import { SnackbarContent, Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField, Tooltip, Grow } from "@mui/material";

import Snackbar from "@mui/material/Snackbar";

import { auth, googleprovider } from "../../lib/firebase";
import { MdArrowDropDown } from "react-icons/md";
import useNewGif from "../../lib/hooks/useNewGif";
import { motion } from "framer-motion";
import { loginLogo, loginLanguageAnimation } from "../Animation";
import { FaGithub } from "react-icons/fa";

import { selectUser } from "../../lib/redux/userSlice";

const initialRegData = {
    email: "",
    password: "",
    confirmpassword: "",
    displayname: "",
};

const Login = () => {
    const dispatch = useDispatch();
    const gif = useNewGif("funny dog");
    const language = useSelector(selectlanguage);
    const user = useSelector(selectUser);

    const [langtoast, setlangtoast] = useState(false);
    const [open, setopen] = useState(false);
    const [regopen, setregopen] = useState(false);

    const [logindata, setlogindata] = useState({ email: "", password: "" });
    const [regdata, setregdata] = useState(initialRegData);

    const signinwithgoogle = async () => {
        try {
            await auth.signInWithPopup(googleprovider);
            dispatch(
                setsnackbar({
                    snackbar: {
                        open: true,
                        type: "success",
                        hu: "Sikeres bejelentkezés!",
                        en: "Successful login!",
                    },
                })
            );
        } catch (error) {
            dispatch(
                setsnackbar({
                    snackbar: {
                        open: true,
                        type: "error",
                        hu: error.message,
                        en: error.message,
                    },
                })
            );
        }
    };

    const signin = () => {
        auth.signInWithEmailAndPassword(logindata.email, logindata.password)
            .then((u) => {
                if (!u.user.emailVerified)
                    return dispatch(
                        setsnackbar({
                            snackbar: {
                                open: true,
                                type: "error",
                                hu: "Előbb erősítsd meg az email címed!",
                                en: "Előbb erősítsd meg az email címed!",
                            },
                        })
                    );
                setlogindata({ email: "", password: "" });

                if (u.user.emailVerified && !user) window.location.reload(false);
            })
            .catch((error) => {
                dispatch(
                    setsnackbar({
                        snackbar: {
                            open: true,
                            type: "error",
                            hu: error.message,
                            en: error.message,
                        },
                    })
                );
            });
    };

    const register = async () => {
        try {
            if (regdata.confirmpassword !== regdata.password)
                return dispatch(
                    setsnackbar({
                        snackbar: {
                            open: true,
                            type: "error",
                            hu: "A jelszavak nem egyeznek!",
                            en: "The passwords does not match!",
                        },
                    })
                );

            const u = await auth.createUserWithEmailAndPassword(regdata.email, regdata.password);
            if (regdata.displayname)
                await u.user.updateProfile({
                    displayName: regdata.displayname,
                });
            await u.user.sendEmailVerification();
        } catch (error) {
            dispatch(
                setsnackbar({
                    snackbar: {
                        open: true,
                        type: "error",
                        hu: error.message,
                        en: error.message,
                    },
                })
            );
        }
    };

    return (
        <>
            <div className="login">
                <motion.div variants={loginLogo} initial="initial" animate="animate" className="login__logo">
                    <img src="/img/dclogo.png" alt="" />
                </motion.div>
                <div className="loginlogo__gifdiv">
                    <div className="gif">
                        <Grow in={Boolean(gif)}>
                            <img src={gif?.data.images.downsized.url} alt="Gif" />
                        </Grow>
                    </div>
                </div>
                <div className="login__buttons">
                    <Button onClick={() => setopen(true)}>{language === "hu" ? "Bejelentkezés" : "Sign In"}</Button>
                    {/*                     <Button onClick={() => setregopen(true)}>{language === "hu" ? "Regisztráció" : "Registration"}</Button>
                     */}{" "}
                </div>

                <Snackbar
                    open={langtoast}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    autoHideDuration={3000}
                    onClose={(event, reason) => {
                        if (reason === "clickaway") {
                            return;
                        }
                        setlangtoast(false);
                    }}
                >
                    <SnackbarContent message={language === "hu" ? "Nyelv sikeresen beállítva" : "Language set"} />
                </Snackbar>
            </div>

            <div className="login__language">
                <motion.img
                    variants={loginLanguageAnimation}
                    initial="initialHu"
                    animate="animate"
                    src="/img/hu.svg"
                    className={language === "hu" ? "login__language__languageactive huicon" : "huicon"}
                    onClick={() => {
                        if (language === "en") {
                            localStorage.removeItem("language");
                            setlangtoast(true);
                            dispatch(
                                setlanguage({
                                    language: "hu",
                                })
                            );
                        }
                    }}
                    alt="huimage"
                />
                <motion.img
                    variants={loginLanguageAnimation}
                    initial="initialEn"
                    animate="animate"
                    src="/img/uk.svg"
                    className={language !== "hu" ? "login__language__languageactive enicon" : "enicon"}
                    onClick={() => {
                        if (language === "hu") {
                            localStorage.setItem("language", "en", 365);
                            setlangtoast(true);
                            dispatch(
                                setlanguage({
                                    language: "en",
                                })
                            );
                        }
                    }}
                    alt="ukimage"
                />
            </div>

            <div className="login__githublink">
                <a href="https://github.com/T0jgli/discord-clone" rel="noopener noreferrer" target="_blank">
                    GitHub
                    <FaGithub fontSize="small" />
                </a>
            </div>

            <Dialog open={open} onClose={() => setopen(false)}>
                <DialogContent>
                    <DialogTitle style={{ margin: "10px", fontWeight: "bold", fontSize: "larger" }}>
                        {language === "hu" ? "Bejelentkezés" : "Sign In!"}
                    </DialogTitle>
                    <MdArrowDropDown />
                    <form
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                signin();
                            }
                        }}
                    >
                        <TextField
                            variant="filled"
                            autoFocus
                            style={{ margin: "10px" }}
                            value={logindata.email}
                            fullWidth
                            type="email"
                            name="email"
                            onChange={(e) => setlogindata({ ...logindata, email: e.target.value })}
                            label={language === "hu" ? "Email cím" : "Email address"}
                        />
                        <TextField
                            variant="filled"
                            style={{ margin: "10px" }}
                            value={logindata.password}
                            fullWidth
                            type="password"
                            name="password"
                            onChange={(e) => setlogindata({ ...logindata, password: e.target.value })}
                            label={language === "hu" ? "Jelszó" : "Password"}
                        />
                    </form>
                </DialogContent>
                <div className={"login__googlelogindiv"}>
                    <Tooltip arrow title={language === "hu" ? "Bejelentkezés Google-vel" : "Sign in with Google"}>
                        <img alt="googleicon" onClick={signinwithgoogle} src="/img/googleicon.png" />
                    </Tooltip>
                </div>

                <DialogActions>
                    <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }} onClick={() => setopen(false)}>
                        {language === "hu" ? "Mégse" : "Cancel"}
                    </Button>
                    <Button onClick={signin} style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}>
                        {language === "hu" ? "Mehet" : "Let's go"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={regopen} onClose={() => setregopen(false)}>
                <DialogContent>
                    <DialogTitle style={{ margin: "10px", fontWeight: "bold", fontSize: "larger" }}>
                        {language === "hu" ? "Regisztráció" : "Registration!"}
                    </DialogTitle>
                    <MdArrowDropDown />
                    <form
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                register();
                            }
                        }}
                        style={{ margin: "2rem auto" }}
                    >
                        <TextField
                            variant="filled"
                            autoFocus
                            required
                            style={{ margin: "15px" }}
                            value={regdata.displayname}
                            type="name"
                            name="name"
                            onChange={(e) => setregdata({ ...regdata, displayname: e.target.value })}
                            label={language === "hu" ? "Felhasználónév" : "Username"}
                        />

                        <TextField
                            variant="filled"
                            autoFocus
                            required
                            style={{ margin: "15px" }}
                            value={regdata.email}
                            type="email"
                            name="email"
                            onChange={(e) => setregdata({ ...regdata, email: e.target.value })}
                            label={language === "hu" ? "Email cím" : "Email address"}
                        />
                        <TextField
                            variant="filled"
                            style={{ margin: "15px" }}
                            value={regdata.password}
                            required
                            type="password"
                            name="password"
                            onChange={(e) => setregdata({ ...regdata, password: e.target.value })}
                            label={language === "hu" ? "Jelszó" : "Password"}
                        />
                        <TextField
                            variant="filled"
                            style={{ margin: "15px" }}
                            required
                            value={regdata.confirmpassword}
                            type="password"
                            name="confirm password"
                            onChange={(e) => setregdata({ ...regdata, confirmpassword: e.target.value })}
                            label={language === "hu" ? "Jelszó megerősítése" : "Confirm password"}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                        style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }}
                        onClick={() => {
                            setregopen(false);
                            setregdata(initialRegData);
                        }}
                    >
                        {language === "hu" ? "Mégse" : "Cancel"}
                    </Button>
                    <Button onClick={register} style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }}>
                        {language === "hu" ? "Regisztáció" : "Let's go"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Login;

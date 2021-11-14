import React, { useRef, useState } from "react";
import { MdLock } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";
import { MdAddCircle } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    TextField,
    Switch,
    FormControlLabel,
    Paper,
    Tabs,
    Tab,
    IconButton,
    Tooltip,
    Grow,
} from "@mui/material";
import { a11yProps, TabPanel } from "../../lib/helpers/Tabhelper";
import { useDispatch, useSelector } from "react-redux";
import { selectlanguage, setsnackbar } from "../../lib/redux/AppSlice";
import { MdArrowDropDown } from "react-icons/md";
import { selectUser } from "../../lib/redux/userSlice";
import { MdDelete } from "react-icons/md";
import db from "../../lib/firebase";
import firebase from "firebase/app";
import { MdPeople } from "react-icons/md";
import { MdPerson } from "react-icons/md";

const CategorieDialog = ({ categoriemenu, confirmprompt, setconfirmprompt, categories, setcategoriemenu }) => {
    const dispatch = useDispatch();
    const language = useSelector(selectlanguage);
    const user = useSelector(selectUser);

    const [tab, settab] = useState(0);
    const [categoriename, setcategoriename] = useState("");

    const [categorieprivate, setcategorieprivate] = useState(false);
    const tabAction = useRef(null);

    const handleaddcategorie = () => {
        if (tab === 0)
            if (categoriename) {
                let ref = db.collection("categories").doc();
                ref.set({
                    id: ref.id,
                    categoriename: categoriename,
                    created: firebase.firestore.FieldValue.serverTimestamp(),
                    createdby: user.uid,
                    private: categorieprivate,
                });
                dispatch(
                    setsnackbar({
                        snackbar: {
                            open: true,
                            type: "success",
                            hu: "Kategória létrehozva!",
                            en: "Categorie created!",
                        },
                    })
                );
            } else {
                dispatch(
                    setsnackbar({
                        snackbar: {
                            open: true,
                            type: "error",
                            hu: "Azért ehhez meg kéne adni egy nevet is!",
                            en: "I think you should write a name first!",
                        },
                    })
                );
            }
        setcategoriemenu(false);
        setcategoriename("");
    };

    const handleeditcategoriename = (e, id) => {
        db.collection("categories")
            .doc(id)
            .update({
                categoriename: e.target.value.replace(/\s\s+/g, " "),
            });
    };

    const handlecategorieprivate = async (what, id) => {
        try {
            await db
                .collection("categories")
                .doc(id)
                .update({
                    private: what === "public" ? false : true,
                });

            dispatch(
                setsnackbar({
                    snackbar: {
                        open: true,
                        type: "info",
                        hu: what === "public" ? "A kategória mostantól publikus!" : "A kategória mostantól privát!",
                        en: `Categorie successfully set to ${what}!`,
                    },
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    const deletecategorie = (id) => {
        db.collection("categories")
            .doc(id)
            .collection("channels")
            .get()
            .then((data) => {
                if (data.docs.length > 0) {
                    return dispatch(
                        setsnackbar({
                            snackbar: {
                                open: true,
                                type: "error",
                                hu: "Kategória nem üres, előbb töröld a csatornáit!",
                                en: "Categorie is not empty, first delete the channels!",
                            },
                        })
                    );
                }

                db.collection("categories")
                    .doc(id)
                    .delete()
                    .then(() => {
                        dispatch(
                            setsnackbar({
                                snackbar: {
                                    open: true,
                                    type: "warning",
                                    hu: "Kategória sikeresen törölve!",
                                    en: "Categorie deleted!",
                                },
                            })
                        );
                    });
            });
        setconfirmprompt({ ...confirmprompt, open: false });
        setcategoriemenu(false);
    };

    const handleEditChannelCreation = async (what, id, privateC) => {
        if (privateC)
            return dispatch(
                setsnackbar({
                    snackbar: {
                        open: true,
                        type: "info",
                        hu: "Privát kategóriánál tök mindegy ki hozhat létre csatornát tesó!",
                        en: "If the category is private, it doesn't matter who can create channel!",
                    },
                })
            );

        try {
            await db
                .collection("categories")
                .doc(id)
                .update({
                    onlyMeCanCreateChannel: what === "public" ? false : true,
                });

            dispatch(
                setsnackbar({
                    snackbar: {
                        open: true,
                        type: "info",
                        hu:
                            what === "public"
                                ? "A kategóriában mostantól mások is tudnak szobát létrehozni!"
                                : "A kategóriában mostantól csak te tudsz szobát létrehozni!",
                        en:
                            what === "public"
                                ? "From now on, others as well can create rooms in this category!"
                                : "From now on, only you can create room in this category!",
                    },
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    let vane = false;

    return (
        <Dialog
            TransitionProps={{
                onEntered: () => {
                    if (tabAction.current) {
                        tabAction.current.updateIndicator();
                    }
                },
            }}
            TransitionComponent={Grow}
            open={categoriemenu}
            onClose={() => setcategoriemenu(false)}
        >
            <DialogContent>
                <Paper>
                    <Tabs action={tabAction} variant="fullWidth" value={tab} onChange={(e, val) => settab(val)} aria-label="simple tabs example">
                        <Tab icon={<MdAddCircle />} label={language === "hu" ? "Létrehozás" : "Create"} {...a11yProps(0)} />
                        <Tab icon={<MdModeEdit />} label={language === "hu" ? "Szerkesztés" : "Edit"} {...a11yProps(1)} />
                    </Tabs>
                </Paper>
            </DialogContent>
            <TabPanel value={tab} index={0}>
                <DialogTitle style={{ margin: "5px" }}>{language === "hu" ? "Kategória létrehozása" : "Create a channel categorie"}</DialogTitle>
                <MdArrowDropDown />
                <form
                    style={{ margin: "10px" }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleaddcategorie(categoriename);
                    }}
                >
                    <TextField
                        variant="filled"
                        autoFocus={window.innerWidth < 768 ? false : true}
                        value={categoriename}
                        fullWidth
                        onChange={(e) => setcategoriename(e.target.value)}
                        label={language === "hu" ? "Név" : "Name"}
                    />
                    <FormControlLabel
                        style={{ marginTop: "15px", fontWeight: "bold" }}
                        control={<Switch color="primary" checked={categorieprivate} onChange={() => setcategorieprivate(!categorieprivate)} />}
                        label={language === "hu" ? "Privát" : "Private"}
                    />
                </form>
            </TabPanel>

            <TabPanel value={tab} index={1}>
                <DialogTitle style={{ margin: "5px" }}>{language === "hu" ? "Kategóriák szerkesztése" : "Edit categories"}</DialogTitle>
                <MdArrowDropDown />
                {categories.map((categorie, index) => {
                    const { id: idC, categoriename: cName, createdby, private: privateC, onlyMeCanCreateChannel } = categorie?.categorie || {};
                    if (idC && user.uid === createdby) {
                        vane = true;
                        return (
                            <form
                                key={idC}
                                style={{ margin: "10px" }}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleaddcategorie();
                                }}
                            >
                                <div
                                    style={{
                                        margin: "10px 0 10px 0",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <IconButton
                                        onClick={() => {
                                            if (onlyMeCanCreateChannel) handleEditChannelCreation("public", idC, privateC);
                                            else handleEditChannelCreation("private", idC, privateC);
                                        }}
                                        style={{ color: "white", opacity: "0.5" }}
                                    >
                                        {onlyMeCanCreateChannel ? <MdLock /> : <MdLockOpen />}
                                    </IconButton>

                                    <Tooltip
                                        placement="left"
                                        title={language === "hu" ? (privateC ? "Privát" : "Publikus") : privateC ? "Private" : "Public"}
                                    >
                                        <IconButton
                                            onClick={() => {
                                                if (privateC) handlecategorieprivate("public", idC);
                                                else handlecategorieprivate("private", idC);
                                            }}
                                            style={{ color: "white", opacity: "0.5" }}
                                        >
                                            {privateC ? <MdPerson /> : <MdPeople />}
                                        </IconButton>
                                    </Tooltip>

                                    <TextField label="" variant="filled" value={cName} onChange={(e) => handleeditcategoriename(e, idC)} />
                                    <Tooltip placement="right" title={language === "hu" ? "Törlés" : "Delete"}>
                                        <IconButton
                                            style={{ color: "gray" }}
                                            onClick={() => {
                                                setconfirmprompt({
                                                    en: "Are you sure you want to delete this category?",
                                                    hu: "Biztosan törlöd a kategóriát?",
                                                    open: true,
                                                    enter: () => deletecategorie(idC),
                                                });
                                            }}
                                        >
                                            <MdDelete />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </form>
                        );
                    } else if (index + 1 === categories.length && !vane)
                        return (
                            <p key="notfound" style={{ opacity: "0.5" }}>
                                Nincs általad létrehozott kategória
                            </p>
                        );
                    else return null;
                })}
            </TabPanel>

            <DialogActions>
                <Button style={{ color: "rgb(255, 255, 255, 0.5)", fontWeight: "bolder" }} onClick={() => setcategoriemenu(false)}>
                    {language === "hu" ? "Mégse" : "Cancel"}
                </Button>
                <Button style={{ color: "rgb(255, 255, 255, 1)", fontWeight: "bolder" }} onClick={() => handleaddcategorie(categoriename)}>
                    {tab === 0 ? (language === "hu" ? "Létrehoz" : "Create") : language === "hu" ? "Kész" : "Done"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategorieDialog;

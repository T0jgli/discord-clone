import React, { useEffect, useState } from "react";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SettingsIcon from "@material-ui/icons/Settings";
import { Avatar, LinearProgress } from "@material-ui/core";
import { selectUser } from "../../lib/redux/userSlice";
import { selectsidebarmobile } from "../../lib/redux/AppSlice";
import { useDispatch, useSelector } from "react-redux";
import db from "../../lib/firebase";
import { Scrollbars } from "react-custom-scrollbars";

import Userdialog from "../Dialogs/UserDialog";
import SidebarCategories from "./SidebarCategories";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import Navbar from "./Navbar";
import CategorieDialog from "../Dialogs/CategorieDialog";
import SettingsDialog from "../Dialogs/SettingsDialog";

const Sidebar = () => {
    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const sidebarmobile = useSelector(selectsidebarmobile);

    const [categoriemenu, setcategoriemenu] = useState(false);
    const [settingsdialog, setsettingsdialog] = useState(false);
    const [confirmprompt, setconfirmprompt] = useState({
        en: null,
        hu: null,
        open: false,
        enter: null,
    });

    const [mobile, setmobile] = useState(window.innerWidth < 768);
    const [categories, setcategories] = useState([]);
    const [menu, setmenu] = useState(null);
    const [dialog, setdialog] = useState({
        open: false,
    });

    useEffect(() => {
        const cleanup = db
            .collection("categories")
            .orderBy("created", "asc")
            .onSnapshot((snapshot) => {
                setcategories(
                    snapshot.docs.map((doc) => {
                        if (doc.data().private === true) {
                            if (doc.data().createdby === user.uid) {
                                return {
                                    id: doc.id,
                                    categorie: doc.data(),
                                };
                            } else return null;
                        } else {
                            return {
                                id: doc.id,
                                categorie: doc.data(),
                            };
                        }
                    })
                );
            });
        return () => cleanup();
    }, [dispatch, user.uid]);

    useEffect(() => {
        const resize = () => {
            if (window.innerWidth < 768 && !mobile) setmobile(true);
            else if (mobile) setmobile(false);
        };
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <>
            <div className={`${mobile && sidebarmobile ? "sidebar__mobile" : "sidebar__mobileopen"} sidebar`}>
                <div
                    className="sidebar__top"
                    onClick={(e) => {
                        if (Boolean(menu)) setmenu(null);
                        else setmenu(e.currentTarget);
                    }}
                >
                    <h3 style={{ cursor: "pointer" }}>Discord CLoNe by tojglEE</h3>
                    <ExpandMoreIcon className={Boolean(menu) ? "sidebar__menuiconshowed sidebar__menuicon" : "sidebar__menuicon"} />
                    <Navbar menu={menu} setmenu={setmenu} setcategoriemenu={setcategoriemenu} />
                </div>
                <div className="sidebar__channels">
                    <Scrollbars
                        autoHide
                        autoHideDuration={5000}
                        renderThumbVertical={() => <div style={{ backgroundColor: "#212121", borderRadius: "5px" }} />}
                    >
                        {categories.length > 0 ? (
                            categories
                                .filter((c) => c)
                                .map(({ id: idC, categorie: categorieC }) => {
                                    return <SidebarCategories categorieid={idC} key={idC} categorie={categorieC} />;
                                })
                        ) : (
                            <div className="sidebar__channels__loading">
                                <LinearProgress color="primary" />
                            </div>
                        )}
                    </Scrollbars>
                </div>
                <div className="sidebar__profile">
                    <Avatar
                        src={user.photo}
                        onClick={() =>
                            setdialog({
                                open: true,
                                user: user,
                            })
                        }
                        alt="Avatar picture"
                    />
                    <div className="sidebar__profileinfo">
                        <h3
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                setdialog({
                                    open: true,
                                    user: user,
                                })
                            }
                        >
                            {user.displayname}
                        </h3>
                        <p>#{user.uid.substring(0, 5)}</p>
                    </div>
                    <div className="sidebar__profileicons">
                        <SettingsIcon onClick={() => setsettingsdialog(true)} />
                    </div>
                </div>
            </div>

            <SettingsDialog setconfirmprompt={setconfirmprompt} settingsdialog={settingsdialog} setsettingsdialog={setsettingsdialog} />

            <CategorieDialog
                categoriemenu={categoriemenu}
                setcategoriemenu={setcategoriemenu}
                categories={categories}
                confirmprompt={confirmprompt}
                setconfirmprompt={setconfirmprompt}
            />

            <ConfirmDialog confirmprompt={confirmprompt} setconfirmprompt={setconfirmprompt} />

            <Userdialog sidebar={true} dialog={dialog} setdialog={setdialog} avatar={true} />
        </>
    );
};

export default Sidebar;

import { LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { useDispatch, useSelector } from "react-redux";
import db from "../../lib/firebase";
import { selectlanguage, selectsidebarmobileright, setsidebarmobileright } from "../../lib/redux/AppSlice";
import Userdialog from "../Dialogs/UserDialog";
import CustomAvatar from "../Misc/CustomAvatar";
import PeopleIcon from "@material-ui/icons/People";
const Users = () => {
    const dispatch = useDispatch();
    const language = useSelector(selectlanguage);
    const sidebarmobileright = useSelector(selectsidebarmobileright);
    const [mobile, setmobile] = useState(window.innerWidth < 768);

    const [users, setusers] = useState([]);
    const [dialog, setdialog] = useState({
        open: false,
        user: null,
    });

    useEffect(() => {
        const cleanup = db
            .collection("users")
            .orderBy("lastlogin", "desc")
            .onSnapshot((snapshot) => {
                setusers(
                    snapshot.docs.map((snap) => ({
                        ...snap.data(),
                        uid: snap.id,
                    }))
                );
            });

        return () => cleanup();
    }, []);

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
            <div className={`${mobile && sidebarmobileright ? "sidebar-right__mobile" : "sidebar-right__mobileopen"} rightsidebar`}>
                <div className="rightsidebar__top">
                    <h3>{language === "en" ? "Users" : "Felhasználók"}</h3>
                    <PeopleIcon style={{ paddingLeft: "10px", cursor: "default" }} />
                </div>
                {users.length > 0 ? (
                    <div className="users">
                        <Scrollbars
                            autoHide
                            autoHideDuration={5000}
                            renderThumbVertical={() => <div style={{ backgroundColor: "#212121", borderRadius: "5px" }} />}
                        >
                            {users?.map((user, i) => (
                                <div
                                    className="userdialog__div"
                                    key={i}
                                    onClick={() => {
                                        setdialog({
                                            open: true,
                                            user: {
                                                ...user,
                                            },
                                        });
                                        dispatch(
                                            setsidebarmobileright({
                                                sidebarmobileright: true,
                                            })
                                        );
                                    }}
                                >
                                    <div className="userdialog__avatar">
                                        <CustomAvatar thisUser={user} src={user.photoUrl} alt="photo" />
                                    </div>
                                    <div className="userdialog__text">
                                        <p
                                            style={{
                                                opacity: "0.8",
                                                cursor: "default",
                                                color: "whitesmoke",
                                            }}
                                        >
                                            {user.newusername || user.displayname}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </Scrollbars>
                    </div>
                ) : (
                    <div className="sidebar__channels__loading">
                        <LinearProgress color="primary" />
                    </div>
                )}
            </div>
            <Userdialog avatar setdialog={setdialog} dialog={dialog} />
        </>
    );
};

export default Users;

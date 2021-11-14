import React, { useEffect, useState } from "react";

import { MdExpandMore } from "react-icons/md";
import { MdAdd } from "react-icons/md";

import db from "../../lib/firebase";
import SideBarChannel from "./SideBarChannel";
import CreatechannelDialog from "../Dialogs/CreatechannelDialog";
import { selectUser } from "../../lib/redux/userSlice";
import { useSelector } from "react-redux";

const hiddencategories = JSON.parse(localStorage.getItem("hiddenCategories"));

const SidebarCategories = ({ categorie, categorieid }) => {
    const [channels, setchannel] = useState([]);
    const user = useSelector(selectUser);
    const [promptstate, setpromptstate] = useState(false);
    const [hide, sethide] = useState(hiddencategories ? (hiddencategories.includes(categorieid) ? true : false) : false);

    useEffect(() => {
        const cleanup = db
            .collection("categories")
            .doc(categorieid)
            .collection("channels")
            .orderBy("created", "asc")
            .onSnapshot((snapshot) =>
                setchannel(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        channel: doc.data(),
                    }))
                )
            );
        return () => cleanup();
    }, [categorieid]);

    const hideCategorie = () => {
        sethide(!hide);
        if (!hide)
            if (hiddencategories) localStorage.setItem("hiddenCategories", JSON.stringify([...hiddencategories, categorieid]));
            else localStorage.setItem("hiddenCategories", JSON.stringify([categorieid]));
        else localStorage.setItem("hiddenCategories", JSON.stringify(hiddencategories.filter((e) => e !== categorieid)));
    };

    return (
        <>
            <div className="sidebar__channelsheader">
                <div className="sidebar__header" onClick={hideCategorie}>
                    <MdExpandMore className={hide ? "sidebar__categorieiconshowed sidebar__MdMenu" : "sidebar__menucion"} />
                    <h5>{categorie.categoriename}</h5>
                </div>
                {!categorie.onlyMeCanCreateChannel ? (
                    <MdAdd onClick={() => setpromptstate(true)} />
                ) : (
                    categorie.createdby === user.uid && <MdAdd onClick={() => setpromptstate(true)} />
                )}
            </div>
            <div className="sidebar__channelslist">
                {!hide && channels.map(({ id, channel }) => <SideBarChannel channel={channel} categorieid={categorieid} key={id} id={id} />)}
            </div>

            <CreatechannelDialog
                createdby={categorie.createdby}
                onlyMeCanCreateChannel={categorie.onlyMeCanCreateChannel}
                categorieid={categorieid}
                promptstate={promptstate}
                setpromptstate={setpromptstate}
            />
        </>
    );
};

export default SidebarCategories;

import React, { useEffect, useState } from 'react'

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import AddIcon from "@material-ui/icons/Add"

import db from '../../lib/firebase';
import SideBarChannel from './SideBarChannel';
import CreatechannelDialog from '../Dialogs/CreatechannelDialog';

const hiddencategories = JSON.parse(localStorage.getItem("hiddenCategories"))

const SidebarCategories = ({ categorie, categorieid, categories }) => {
    const [channels, setchannel] = useState([])
    const [promptstate, setpromptstate] = useState(false)
    const [hide, sethide] = useState(hiddencategories ? hiddencategories.includes(categorieid) ? true : false : false)

    useEffect(() => {
        const cleanup = db.collection("categories").doc(categorieid).collection("channels").orderBy("created", "asc").onSnapshot((snapshot) =>
            setchannel(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    channel: doc.data(),
                }))
            )
        )
        return () => cleanup()
    }, [categorieid])

    return (
        <>
            <div className="sidebar__channelsheader">
                <div className="sidebar__header" onClick={() => {
                    sethide(!hide);
                    if (!hide)
                        if (hiddencategories)
                            localStorage.setItem("hiddenCategories", JSON.stringify([
                                ...hiddencategories, categorieid
                            ]))
                        else
                            localStorage.setItem("hiddenCategories", JSON.stringify([
                                categorieid
                            ]))
                    else
                        localStorage.setItem("hiddenCategories", JSON.stringify(hiddencategories.filter(e => e !== categorieid)))

                }}>
                    <ExpandMoreIcon className={hide ? ("sidebar__categorieiconshowed sidebar__menuicon") : ("sidebar__menucion")} />
                    <h5>{categorie.categoriename}</h5>
                </div>
                <AddIcon onClick={() => setpromptstate(true)} />
            </div>
            <div className="sidebar__channelslist">
                {!hide && channels.map(({ id, channel }) => (
                    <SideBarChannel categories={categories} channel={channel} categorieid={categorieid} key={id} id={id} />
                ))}
            </div>


            <CreatechannelDialog categorieid={categorieid} promptstate={promptstate} setpromptstate={setpromptstate} />


        </>
    )
}

export default SidebarCategories

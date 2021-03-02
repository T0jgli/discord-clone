import React, { useEffect, useState } from 'react'

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import AddIcon from "@material-ui/icons/Add"

import db from '../../lib/firebase';
import SideBarChannel from './SideBarChannel';
import CreatechannelDialog from '../Dialogs/CreatechannelDialog';
import { selectUser } from '../../lib/userSlice';
import { useSelector } from 'react-redux';

const hiddencategories = JSON.parse(localStorage.getItem("hiddenCategories"))

const SidebarCategories = ({ categorie, categorieid }) => {
    const [channels, setchannel] = useState([])
    const user = useSelector(selectUser)
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
                {!categorie.onlyMeCanCreateChannel ? (
                    <AddIcon onClick={() => setpromptstate(true)} />
                ) : categorie.createdby === user.uid && (
                    <AddIcon onClick={() => setpromptstate(true)} />
                )}

            </div>
            <div className="sidebar__channelslist">
                {!hide && channels.map(({ id, channel }) => (
                    <SideBarChannel channel={channel} categorieid={categorieid} key={id} id={id} />
                ))}
            </div>


            <CreatechannelDialog createdby={categorie.createdby} onlyMeCanCreateChannel={categorie.onlyMeCanCreateChannel}
                categorieid={categorieid} promptstate={promptstate} setpromptstate={setpromptstate} />


        </>
    )
}

export default SidebarCategories

import React from "react";
import "emoji-mart/css/emoji-mart.css";

import { Picker } from "emoji-mart";
import { selectlanguage } from "../../lib/redux/AppSlice";
import { useSelector } from "react-redux";
import { Grow } from "@mui/material";
import { MdClose } from "react-icons/md";

const HungarianLang = {
    search: "Keresés",
    clear: "Törlés",
    notfound: "Nincs ilyen emoji",
    skintext: "Válaszd ki a neked megfelelő bőrszínt",
    categories: {
        search: "Keresés eredménye",
        recent: "Gyakran használt",
        smileys: "Mosoly & Érzelmek",
        people: "Arcok & Emberek",
        nature: "Állatok & Természet",
        foods: "Étel & Ital",
        activity: "Aktivitás",
        places: "Utazás & Helyek",
        objects: "Tárgyak",
        symbols: "Szimbólumok",
        flags: "Zászlók",
        custom: "Egyéni",
    },
    categorieslabel: "Emoji kategóriák",
    skintones: {
        1: "Alapértelmezett bőrszín",
        2: "Világos bőrszín",
        3: "Közepesen-világos bőrszín",
        4: "Közepes bőrszín",
        5: "Közepesen-sötét bőrszín",
        6: "Sötét bőrszín",
    },
};

const Emoji = ({ input, setinput, fade, setemojidialog }) => {
    const language = useSelector(selectlanguage);
    return (
        <Grow in={fade} timeout={200}>
            <div className="emoji__div">
                <Picker
                    onSelect={(emoji) => {
                        setinput(input + emoji.native);
                    }}
                    theme="dark"
                    emoji=""
                    native
                    title=""
                    i18n={language === "hu" ? HungarianLang : {}}
                />
                <div className="close">
                    <MdClose onClick={() => setemojidialog(false)} />
                </div>
            </div>
        </Grow>
    );
};

export default Emoji;

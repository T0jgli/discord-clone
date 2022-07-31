import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { selectlanguage } from "../../lib/redux/AppSlice";
import { useSelector } from "react-redux";
import { Grow } from "@mui/material";
import { MdClose } from "react-icons/md";

const HungarianLang = {
    search: "Keresés",
    search_no_results_1: "Jaj ne!",
    search_no_results_2: "Nincs ilyen emoji",
    pick: "",
    add_custom: "Egyedi emoji",
    categories: {
        activity: "Aktivitás",
        custom: "Egyedi",
        flags: "Zászlók",
        foods: "Étel & ital",
        frequent: "Gyakran használt",
        nature: "Állatok & természet",
        objects: "Tárgyak",
        people: "Smileyk & emberek",
        places: "Utazás és helyek",
        search: "Keresés eredménye",
        symbols: "Szimbólumok",
    },
    skins: {
        choose: "Válaszd ki az alapértelmezett bőrszínt",
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
                    onEmojiSelect={(emoji) => {
                        setinput(input + emoji.native);
                    }}
                    data={data}
                    set="native"
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

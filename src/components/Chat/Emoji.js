import React from "react"
import 'emoji-mart/css/emoji-mart.css'

import { Picker } from 'emoji-mart'
import { selectlanguage } from '../../lib/AppSlice'
import { useSelector } from 'react-redux'
import { Grow } from "@material-ui/core"

const HungarianLang = {
    search: "Keresés",
    clear: "Törlés",
    notfound: "Nincs ilyen emoji",
    skintext: "Válaszd ki a neked megfelelő bőrszínt",
    categories: {
        search: 'Keresés eredménye',
        recent: 'Gyakran használt',
        smileys: 'Mosoly & Érzelmek',
        people: 'Arcok & Emberek',
        nature: 'Állatok & Természet',
        foods: 'Étel & Ital',
        activity: 'Aktivitás',
        places: 'Utazás & Helyek',
        objects: 'Tárgyak',
        symbols: 'Szimbólumok',
        flags: 'Zászlók',
        custom: 'Egyéni',
    },
    categorieslabel: 'Emoji kategóriák',
    skintones: {
        1: 'Alapértelmezett bőrszín',
        2: 'Világos bőrszín',
        3: 'Közepesen-világos bőrszín',
        4: 'Közepes bőrszín',
        5: 'Közepesen-sötét bőrszín',
        6: 'Sötét bőrszín',
    },
}

const Emoji = ({ input, setinput, fade }) => {
    const language = useSelector(selectlanguage)
    return (
        <Grow in={fade} timeout={200}>
            <Picker onSelect={(emoji) => {
                setinput(input + emoji.native)
            }} theme="dark" emoji="" native title="" i18n={language === "hu" && (HungarianLang)}
                style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: "1" }} />
        </Grow>
    )
}

export default Emoji

import { useEffect, useState } from "react";

const URL = `https://api.giphy.com/v1/gifs/random`;

const useNewGif = (tag = "") => {
    const [gif, setgif] = useState(null);
    const fetchGiphy = async () => {
        try {
            const res = await fetch(`${URL}?api_key=${process.env.REACT_APP_GIPHY_APIKEY}&tag=${tag}`, {
                method: "GET",
            });
            const data = await res.json();
            setgif(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchGiphy();
    }, []);

    return gif;
};

export default useNewGif;

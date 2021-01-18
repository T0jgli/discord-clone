import axios from 'axios'
import { useEffect, useState } from 'react'


const URL = `https://api.giphy.com/v1/gifs/random`

const useNewGif = (tag = "") => {

    const [gif, setgif] = useState(null)
    const fetchGiphy = async () => {
        try {
            const { data } = await axios.get(URL, {
                params: {
                    api_key: process.env.REACT_APP_GIPHY_APIKEY,
                    tag: tag
                }
            })
            setgif(data)

        } catch (error) {

            console.log(error)

        }
    }

    useEffect(() => {
        fetchGiphy()
    }, [])

    return gif
}

export default useNewGif

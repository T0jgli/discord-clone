import { useEffect, useState } from "react";

const useUserData = (userData) => {
    const [messageUser, setMessageUser] = useState(null);

    const getData = async () => {
        const data = await userData?.get();

        setMessageUser({
            ...data.data(),
            id: data.id,
        });
    };

    useEffect(() => {
        getData();
    }, []);

    return messageUser;
};

export default useUserData;

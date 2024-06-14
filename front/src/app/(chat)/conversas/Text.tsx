"use client"

import { useEffect, useState } from "react";
import { type Session } from "~/types/session";
import { useUserSession } from "~/utils/clientSession";


function Text() {
    const [user, setUser] = useState<Session | null>(null);
    const getUser = useUserSession();

    useEffect(() => {
        setUser(getUser);
    }, []);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <p>
                {user.profile.name}
            </p>
        </>
    );
}

export default Text;
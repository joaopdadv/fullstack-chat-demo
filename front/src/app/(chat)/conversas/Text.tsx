"use server"

import { getUserSession } from "~/utils/serverSession";


async function Text() {


    const user = getUserSession();

    return (
        <>
            <p>
                {user?.profile.name}
            </p>
        </>
    );
}

export default Text;
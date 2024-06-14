"use server"

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Text from "./Text";
import { getUserSession } from "~/utils/serverSession";


async function ConversasPage() {
    
    const user = getUserSession();

    return (
        <>
            {user?.profile.email}

                <Text></Text>
        </>
    );
}

export default ConversasPage;
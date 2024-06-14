"use server"

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getServerSession } from "next-auth";
import Text from "./Text";


async function ConversasPage() {
    
    const session = await getServerSession();

    console.log(session);

    return (
        <>
            <Text></Text>
        </>
    );
}

export default ConversasPage;
"use client"

import { useEffect, useState } from "react";

function Chat({ id }: { id: string}) {

    const [chatId, setChatId] = useState<string>('');

    useEffect(() => {
        setChatId(id);
        console.log(chatId);
    }, [chatId, setChatId, id])

    return (
        <>
            chat {chatId}
        </>
    );
}

export default Chat;
"use client"

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Chat from "./Chat";
import { useEffect, useState } from "react";
import { useUserSession } from "~/utils/clientSession";
import { type Session } from "~/types/session";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "~/components/ui/resizable"


function ConversasPage() {
    
    const [user, setUser] = useState<Session | null>(null);
    const [id, setId] = useState<string>('');
    const getUser = useUserSession();

    useEffect(() => {
        setUser(getUser);
        // console.log(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-gray-200 w-full h-full p-6">
            <div className="bg-gray-400 h-full rounded-xl">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel minSize={20}>
                        One
                    </ResizablePanel>
                    <ResizableHandle/>
                    <ResizablePanel minSize={65}>
                        <Chat id={id}/>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

export default ConversasPage;
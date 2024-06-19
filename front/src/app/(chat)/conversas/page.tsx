/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Chat from "./Chat";
import { useEffect, useState } from "react";
import { useUserSession } from "~/utils/clientSession";
import { type Profile, type Session } from "~/types/session";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "~/components/ui/resizable"
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

function ConversasPage() {
    
    const [user, setUser] = useState<Session | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<Profile | undefined>(undefined);
    const [profileList, setProfileList] = useState<Profile[]>([]);
    const getUser = useUserSession();

    useEffect(() => {
        setUser(getUser);
        
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:3001/user', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getUser?.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setProfileList(data as Profile[])
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchUser().then(() => {}).catch(() => {});

        // console.log(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-gray-200 w-full h-full p-6">
            <div className="bg-gray-400 h-full rounded-xl">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel minSize={20} defaultSize={20}>
                        <div className="flex flex-col items-center justify-start gap-4 p-4 h-full">
                            <div className="w-full">
                                <Input placeholder="Pesquisar pessoas"/>
                            </div>
                            <ScrollArea className="h-full w-full">
                                {
                                    profileList.map((e, index) => {
                                        
                                        return(
                                            <div key={index} onClick={() => setSelectedProfile(e)}>
                                                <UserCard profile={e}/>
                                            </div>
                                        )
                                    })}
                            </ScrollArea>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle/>
                    <ResizablePanel minSize={65} defaultSize={80}>
                        <Chat profile={selectedProfile}/>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

interface UserCardProps {
    profile: Profile
}

function UserCard({profile}:UserCardProps){

    return(
        <div className="flex align-top justify-items-start gap-4 bg-gray-600 p-4 mb-2 rounded text-white cursor-pointer">
            <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-green-500 w-full h-full flex items-center justify-center">{profile.name.at(0)}</AvatarFallback>
            </Avatar>
            {profile.name}
        </div>
    )
}

export default ConversasPage;
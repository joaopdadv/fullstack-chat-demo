/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Chat from "./Chat";
import { useEffect, useState, useRef } from "react";
import { useUserSession } from "~/utils/clientSession";
import { type Contact, type Session } from "~/types/session";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "~/components/ui/resizable"
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { IoSettingsOutline } from "react-icons/io5";
import io, { type Socket } from 'socket.io-client'
import { type typing } from "~/types/typing";
import { type Message } from "~/types/message";
let socket:Socket;


function ConversasPage() {
    
    const [user, setUser] = useState<Session | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<Contact | undefined>(undefined);
    const [profileList, setProfileList] = useState<Contact[]>([]);
    const [typing, setTyping] = useState<boolean>(false);
    const profileListRef = useRef<Contact[]>(profileList);
    const getUser = useUserSession();

    useEffect(() => {
        setUser(getUser);
        
        socket = io(`http://localhost:3001`, {
            query: { clientId: getUser?.profile.id, clientToken: getUser?.token },
        });

        socket.on('connect', () => {
            console.log('Connected to websocket');
        });

        socket.on('typing', (data:typing) => {
            setTyping(data.typing)
        });

        socket.on('message', (message:Message) => {
            updateLastMessage(message);
            // console.log(message, profileListRef.current);
        });

        const fetchUsers = async () => {
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
                const data = await response.json() as Contact[];
                // console.log(data);
                setProfileList(data)
                profileListRef.current = data;
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchUsers().then(() => {}).catch(() => {});

        return (()=> {
            socket.disconnect();
        })
        // console.log(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function updateLastMessage(message:Message) {
        console.log(message);

        if(profileListRef.current.length == 0){
            return
        }

        const updatedProfileArray = profileListRef.current.map((e) => {
            if(e.profile.id === message.senderId) {
                return {
                    ...e,
                    lastMessage: message.message
                };
            }
            return e;
        });

        setProfileList(updatedProfileArray);
        profileListRef.current = updatedProfileArray;
    }

    useEffect(() => {
        console.log(profileListRef.current);
    }, [profileList]);

    return (
        <div className="bg-gray-200 w-full h-full p-6 flex items-center justify-between">
            <div className="bg-gray-600 h-full w-16 flex flex-col items-center justify-between rounded-l-xl p-4 text-white">
                <div>
                    <IoSettingsOutline color="white" size={25}/>
                </div>
                <div>
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-green-500 w-full h-full flex items-center justify-center">{user?.profile.name.at(0)}</AvatarFallback>
                </Avatar>
                </div>
            </div>
            <div className="bg-gray-500 h-full w-full rounded-r-xl overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel minSize={20} defaultSize={20}>
                        <div className="flex flex-col items-center justify-start gap-4 p-4 h-full">
                            <div className="w-full">
                                <Input placeholder="Pesquisar pessoas" className="bg-gray-600 border-gray-700 text-white"/>
                            </div>
                            <ScrollArea className="h-full w-full">
                                {
                                    profileList.map((e, index) => {
                                        
                                        return(
                                            <div key={index} onClick={() => setSelectedProfile(e)}>
                                                <UserCard profile={e.profile} lastMessage={e.lastMessage}/>
                                            </div>
                                        )
                                    })}
                            </ScrollArea>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle/>
                    <ResizablePanel minSize={65} defaultSize={80}>
                        <Chat profile={selectedProfile?.profile} socket={socket} typing={typing}/>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

function UserCard({profile, lastMessage}:Contact){

    return(
        <div className="flex align-top justify-items-start gap-4 bg-gray-600 p-4 mb-2 rounded text-white cursor-pointer">
            <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-green-500 w-full h-full flex items-center justify-center">{profile.name.at(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p>
                    {profile.name}
                </p>
                <p className="text-gray-400">
                    {lastMessage}
                </p>
            </div>
        </div>
    )
}

export default ConversasPage;
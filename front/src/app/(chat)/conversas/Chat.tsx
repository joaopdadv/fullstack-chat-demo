"use client"

import { useEffect, useState } from "react";
import { AvatarFallback, AvatarImage, Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type Session, type Profile } from "~/types/session";
import io, { type Socket } from 'socket.io-client'
import { useUserSession } from "~/utils/clientSession";

let socket:Socket;

interface UserCardProps {
    profile: Profile | undefined
}

function Chat({ profile }:UserCardProps) {


    const [user, setUser] = useState<Session | null>(null);
    const [text, setText] = useState<string>('');
    const getUser = useUserSession();

    useEffect(() => {
        setUser(getUser);
        console.log(getUser?.profile.id)
        socket = io(`http://localhost:3001`, {
            query: { clientId: getUser?.profile.id, clientToken: getUser?.token },
        });

        socket.on('connect', () => {
            console.log('Connected to websocket');
        });

        socket.on('message', (message) => {
            console.log('Received message:', message);
        });

        // console.log(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile])

    function send():void {
        // if(profile?.id.trim() == '' || text.trim() == ''){
        //   return;
        // }
    
        socket.emit('message', { to: profile?.id, message: text })    
        setText('');
    }

    if(!user){
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="text-gray-500">Erro ao carregar user.</p>
            </div>
        )
    }

    if(!profile){
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="text-gray-500">Nenhuma conversa selecionada.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-between h-full w-full">
            <div className="w-full h-16 bg-gray-600 text-white flex gap-4 items-center justify-start p-4">
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-green-500 w-full h-full flex items-center justify-center">{profile.name.at(0)}</AvatarFallback>
                </Avatar>
                <p>{profile.name}</p>
            </div>
            <div>
                <ScrollArea>

                </ScrollArea>
            </div>
            <div className="w-full h-16 text-white flex gap-4 items-center justify-start p-4">
                <Input placeholder="Digite sua mensagem" value={text} onChange={(e) => setText(e.target.value)} className="text-black"/>
                <Button onClick={() => {send()}}>Enviar</Button>
            </div>
        </div>
    );
}

export default Chat;
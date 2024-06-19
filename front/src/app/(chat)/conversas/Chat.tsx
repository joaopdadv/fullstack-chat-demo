/* eslint-disable @typescript-eslint/no-empty-function */
"use client"

import { useEffect, useRef, useState } from "react";
import { AvatarFallback, AvatarImage, Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type Session, type Profile } from "~/types/session";
import io, { type Socket } from 'socket.io-client'
import { useUserSession } from "~/utils/clientSession";
import { Message } from "~/types/message";
import MessageComponent from "./MessageComponent";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "~/components/ui/sheet"

let socket:Socket;

interface UserCardProps {
    profile: Profile | undefined
}

// Profile é o user que foi aberto o chat
function Chat({ profile }:UserCardProps) {


    const chatMessageRef = useRef<HTMLDivElement | null>(null);

    const [user, setUser] = useState<Session | null>(null);
    const [text, setText] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const getUser = useUserSession(); // Pega dados do usuário logado

    useEffect(() => {
        setUser(getUser);
        socket = io(`http://localhost:3001`, {
            query: { clientId: getUser?.profile.id, clientToken: getUser?.token },
        });

        socket.on('connect', () => {
            console.log('Connected to websocket');
        });

        socket.on('message', (message:Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:3001/messages/chat/${getUser?.profile.id}/${profile?.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getUser?.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json() as Message[];
                console.log(data)
                setMessages(data);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchMessages().then(() => {}).catch(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile])

    useEffect(() => {
        if (chatMessageRef.current) {
          chatMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages])

    function send():void {
        if(!user || !profile || text.trim() == ''){
          return;
        }

        socket.emit('message', { to: profile?.id, message: text })

        const newMessage = new Message("", new Date, text, user.profile.id, profile.id);
        setMessages((prevMessages) => [...prevMessages, newMessage]);

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
            <div  className="w-full h-16 bg-gray-600 text-white flex gap-4 items-center justify-start p-4">
            <Sheet>
                <SheetTrigger>
                    <div className="w-full h-16 flex gap-4 items-center justify-start p-4">
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-green-500 w-full h-full flex items-center justify-center">{profile.name.at(0)}</AvatarFallback>
                        </Avatar>
                        <p className="hover:underline">{profile.name}</p>
                    </div>
                </SheetTrigger>
                <SheetContent>
                    Conteúdo do menu lateral
                </SheetContent>
            </Sheet>
            </div>

            <ScrollArea className="h-full w-full p-4">
                {messages.map((e:Message, index:number) => {
                return (
                    <div key={index} ref={index === messages.length - 1 ? chatMessageRef : null}>
                        <MessageComponent user={user} message={e}/>
                    </div>
                )
                })}
            </ScrollArea>
            <div className="w-full h-16 text-white flex gap-4 items-center justify-start p-4">
                <Input placeholder="Digite sua mensagem" value={text} onChange={(e) => setText(e.target.value)} className="text-black"/>
                <Button onClick={() => {send()}}>Enviar</Button>
            </div>

        </div>
    );
}

export default Chat;
"use client"

import { useEffect, useRef, useState } from "react";
import { AvatarFallback, AvatarImage, Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type Session, type Profile } from "~/types/session";
import { useUserSession } from "~/utils/clientSession";
import { Message, Visualized } from "~/types/message";
import MessageComponent from "./MessageComponent";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "~/components/ui/sheet"
import { type Socket } from "socket.io-client";
import { Status } from "~/enums/statusEnum";

// let socket:Socket;

interface ChatProps {
    profile: Profile | undefined,
    socket: Socket,
    typing: boolean
}

// Profile é o user que foi aberto o chat
function Chat({ profile, socket, typing }:ChatProps) {

    const chatMessageRef = useRef<HTMLDivElement | null>(null);

    const [user, setUser] = useState<Session | null>(null);
    const [text, setText] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const getUser = useUserSession(); // Pega dados do usuário logado

    useEffect(() => {
        setUser(getUser);

        if(socket){
            socket.on('message', (message:Message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
                socket.emit('visualized', { to: profile?.id, visualized: 2});
            });

            socket.emit('visualized', { to: profile?.id, visualized: 2});

            socket.on('visualized', (data:Visualized) => {
                console.log(data);

                setMessages((prevMessages) =>
                    prevMessages.map((e) => {
                        if(e.visualized == Status.NOT_RECEIVED && e.senderId == user?.profile.id){
                            console.log(e);
                            return {...e, visualized: data.visualized}
                        }
                        if(e.visualized == Status.RECEIVED && e.senderId == user?.profile.id){
                            return {...e, visualized: data.visualized}
                        }
                        return e;
                    })
                );
            });
        }

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
                setMessages(data);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        if(profile){
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            fetchMessages().then(() => {}).catch(() => {});
        }

        return(() => {
            if(socket){
                socket.emit('typing', { to: profile?.id, typing: false });
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile])

    useEffect(() => {
        if (chatMessageRef.current) {
          chatMessageRef.current.scrollIntoView({ behavior: 'instant' });
        }
    }, [messages])

    function send():void {
        if(!user || !profile || !socket || text.trim() == ''){
          return;
        }

        socket.emit('message', { to: profile?.id, message: text, sensible: false })

        const newMessage = new Message("", new Date, text, user.profile.id, profile.id, Status.NOT_RECEIVED);
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        setText('');
    }

    useEffect(() => {
        if(!socket){return}

        if(text == ''){
            socket.emit('typing', { to: profile?.id, typing: false });
            return;
        }

        if(text.length == 1){
            socket.emit('typing', { to: profile?.id, typing: true });
        }
    }, [text])

    if(!user){
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="text-gray-600">Erro ao carregar user.</p>
            </div>
        )
    }

    if(!profile){
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="text-gray-600">Nenhuma conversa selecionada.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-between h-full w-full bg-gray-500">
            <div  className="w-full h-16 bg-gray-600 text-white flex gap-4 items-center justify-start p-4">
            <Sheet>
                <SheetTrigger>
                    <div className="w-full h-16 flex gap-4 items-center justify-start p-4">
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-green-500 w-full h-full flex items-center justify-center">{profile.name.at(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <p className="hover:underline">{profile.name}</p>
                            {
                                typing ? <p className="text-gray-400 font-bold">Digitando...</p> : <p></p>
                            }
                        </div>
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
                <Input 
                    placeholder="Digite sua mensagem" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    className="text-black"
                />
                <Button onClick={() => {send()}}>Enviar</Button>
            </div>

        </div>
    );
}

export default Chat;
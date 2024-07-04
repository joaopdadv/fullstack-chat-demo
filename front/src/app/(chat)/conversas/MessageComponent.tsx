/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { LuCheck, LuCheckCheck } from "react-icons/lu";
import { Status } from "~/enums/statusEnum";
import { type Message } from "~/types/message";
import { type Session } from "~/types/session";

interface MessageCardProps {
    user: Session | undefined,
    message: Message
}


function MessageComponent({user, message}:MessageCardProps) {

    return (
      <div className="w-full">
        {
          message.senderId == user?.profile.id ?
          <div className="w-full flex items-center justify-between mb-2">
            <div></div>
            <div className="bg-green-300 p-4 rounded w-max max-w-xl flex gap-4 items-end">

              <div>
                <p>
                  {message.message}
                </p>
              </div>

              <div className="w-max">
                <Check visualized={message.visualized}/>
              </div>

            </div>
          </div>
          :
          <div className="bg-gray-300 p-4 rounded w-max max-w-xl mb-2">
            {message.message}
          </div>
        }
      </div>
    );
}

function Check({visualized}:any){
  if(visualized == 0){
    return <LuCheck color="grey" size={17}/>
  }
  if(visualized == 1){
    return <LuCheckCheck color="grey" size={17}/>
  }
  if(visualized == 2){
    return <LuCheckCheck color="blue" size={17}/>
  }
  return <div></div>
}

export default MessageComponent;
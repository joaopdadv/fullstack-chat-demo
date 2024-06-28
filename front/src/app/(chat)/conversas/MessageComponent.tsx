'use client'

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

              <div>
                <p>{message.visualized}</p>
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

export default MessageComponent;
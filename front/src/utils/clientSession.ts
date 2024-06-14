import { getCookie } from "cookies-next";
import { type Session } from "~/types/session";

// This is the function to access user session data in a Client Component

export function useUserSession(): Session | null {
    const cookie = getCookie("pdi_chat_user")
    if(!cookie){
        return null;
    }
    const cookieSession = JSON.parse(cookie.toString()) as Session;
    return cookieSession;
}
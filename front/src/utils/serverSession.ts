import { cookies } from 'next/headers';
import { type Session } from '~/types/session';

// This is the function to access user session data in a Server Component

export function getUserSession(): Session | null {
  const cookie = cookies().get("pdi_chat_user")
  if(!cookie){
      return null;
  }
  const cookieSession = JSON.parse(cookie.value) as Session;
  return cookieSession;
}
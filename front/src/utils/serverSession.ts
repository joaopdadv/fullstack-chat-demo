import { cookies } from 'next/headers';

// This is the function to access user session data in a Server Component

export function getUserSession(): string | null {
  const cookie = cookies().get("pdi_chat_user");
  return cookie ? cookie.value : null;
}
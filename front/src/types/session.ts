import { type Message } from "./message";

export interface Session {
    token: string;
    expirationDate: number;
    profile: Profile
}

export interface Contact{
  profile: Profile,
  lastMessage: string
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: number;
}
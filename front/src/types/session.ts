
export interface Session {
    token: string;
    expirationDate: number;
    profile: Profile
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: number;
}
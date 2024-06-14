
export interface Session {
    token: string;
    expirationDate: number;
    profile: {
      id: string;
      name: string;
      email: string;
      role: number;
    };
  }
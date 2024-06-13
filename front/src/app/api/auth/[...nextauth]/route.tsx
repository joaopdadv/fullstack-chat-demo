/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

interface User{
    token:string,
    profile:{
      id:string,
      name:string,
      role:number,
      email:string,
    }
  }

const handler = NextAuth({
    providers: [
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: { label: "Email", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {

            const { email, password } = credentials as any;

            try {
                const res = await fetch("http://localhost:3001/auth/login", {
                  method: 'POST',
                  body: JSON.stringify({email, password}),
                  headers: { "Content-Type": "application/json" }
                });

                const user = await res.json() as User;
      
                console.log(user);

                // If no error and we have user data, return it
                if (res.status == 202 && user) {
                    return { ...user.profile, token: user.token };
                }
              } catch (error) {
                console.error('Error during authorization:', error);
              }
            // Return null if user data could not be retrieved
            return null
          }
        })
    ],
    session:{
        strategy: "jwt"
    },
    pages:{
        signIn: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }
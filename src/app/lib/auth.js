import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

export const authOptions = {
  providers: [
    // Credential Provider (Custom Login)
    CredentialsProvider({
      name: "Credentials",
      
      async authorize(credentials) {
        try {
          // Call Express backend for authentication
          const response = await axios.post("http://localhost:8080/user/login", {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data.token) {
            return { 
              id: response.data.userId,
              token: response.data.token 
            };
          }
        } catch (error) {
          throw new Error(error.response?.data?.message || "Login failed");
        }
      },
    }),
 
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        // Send Google profile data to your Express backend
        try {

          console.log("profile-------->",profile);

          const response = await axios.post("http://localhost:8080/user/google-login", {
            name: profile.name,
            email: profile.email,
            picture:profile.picture,
            password:profile.sub
          });

          if (response.data.token) {
            return {
              id: response.data.userId,
              name: response.data.name,
              email: profile.email,
              token: response.data.token
            };
          }
        } catch (error) {
          throw new Error("Google login failed");
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token; 
      }
      return token;
    },
    async session({ session, token }) {
  
      session.user.id = token.id;
      session.token = token.token; // Pass token to client
      return session;
    }
  },

  session: {
    strategy: "jwt",  
  },

  secret: process.env.NEXTAUTH_SECRET,
};


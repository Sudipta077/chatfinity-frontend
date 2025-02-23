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
              token: response.data.token,
              name: response.data.name,
              email: response.data.email,
              pic: response.data.pic,

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


          const response = await axios.post("http://localhost:8080/user/google-login", {
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
            password: profile.sub,

          });

          // console.log("profile-------->", response);
          if (response.data.token) {
            return {
              id: response.data.userId,
              name: response.data.name,
              email: profile.email,
              token: response.data.token,
              pic: response.data.pic,
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
        token.name = user.name,
          token.email = user.email,
          token.pic = user.pic
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.token = token.token;
      session.user.name = token.name,
        session.user.email = token.email,
        session.user.pic = token.pic
      return session;
    }
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};


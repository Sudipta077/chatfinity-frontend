import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth"; // Adjust the path if needed

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
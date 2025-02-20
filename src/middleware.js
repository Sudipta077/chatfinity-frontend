import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt";
export async function middleware(request) {
    
    
    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    const path = request.nextUrl.pathname;

    const isPublicPath = path==='/login' || path ==='/signup';



    if(isPublicPath  && session){
        return NextResponse.redirect(new URL('/', request.url))
    }

    if(!isPublicPath && !session){
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next();

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/((?!api|_next|favicon.ico).*)',
}
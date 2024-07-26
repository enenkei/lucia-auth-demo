import { googleOAuthClient } from "@/lib/google-oauth";
import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest) {
    const url = req.nextUrl;
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if(!code || !state){
        console.error('no code or state');
        return NextResponse.json({message : 'invalid request'}, {status : 400});
    }
    const codeVerifier = cookies().get('codeVerifier')?.value;
    const savedState = cookies().get('state')?.value;

    if(!codeVerifier || !savedState){
        console.error('no code verified received');
        return NextResponse.json({message : 'invalid request'}, {status : 400});
    }
    if(state !== savedState){
        console.error('state mismatched');
        return NextResponse.json({message : 'invalid request'}, {status : 400});
    }
    const {accessToken} = await googleOAuthClient.validateAuthorizationCode(code, codeVerifier);
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers : {
            Authorization : `Bearer ${accessToken}`
        }
    });
    const googleData = (await googleResponse.json()) as {
        id : string,
        email : string,
        name : string,
        picture : string
    }
    let userId : string = '';
    const existingUser = await prisma.user.findUnique({
        where : {
            email : googleData.email
        }
    });
    if(existingUser){
        userId = existingUser.id
    }else{
        const user = await prisma.user.create({
            data : {
                email : googleData.email,
                name : googleData.name,
                picture : googleData.picture
            }
        });
        userId = user.id;
    }
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect('/dashboard');
}
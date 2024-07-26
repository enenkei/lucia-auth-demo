'use server';

import { z } from "zod";
import { signUpSchema } from "./sign-up-form";
import { prisma } from "@/lib/prisma";
import { Argon2id } from 'oslo/password';
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { signInSchema } from "./sign-in-form";
import { redirect } from "next/navigation";
import { generateCodeVerifier, generateState } from "arctic";
import { googleOAuthClient } from "@/lib/google-oauth";

export const signUp = async (values: z.infer<typeof signUpSchema>) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: values.email
            }
        });
        if (existingUser) {
            return { error: 'User existed', success: false }
        }
        const hashedPassword = await new Argon2id().hash(values.password);
        const user = await prisma.user.create({
            data: {
                email: values.email,
                name: values.name,
                hashedPassword
            }
        });
        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        return { success: true };
    } catch (err) {
        console.log(err);
    }
}

export const signIn = async (values: z.infer<typeof signInSchema>) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: values.email
            }
        });
        if (!user || !user.hashedPassword) {
            return { success: false, error: 'Invalid credentials' };
        }
        const passwordMatching = await new Argon2id().verify(user.hashedPassword, values.password);
        if (!passwordMatching) {
            return { success: false, error: 'Invalid credentials' };
        }
        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        return { success: true };
    } catch (err) {
        console.log(err);
    }
}

export const logOut = async () => {
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect('/authentication');

}

export const getGoogleOAuthConsentUrl = async () => {
    try {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        cookies().set('codeVerifier', codeVerifier, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production'
        });
        cookies().set('state', state, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production'
        });
        const authUrl = await googleOAuthClient.createAuthorizationURL(state, codeVerifier, {
            scopes : ['email', 'profile']
        });
        return {success : true, url : authUrl.toString()}
    } catch (err) {

    }
}
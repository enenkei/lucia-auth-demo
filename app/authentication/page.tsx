import { TabSwitcher } from '@/components/tab-switcher';
import React from 'react'
import SignInForm from './sign-in-form';
import SignUpForm from './sign-up-form';
import GoogleOauthButton from '@/components/google-oauth-button';

const AuthenticationPage = () => {
    return (
        <div className='flex w-full h-screen bg-background items-center place-content-between'>
            <div className='max-w-3xl absolute right-1/2'>
                <GoogleOauthButton />
                <TabSwitcher signInTab={<SignInForm />} signUpTab={<SignUpForm />} />
            </div>
        </div>
    )
}

export default AuthenticationPage;

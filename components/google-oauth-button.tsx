'use client';
import React from 'react'
import { Button } from './ui/button';
import { RiGoogleFill } from '@remixicon/react'
import { getGoogleOAuthConsentUrl } from '@/app/authentication/auth-action';

const GoogleOauthButton = () => {
  const onClickGoogle = async () => {
    const res = await getGoogleOAuthConsentUrl();
    if (res?.url) {
      window.location.href = res.url;
    } else {
      console.log('error getting Google OAuth');
    }
  }
  return (
    <Button onClick={() => onClickGoogle()}>
      <RiGoogleFill className='w-4 h-4 mr-2' />
      Continue with Google
    </Button>
  )
}

export default GoogleOauthButton;

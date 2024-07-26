import SignOutButton from '@/components/sign-out-button';
import { getUser } from '@/lib/lucia';
import { redirect } from 'next/navigation';
import React from 'react'

const DashboardPage = async () => {
    const user = await getUser();
    if(!user) {
        redirect('/authentication');
    }
    return (
        <div>
            {user.name}
            <SignOutButton>Sign-out</SignOutButton>
        </div>
    )
}

export default DashboardPage;

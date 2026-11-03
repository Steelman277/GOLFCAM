'use client'

import SignIn from '@/components/auth/SignIn';
import SignUpTeam from '@/components/auth/SignUpTeam';
import Image from 'next/image';
import { useState } from 'react';
import SignUpScout from '@/components/auth/SignUpScout'
import ForgotPassword from '@/components/auth/ForgotPassword';
export default function Home() {
  const [authDisplay, setAuthDisplay] = useState('signin');

  return (
    <div className="grid grid-col h-screen w-screen pl-16 justify-center place-items-center  bg-zinc-50 font-sans dark:bg-neutral-900 ">

        {authDisplay === 'signin' && 
        <div className="flex flex-col w-full p-2 gap-2 place-items-center">
        <SignIn />
        <button onClick={() => setAuthDisplay('signupscout')}>
        If you don't have an account, click here to sign up for one under your team number.</button>
        <button onClick={() => setAuthDisplay('forgotpassword')}>
        If you forgot your password you can reset it here.</button>
        </div>
        }
        {authDisplay === 'signupteam' && 
        <div>
        <SignUpTeam />
        <button onClick={() => setAuthDisplay('signin')}>
        If you already have a team, you can sign in here.</button>
        </div>
        }
        {authDisplay === 'signupscout' && 
        <div>
        <SignUpScout setDisplay={setAuthDisplay} />
        <button onClick={() => setAuthDisplay('signupteam')}>
        If your team has not signed up yet, please have a lead mentor sign up for your team here.</button>
        </div>
        }
        {authDisplay === 'forgotpassword' && 
        <div>
        <ForgotPassword setDisplay={setAuthDisplay} />
        <button onClick={() => setAuthDisplay('signin')}>
        Return to sign in.</button>
        </div>
        }
    </div>
  );
}
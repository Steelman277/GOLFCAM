'use client'


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { getToken } from '@/lib/jwt';
import { set } from 'mongoose';




const Page = () => {
    const router = useRouter();
    const { appEvent } = useAppContext();
    

    
return (
    <div className="flex flex-col w-screen pl-20 text-xs">
        <h1 className="text-xl font-bold">{appEvent?.name}</h1>
        <p>Pit scout robots at the event.</p>
    </div>
)
}

export default Page;
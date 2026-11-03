'use client'


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { getToken } from '@/lib/jwt';
import { set } from 'mongoose';




const Page = () => {
    const router = useRouter();
    const { appEvent, setAppEvent } = useAppContext();
    

    
return (
    <div className="flex flex-col w-screen pl-20 text-xs">
        <h1 className="text-xl font-bold">{appEvent?.name}</h1>
        <p>Robot Data for this event.</p>
    </div>
)
}

export default Page;
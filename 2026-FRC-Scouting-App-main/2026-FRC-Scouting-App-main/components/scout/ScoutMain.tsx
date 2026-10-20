'use client'

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Rankings from './Rankings';

interface Props {
    setDisplay: (page: string) => void
}

const ScoutMain = ({setDisplay}: Props) => {
    const { appEvent } = useAppContext();

    
    return (
        <div className="flex flex-col w-screen text-xs">
            

            {appEvent?.code && 
            <Rankings eventCode={appEvent?.code} />
                }
        </div>
    )
}


export default ScoutMain;
'use client'

import { useState } from 'react';

import { HouseIcon, ClipboardCheck, ChartNoAxesCombined, Handshake, Swords } from 'lucide-react';

interface Props {
    setDisplay: (page: string) => void
}

const ScoutMenu = ({setDisplay}: Props) => {
    
    return (
        <div className="flex flex-row flex-wrap w-full my-2 justify-between text-xs">
            <button className="bg-blue-900 text-white rounded-lg px-2 py-2 font-bold" 
            onClick={() => setDisplay('main')}>
                <HouseIcon className="h-6 w-6" />
            </button>
            <button className="flex flex-col justify-center place-items-center text-center bg-blue-900 text-white rounded-lg px-2 py-2 font-bold" 
            onClick={() => setDisplay('pit')}>
                <ClipboardCheck className="h-6 w-6" /> 
                <p className="text-[8px]">Pit Scout</p>
            </button>
            <button className="flex flex-col justify-center place-items-center text-center bg-blue-900 text-white rounded-lg px-2 py-2 font-bold" 
            onClick={() => setDisplay('matches')}>
                <Swords className="h-6 w-6" /> 
                <p className="text-[8px]">Match Scout</p>
            </button>
            <button className="flex flex-col justify-center place-items-center text-center bg-blue-900 text-white rounded-lg px-2 py-2 font-bold" onClick={() => setDisplay('insights')}>
                <ChartNoAxesCombined className="h-6 w-6" /> 
                <p className="text-[8px]">Insights</p>
            </button>
            <button className="flex flex-col justify-center place-items-center text-center bg-blue-900 text-white rounded-lg px-2 py-2 font-bold" onClick={() => setDisplay('alliance')}>
                <Handshake className="h-6 w-6" /> 
                <p className="text-[8px]">Alliance Tools</p>
            </button>
            <div className="flex flex-col px-2 py-2 font-bold">&nbsp;</div>
        </div>
    )
}

export default ScoutMenu;
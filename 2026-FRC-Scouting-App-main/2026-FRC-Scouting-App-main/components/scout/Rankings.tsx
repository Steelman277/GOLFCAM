'use client'

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';

import { getRankings } from '@/lib/scout/getrankings';

interface Props {
    eventCode: string,
}

const Rankings = ({eventCode}: Props) => {
    const [rankings, setRankings] = useState<any[]>([]);
    const { appEvent } = useAppContext();

    const getTeamName = (teamNumber: string) => {
        if (appEvent?.teams) {
            const team = appEvent?.teams.find((team) => team.number === teamNumber);
            if (team) {
                return team.name;
            }
        }
        return teamNumber;
    }

    useEffect(() => {
        const fetchRankings = async () => {
            const rankings = await getRankings(eventCode);
            if (rankings !== null) {
                setRankings(JSON.parse(rankings));
            }
        }
        fetchRankings();
    }, []);

    return (
        <div className="flex flex-col w-screen text-xs gap-2">
            {rankings.length > 0 && 
            
            <div className="flex flex-col w-3/4 p-4 bg-neutral-800 text-white text-xs rounded-xl my-2">
                <h1>Event Rankings</h1>
            {rankings.map((ranking, index) => (
                
                    <div key={index} className="grid grid-cols-[1fr_2fr_3fr] gap-2 w-full">
                        
                            <p className="text-center font-bold text-sm my-1" >{ranking.rank}</p>
                            <p className="text-center font-bold text-sm my-1" >{ranking.teamNumber}</p>
                            <p className="text-center font-bold text-sm my-1" >{getTeamName(ranking.teamNumber)}</p>
                        
                    </div>
            ))}
            </div>}
        </div>
    )
}

export default Rankings;
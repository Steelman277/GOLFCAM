'use client'


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { getToken } from '@/lib/jwt';
import { set } from 'mongoose';

interface ITeam {
          teamNumber: number,
          station: string,
          dq: boolean
        }

interface IMatch 
    {
      actualStartTime: Date,
      tournamentLevel: string,
      postResultTime: Date,
      description: string,
      matchNumber: number,
      scoreRedFinal: number,
      scoreRedFoul: number,
      scoreRedAuto: number,
      scoreBlueFinal: number,
      scoreBlueFoul: number,
      scoreBlueAuto: number,
      teams: ITeam[]
    }


const Page = () => {
    const router = useRouter();
    const { appEvent, setAppEvent } = useAppContext();
    const [matches, setMatches] = useState<IMatch[]>([]);
    
    useEffect(() => {
        const fetchMatches = async () => {
           const response = await fetch(`/api/frc-events-test/matchresults`);
           const data = await response.json();
           setMatches(data);

        }
        fetchMatches();
    }, []);


return (
    <div className="flex flex-col w-screen pl-20 text-xs">
        <h1 className="text-xl font-bold">{appEvent?.name}</h1>
        <p>Match Schedule to scout for the event.</p>



        {matches.length > 0 && matches.map((match: IMatch, index: number) => (
            <div key={index} className="flex flex-row w-70 text-xs bg-slate-800 rounded-lg p-2 gap-2">
                <div className="flex flex-col p-2 bg-slate-700 rounded-lg">{match.description} - {match.matchNumber}</div>
                
            </div>
        ))}
    </div>
)
}

export default Page;
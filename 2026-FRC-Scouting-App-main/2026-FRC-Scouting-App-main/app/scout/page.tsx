'use client'


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

import ScoutMenu from '@/components/scout/ScoutMenu';
import ScoutMain from '@/components/scout/ScoutMain';
import ScoutPit from '@/components/scout/ScoutPit';
import ScoutMatches from '@/components/scout/ScoutMatches';

import Insights from '@/components/scout/Insights';
import AllianceTools from '@/components/scout/AllianceTools';



const Page = () => {
    const router = useRouter();
    const [scoutDisplay, setScoutDisplay] = useState('main');
    const { appEvent, setAppEvent } = useAppContext();
    

    
return (
    <div className="flex flex-col w-screen pl-20 text-xs">
        <ScoutMenu setDisplay={setScoutDisplay} />


        <h1 className="text-xl font-bold">{appEvent?.name} ({appEvent?.code})</h1>
        
        {scoutDisplay === 'main' && 
            <ScoutMain setDisplay={setScoutDisplay} />
        }

        {scoutDisplay === 'pit' && 
            <ScoutPit setDisplay={setScoutDisplay} />
        }
        {scoutDisplay === 'matches' && appEvent?.code &&
            <ScoutMatches  eventCode={appEvent?.code} setDisplay={setScoutDisplay} />
        }

        {scoutDisplay === 'insights' && appEvent?.code &&
            <Insights  eventCode={appEvent?.code} setDisplay={setScoutDisplay} />
        }

        {scoutDisplay === 'alliance' && appEvent?.code &&
            <AllianceTools  eventCode={appEvent?.code}  />
        }

    </div>
)
}

export default Page;
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { storeToken } from '@/lib/jwt';
import { CircleX } from "lucide-react";


interface ITeam {
    number: string;
    name: string;
}

interface DisplayEvent {
    week: string;
    dateStart: Date;
    dateEnd: Date;
    code: string;
    name: string;
    divisionCode: string;
    districtCode: string;
    city: string;
    stateprov: string;
    country: string;
    teams: ITeam[];
}   

export const Weeks = [
    { week: 'PRE-SEASON', sdate: 20260200, edate: 20260301 },
    { week: 'Week 1', sdate: 20260302, edate: 20260309 },
    { week: 'Week 2', sdate: 20260310, edate: 20260315 },
    { week: 'Week 3', sdate: 20260316, edate: 20260322 },
    { week: 'Week 4', sdate: 20260323, edate: 20260329 },
    { week: 'Week 5', sdate: 20260330, edate: 20260405 },
    { week: 'Week 6', sdate: 20260406, edate: 20260412 },
    { week: 'Week 7', sdate: 20260413, edate: 20260419 },
    { week: 'FIRST Championship', sdate: 20260427, edate: 20260503 },
]







const Page = () => {
    const router = useRouter();
    const { setAppEvent } = useAppContext();
    const [event, setEvent] = useState<DisplayEvent>({} as DisplayEvent);
    const [showEvent, setShowEvent] = useState<boolean>(false);
    const [events, setEvents] = useState<DisplayEvent[]>([]);
    const [displayEvents, setDisplayEvents] = useState<DisplayEvent[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [districtFilter, setDistrictFilter] = useState('');
    const [weekFilter, setWeekFilter] = useState('Week 1');
    

    useEffect(() => {
        const fetchEvent = async () => {
            //  Identify the current week
            const currentDate = new Date();
            const currentWeek = 'Week 1'
            for (const weekData of Weeks) {
                //console.log('Week Data: ', weekData);
                const compare = (currentDate.getFullYear().valueOf() * 10000) + ((currentDate.getMonth().valueOf() + 1) * 100) + currentDate.getDate().valueOf();
                if (weekData.sdate <= compare && compare <= weekData.edate) {
                    setWeekFilter(weekData.week);
                    break;
                }
            }


            const response = await fetch(`/api/frc-events/events`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to fetch data from server');
            }
            const DisplayEvents = []
            for (const event of data) {
                const compDate = new Date(event.dateStart);
                const compare = (compDate.getFullYear().valueOf() * 10000) + ((compDate.getMonth().valueOf() + 1) * 100) + compDate.getDate().valueOf();
                //console.log('Compare Value: ', compare, " from date: ", compDate.toLocaleDateString());
                let week = ''
                for (const weekData of Weeks) {
                    //console.log('Week Data: ', weekData);
                    if (weekData.sdate <= compare && compare <= weekData.edate) {
                        week = weekData.week;
                        break;
                    }
                }

                const teamsList: ITeam[] = [];
                for (const team of event.teams) {
                    teamsList.push({ number: team.number, name: team.name });
                }

                const displayEvent: DisplayEvent = {
                    week: week,
                    dateStart: new Date(event.dateStart),
                    dateEnd: new Date(event.dateEnd),
                    code: event.code,
                    name: event.name,
                    divisionCode: event.divisionCode,
                    districtCode: event.districtCode,
                    city: event.city,
                    stateprov: event.stateprov,
                    country: event.country,
                    teams: teamsList,
                };

                DisplayEvents.push(displayEvent)
            }
            setEvents(DisplayEvents.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime()));
            
        };
        fetchEvent();
    }, []);

    useEffect(() => {
        if (events.length > 0) {
            const weekEvents = events
                .filter((event: DisplayEvent) => event.week === weekFilter)
            if (districtFilter !== '') {
                if (districtFilter === 'Regional') {
                    setDisplayEvents(weekEvents.filter((event: DisplayEvent) => !event.districtCode))
                } else {
                    setDisplayEvents(weekEvents.filter((event: DisplayEvent) => event.districtCode === districtFilter))
                }
            } else {
                setDisplayEvents(weekEvents);
            }
        }
    }, [events, weekFilter, districtFilter]);

    const handleShowEvent = (event: DisplayEvent) => {
        setEvent(event);
        setShowEvent(true);
    }


    const handleSetEvent = async (event: DisplayEvent) => {
        setAppEvent(event);
        const token = await storeToken('event', event);
        router.push(`/scout`);
    }

    return (
        <div className="flex flex-col w-screen pl-20 text-xs">
            <h1 className="text-xl font-bold">Select Event</h1>
            <p>Select an event to scout teams and matches.</p>
            
            <div className="flex flex-col gap-2 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex gap-2">
                        <select className="w-70 bg-slate-800 rounded-lg p-4  text-lg" value={weekFilter} onChange={(e) => setWeekFilter(e.target.value)}>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="PRE-SEASON">PRE-SEASON</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="Week 1">Week 1</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="Week 2">Week 2</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="Week 3">Week 3</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="Week 4">Week 4</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="Week 5">Week 5</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="Week 6">Week 6</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="Week 7">Week 7</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="FIRST Championship">FIRST Championship</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <select className="w-70 bg-slate-800 rounded-lg p-4 text-sm" value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)}>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="">All Districts & Regionals</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="Regional">Regionals</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="FIM">FIRST In Michigan</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="ONT">FIRST Canada - Ontario District</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="CA">FIRST California</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="WIN">FIRST Wisconsin</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="FCH">FIRST Chesapeake</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="ISR">FIRST Isreal</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="FMA">FIRST Mid-Atlantic</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="FNC">FIRST North Carolina</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="FIT">FIRST In Texas</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="FIN">FIRST Indiana Robotics</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="FSC">FIRST South Carolina</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="NE">New England</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="PCH">Peachtree</option>
                            <option className="bg-slate-700 m-1 p-4 rounded-lg text-lg" value="PNW">Pacific Northwest</option>
                        </select>
                    </div>
                </div>

                <h2 className="text-xl font-bold">{districtFilter} {weekFilter} Events</h2>

                <div className="flex flex-row flex-wrap gap-2">
                {displayEvents.map((event: DisplayEvent, index: number) => (
                    <div key={index} className="flex flex-row w-70 text-xs bg-slate-800 rounded-lg p-2 gap-2" onClick={() => handleShowEvent(event)}>
                        <div className="flex flex-col p-2 bg-slate-700 rounded-lg">{!event.districtCode ? 'REG' : event.districtCode}</div>
                        <p className="p-2">{event.name}</p>
                    </div>
                ))}
                </div>
           
            
            
            </div>

            {showEvent && 
                <div className="fixed top-0 left-0 z-10 w-screen h-screen p-8 text-xs text-slate-200 bg-neutral-800 flex flex-col gap-4 overflow-y-scroll">
                    <div className="grid grid-cols-[9fr_1fr] gap-2">
                        <h2 className="text-lg md:text-xl lg:text-4xl font-bold">{event.name}</h2>
                        <button className="justify-self-start" onClick={() => setShowEvent(false)}><CircleX className="m-auto" /></button>
                    </div>

                    <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold">{!event.districtCode ? 'Regional' : event.districtCode} {event.week} Event</p>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg italic">{event.dateStart.toLocaleDateString()} - {event.dateEnd.toLocaleDateString()}</p>
                    <p>Teams Attenting: </p>
                    <div className="flex flex-row flex-wrap gap-1">
                    {event.teams.map((team: ITeam, index: number) => (
                        <p key={index} className="flex text-[9px] p-2 text-slate-800 bg-white font-bold rounded-lg">{team.number} {team.name}</p> 

                    ))}
                    </div>

                    <button className="w-full bg-blue-900 text-xl font-bold rounded-lg mb-8 p-2 " onClick={() => handleSetEvent(event)}>Scout This Event</button>

                </div>
            
            
            
            }






        </div>
    );
}

export default Page;
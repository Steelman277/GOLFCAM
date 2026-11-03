'use client'

import { useEffect, useState } from 'react';
import { IMatch } from '@/models/frc-events/Match';
import { getSchedule } from '@/lib/scout/getschedule';  
import { useAppContext } from '@/context/AppContext';

import { CircleX, Video, Star } from 'lucide-react';

import { Separator } from '../ui/separator';

import MatchScoutForm from '@/components/scout/MatchScoutForm';
import { getEventScoutedMatches } from '@/lib/scout/getEventScoutMatches';

interface Props {
    eventCode: string,
    setDisplay: (page: string) => void
}

const ScoutMatches = ({eventCode,setDisplay}: Props) => {
    const { appEvent } = useAppContext();
    const [matches, setMatches] = useState<IMatch[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [teamNumber, setTeamNumber] = useState('');
    const [matchNumber, setMatchNumber] = useState('');
    const [tournamentLevel, setTournamentLevel] = useState('');
    const [postition, setPostition] = useState('');
    const [scoutedIDs, setScoutedIDs] = useState<string[]>([]);

    useEffect(() => {
        const fetchMatches = async () => {
            const matches = await getSchedule(eventCode);
            if (matches !== null) {
                setMatches(JSON.parse(matches));
            }
            const scoutedMatches = await getEventScoutedMatches(eventCode);
            if (scoutedMatches !== null) {
                const scoutedMatchIDs: string[] = []
                for (const match of JSON.parse(scoutedMatches)) {
                    scoutedMatchIDs.push(match.matchID);
                }
                setScoutedIDs(scoutedMatchIDs);
            }
        }
        fetchMatches();
    }, [showForm]);


    
    const handleScoutMatch = (teamNumber: string, matchNumber: string, tournamentLevel: string, postitiom: string) => {
        setTeamNumber(teamNumber);
        setMatchNumber(matchNumber);
        setTournamentLevel(tournamentLevel);
        setPostition(postitiom);
        setShowForm(true);
    }

    return (
        <div className="flex flex-col w-screen text-xs gap-2 mt-2">
            {matches.filter((match) => match.actualStartTime === null).filter((match) => match.tournamentLevel === "Qualification").length > 0 && <>
                <Separator />
                <h2 className="text-lg font-bold mb-1">Upcoming Qualification Matches</h2>
                <Separator />
            {matches.filter((match) => match.actualStartTime === null).filter((match) => match.tournamentLevel === "Qualification").map((match, index) => (
                <div key={index} className="flex flex-col w-3/4 p-3 bg-neutral-800 text-white text-xs rounded-xl">
                    <h2 className="text-lg font-bold mb-1">{match.description}</h2>
                    <div className="grid grid-cols-[2fr_2fr_2fr] justify-between">
                        <div className="flex flex-col p-1 bg-red-500 rounded-xl">
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[0].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red1"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[0].teamNumber + '-' + "Red1") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[0].teamNumber}
                                </p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[1].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red2"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[1].teamNumber + '-' + "Red2") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[1].teamNumber}
                                </p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[2].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red3"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[2].teamNumber + '-' + "Red3") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[2].teamNumber}</p>
                        </div>
                        <div className="flex flex-col">
                            
                        </div>
                        <div className="flex flex-col p-1 bg-blue-500 rounded-xl">
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[3].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue1"))}>
                                {match.teams[3].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[3].teamNumber + '-' + "Blue1") && <Star className="h-4 w-4 ml-1" />}</p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[4].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue2"))}>
                                {match.teams[4].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[4].teamNumber + '-' + "Blue2") && <Star className="h-4 w-4 ml-1" />}</p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[5].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue3"))}>
                                {match.teams[5].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[5].teamNumber + '-' + "Blue3") && <Star className="h-4 w-4 ml-1" />}</p>
                        </div>
                    </div>
                </div>
            ))}

            </>}

            {matches.filter((match) => match.actualStartTime === null).filter((match) => match.tournamentLevel === "Playoff").length > 0 && <>
                <Separator />
                <h2 className="text-lg font-bold mb-1">Upcoming Ellimination Matches</h2>
                <Separator />
            {matches.filter((match) => match.actualStartTime === null).filter((match) => match.tournamentLevel === "Playoff").map((match, index) => (
                <div key={index} className="flex flex-col w-3/4 p-2 bg-neutral-800 text-white text-xs rounded-xl">
                    <h2 className="text-lg font-bold mb-1">{match.description}</h2>
                    <div className="grid grid-cols-[2fr_2fr_2fr] justify-between">
                        <div className="flex flex-col p-1 bg-red-500 rounded-xl">
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[0].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red1"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[0].teamNumber + '-' + "Red1") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[0].teamNumber}
                                </p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[1].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red2"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[1].teamNumber + '-' + "Red2") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[1].teamNumber}
                                </p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[2].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red3"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[2].teamNumber + '-' + "Red3") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[2].teamNumber}</p>
                        </div>
                        <div className="flex flex-col">
                            
                        </div>
                        <div className="flex flex-col p-1 bg-blue-500 rounded-xl">
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[3].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue1"))}>
                                {match.teams[3].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[3].teamNumber + '-' + "Blue1") && <Star className="h-4 w-4 ml-1" />}</p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[4].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue2"))}>
                                {match.teams[4].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[4].teamNumber + '-' + "Blue2") && <Star className="h-4 w-4 ml-1" />}</p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[5].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue3"))}>
                                {match.teams[5].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[5].teamNumber + '-' + "Blue3") && <Star className="h-4 w-4 ml-1" />}</p>
                        </div>
                    </div>
                </div>
            ))}

            </>}

            

            {matches.filter((match) => match.actualStartTime !== null).filter((match) => match.tournamentLevel === "Qualification").length > 0 && <>
                <Separator />
                <h2 className="text-lg font-bold mb-1">Played Qualification Matches</h2>
                <Separator />
            {matches.filter((match) => match.actualStartTime !== null).filter((match) => match.tournamentLevel === "Qualification").map((match, index) => (
                <div key={index} className="flex flex-col w-3/4 p-2 bg-neutral-800 text-white text-xs rounded-xl">
                    <div className="flex flex-row justify-between text-lg font-bold mb-1">
                        <p>{match.description}</p>
                        {match.matchVideoLink && <a href={match.matchVideoLink} target="_blank" rel="noreferrer"><Video className="h-6 w-6" /></a>}
                    </div> 
                    <div className="grid grid-cols-[2fr_2fr_2fr] justify-between">
                        <div className="flex flex-col p-1 bg-red-500 rounded-xl">
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[0].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red1"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[0].teamNumber + '-' + "Red1") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[0].teamNumber}
                                </p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[1].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red2"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[1].teamNumber + '-' + "Red2") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[1].teamNumber}
                                </p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[2].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red3"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[2].teamNumber + '-' + "Red3") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[2].teamNumber}</p>
                        </div>
                        <div className="flex flex-col p-2">
                            {match.scoreRedFinal && <p className="text-left font-bold text-xl my-1 text-red-400">{match.scoreRedFinal}</p>}
                            <Separator />
                            {match.scoreRedFinal > match.scoreBlueFinal && <p className="text-center font-bold text-sm mr-1 py-1 text-red-500"> WINNER </p>}
                            {match.scoreRedFinal < match.scoreBlueFinal && <p className="text-center font-bold text-sm mr-1 py-1 text-blue-500"> WINNER </p>}
                            {match.scoreRedFinal === match.scoreBlueFinal && <p className="text-center font-bold text-sm mr-1 py-1 w-full"> TIE  </p>}
                            <Separator />
                            {match.scoreBlueFinal && <p className="text-right font-bold text-xl my-1 text-blue-400">{match.scoreBlueFinal}</p>}
                        </div>
                        <div className="flex flex-col p-1 bg-blue-500 rounded-xl">
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[3].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue1"))}>
                                {match.teams[3].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[3].teamNumber + '-' + "Blue1") && <Star className="h-4 w-4 ml-1" />}</p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[4].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue2"))}>
                                {match.teams[4].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[4].teamNumber + '-' + "Blue2") && <Star className="h-4 w-4 ml-1" />}</p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[5].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue3"))}>
                                {match.teams[5].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[5].teamNumber + '-' + "Blue3") && <Star className="h-4 w-4 ml-1" />}</p>
                        </div>
                    </div>
                </div>
            ))}

            </>}

            {matches.filter((match) => match.actualStartTime !== null).filter((match) => match.tournamentLevel === "Playoff").length > 0 && <>
                <Separator />
                <h2 className="text-lg font-bold mb-1">Played Ellimination Matches</h2>
                <Separator />
            {matches.filter((match) => match.actualStartTime !== null).filter((match) => match.tournamentLevel === "Playoff").map((match, index) => (
                <div key={index} className="flex flex-col w-3/4 p-2 bg-neutral-800 text-white text-xs rounded-xl">
                    <div className="flex flex-row justify-between text-lg font-bold mb-1">
                        <p>{match.description}</p>
                        {match.matchVideoLink && <a href={match.matchVideoLink} target="_blank" rel="noreferrer"><Video className="h-6 w-6" /></a>}
                    </div> 
                    <div className="grid grid-cols-[2fr_2fr_2fr] justify-between">
                            <div className="flex flex-col p-1 bg-red-500 rounded-xl">
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[0].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red1"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[0].teamNumber + '-' + "Red1") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[0].teamNumber}
                                </p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[1].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red2"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[1].teamNumber + '-' + "Red2") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[1].teamNumber}
                                </p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-red-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[2].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Red3"))}>
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[2].teamNumber + '-' + "Red3") && <Star className="h-4 w-4 mx-1" />}
                                {match.teams[2].teamNumber}</p>
                        </div>
                        <div className="flex flex-col">
                            {match.scoreRedFinal && <p className="text-center font-bold text-sm my-1">{match.scoreRedFinal}</p>}
                            <Separator />
                            {match.scoreBlueFinal && <p className="text-center font-bold text-sm my-1">{match.scoreBlueFinal}</p>}
                        </div>
                        <div className="flex flex-col p-1 bg-blue-500 rounded-xl">
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[3].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue1"))}>
                                {match.teams[3].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[3].teamNumber + '-' + "Blue1") && <Star className="h-4 w-4 ml-1" />}</p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[4].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue2"))}>
                                {match.teams[4].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[4].teamNumber + '-' + "Blue2") && <Star className="h-4 w-4 ml-1" />}</p>
                            <p className="flex flex-row justify-center font-bold text-sm my-1 p-1 bg-blue-950 rounded-lg" 
                            onClick={(() => handleScoutMatch(match.teams[5].teamNumber.toString(), match.matchNumber.toString(), match.tournamentLevel, "Blue3"))}>
                                {match.teams[5].teamNumber}
                                {appEvent && scoutedIDs.includes(appEvent.code + '-' + match.tournamentLevel + '-' + match.matchNumber.toString() + '-' + match.teams[5].teamNumber + '-' + "Blue3") && <Star className="h-4 w-4 ml-1" />}</p>
                        </div>
                    </div>
                </div>
            ))}

            </>}




        {showForm && 
            <div className="fixed top-0 left-0 w-screen h-full z-150 p-4 bg-blue-950 text-white text-xs  font-bold overflow-y-auto">
                <div className="grid grid-cols-[4fr_1fr] justify-between">
                    <div className="p-2 text-left folt-bold text-sm">Scouting {tournamentLevel} Match {matchNumber}</div>
                    <div className="p-2 text-right"><button onClick={(() => setShowForm(false))}><CircleX /></button></div>
                </div>
                <div className="flex flex-col gap-2 width-full justify-center place-items-center">
                    <div className="text-xl font-bold">TEAM {teamNumber} ({postition})</div>
                </div>
                <MatchScoutForm teamNumber={teamNumber} matchNumber={matchNumber} eventCode={eventCode} tournamentLevel={tournamentLevel} position={postition} closeForm={() => setShowForm(false)} />
                
            </div>
        }








        </div>
    )
}

export default ScoutMatches;
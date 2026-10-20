'use client'

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { IMatchSummary } from '@/models/insights/MatchSummary';
import { IMatchScout } from '@/models/scout/MatchScout';
import { CircleX } from 'lucide-react';


import { getEventScoutedMatches } from '@/lib/scout/getEventScoutMatches';
import { match } from 'assert';


interface ITeamSummary  {
    teamNumber: number,
    matchesPlayed: number,
    avgTotalFuel: number,
    avgAutoOnlyFuel: number,
    alliancesScouted: number,
    avgTotalAdjFuel: number,
    avgAdjAutoFuel: number,
    matchesScouted: number,
    avgAutoLaunches: number,
    avgFirstShiftLaunches: number,
    avgSecondShiftLaunches: number,
    avgEndgameLaunches: number,
    avgPassHerdNeutral: number,
    avgPassHerdOpposing: number,
    avgPassLaunchedNeutral: number,
    avgPassLaunchedOpposing: number,
    avgDefenseNeutral: number,
    avgDefenseOpposing: number,
    avgRobotDied: number,
    avgRobotBroke: number,
}


interface Props {
    eventCode: string,
    setDisplay: (page: string) => void
}

const ScoutInsights = ({eventCode, setDisplay}: Props) => {
    const { appEvent } = useAppContext();
    const [showForm, setShowForm] = useState(false);
    const [teamNumber, setTeamNumber] = useState('');
    const [matchSummaries, setMatchSummaries] = useState<IMatchSummary[]>([]);
    const [teamSummaries, setTeamSummaries] = useState<ITeamSummary[]>([]);
    const [scoutedMatches, setScoutedMatches] = useState<IMatchScout[]>([]);
    const [teams, setTeams] = useState<string[]>([]);

    const [width, setWidth] = useState(window.innerWidth); // default width, detect on server.
    const handleResize = () => setWidth(window.innerWidth);

    useEffect(() => {
        const fetchMatchSummaries = async () => {
            const Matches = await getEventScoutedMatches(eventCode);   
            if (Matches !== null) {
                const matches = JSON.parse(Matches);
                setScoutedMatches(matches);
                const getteams: string[] = []
                for (const match of matches) {
                    if (!getteams.includes(match.teamNumber)) {
                        getteams.push(match.teamNumber);
                    }
                }
                setTeams(getteams);
            }

            const response = await fetch('/api/insights/teamsummaries/' + eventCode);
            if (response) {
                const Summaries = await response.json();
                const displaySummaries: ITeamSummary[] = [];
                for (const teamSummary of Summaries) {
                    const displaySummary = {
                        teamNumber: teamSummary.teamNumber,
                        matchesPlayed: teamSummary.matchesPlayed,
                        avgTotalFuel: teamSummary.avgTotalFuel,
                        avgAutoOnlyFuel: teamSummary.avgAutoOnlyFuel,
                        alliancesScouted: teamSummary.allianceScouted,
                        avgTotalAdjFuel: teamSummary.avgTotalAdjFuel,
                        avgAdjAutoFuel: teamSummary.avgAdjAutoFuel,
                        matchesScouted: teamSummary.matchesScouted,
                        avgAutoLaunches: teamSummary.avgAutoLaunches,
                        avgFirstShiftLaunches: teamSummary.avgFirstShiftLaunches,
                        avgSecondShiftLaunches: teamSummary.avgSecondShiftLaunches,
                        avgEndgameLaunches: teamSummary.avgEndgameLaunches,
                        avgPassHerdNeutral: teamSummary.avgPassHerdNeutral,
                        avgPassHerdOpposing: teamSummary.avgPassHerdOpposing,
                        avgPassLaunchedNeutral: teamSummary.avgPassLaunchedNeutral,
                        avgPassLaunchedOpposing: teamSummary.avgPassLaunchedOpposing,
                        avgDefenseNeutral: teamSummary.avgDefenseNeutral,
                        avgDefenseOpposing: teamSummary.avgDefenseOpposing,
                        avgRobotDied: teamSummary.avgRobotDied,
                        avgRobotBroke: teamSummary.avgRobotBroke,
                    }
                    displaySummaries.push(displaySummary);
                }
                setTeamSummaries(displaySummaries);
            }

        }
        fetchMatchSummaries();
    }, []);
    


    const handleCloseForm = () => {
        setShowForm(false);
    }


    return (
        <div className="flex flex-col w-19/20 text-xs gap-2">
            <div className="mt-4 text-xl">Teams by Average Alliance Scores </div>
            <div className="flex flex-col w-full gap-2">
                {teamSummaries.sort((a, b) => b.avgTotalFuel - a.avgTotalFuel).map((teamSummary, index) => (
                    <div key={index} className="grid grid-cols-[1fr_9fr] px-2 bg-neutral-800 text-white rounded-xl text-lg font-bold">
                        <div>{teamSummary.teamNumber}</div>
                        <div>
                            <div style={{ width: `${(teamSummary.avgTotalFuel*((width / 500)-1)+15)}px` }} className={`grid bg-amber-500 p-2 rounded-lg text-xs`}>{teamSummary.avgTotalFuel}</div>
                        </div>
                    </div>))}
            </div>

            <div className="mt-4 text-xl">Teams by Average Adjusted Alliance Scores </div>
            <div className="flex flex-col w-full gap-2">
                {teamSummaries.sort((a, b) => b.avgTotalAdjFuel - a.avgTotalAdjFuel).map((teamSummary, index) => (
                    <div key={index} className="grid grid-cols-[1fr_9fr] px-2 bg-neutral-800 text-white rounded-xl text-lg font-bold">
                        <div>{teamSummary.teamNumber}</div>
                        <div>
                            <div style={{ width: `${(teamSummary.avgTotalAdjFuel*((width / 500)-1)+15)}px` }} className={`grid bg-blue-800 p-2 rounded-lg text-xs`}>{teamSummary.avgTotalAdjFuel}</div>
                        </div>
                    </div>))}
            </div>





            <div>{teams.length} Teams | {scoutedMatches.length} Matches</div>
            {teams && teams.sort((a, b) => parseInt(a) - parseInt(b)).map((team, index) => (
                <div key={index} className="flex flex-col w-full p-4 bg-neutral-800 text-white rounded-xl text-lg font-bold">
                    <div>{team}</div>
                    <div className="grid grid-cols-[70px_30px_30px_5px_1fr_1fr_1fr_1fr_5px_1fr_1fr_1fr_1fr_5px_1fr_1fr_5px_1fr_1fr]    bg-neutral-900 text-white  text-[9px] font-bold">
                            <div>MATCH</div>
                            <div>POS</div>
                            <div>TLs</div>
                            <div>&nbsp;</div>
                            
                            <div>A</div>
                            <div>F</div>
                            <div>S</div>
                            <div>E</div>
                            <div>&nbsp;</div>
                            <div>PHN</div>
                            <div>PHO</div>
                            <div>PLN</div>
                            <div>PLO</div>
                            <div>&nbsp;</div>
                            <div>DN</div>
                            <div>DO</div>
                            <div>&nbsp;</div>
                            <div>RD</div>
                            <div>RB</div>

                        </div>
                    {scoutedMatches.filter(matchSummary => matchSummary.teamNumber === team).sort((a, b) => parseInt(a.matchNumber) - parseInt(b.matchNumber)).map((matchSummary, index) => (
                        <div key={index} className="grid grid-cols-[70px_30px_30px_5px_1fr_1fr_1fr_1fr_5px_1fr_1fr_1fr_1fr_5px_1fr_1fr_5px_1fr_1fr]   bg-neutral-900 text-white  text-[8px] font-bold">
                            <div>{matchSummary.tournamentLevel} {matchSummary.matchNumber}</div>
                            <div>{matchSummary.alliancePosition}</div>
                            <div>{matchSummary.autoLaunches + matchSummary.firstShiftLauches + matchSummary.secondShiftLauches + matchSummary.endgameLaunches}</div>
                            <div>&nbsp;</div>
                            
                            <div className="text-center text-sm">{matchSummary.autoLaunches}</div>
                            <div className="text-center text-sm">{matchSummary.firstShiftLauches}</div>
                            <div className="text-center text-sm">{matchSummary.secondShiftLauches}</div>
                            <div className="text-center text-sm">{matchSummary.endgameLaunches}</div>
                            <div>&nbsp;</div>
                            <div className="text-center text-sm">{matchSummary.passHerdNeutral}</div>
                            <div className="text-center text-sm">{matchSummary.passHerdOpposing}</div>
                            <div className="text-center text-sm">{matchSummary.passLaunchedNeutral}</div>
                            <div className="text-center text-sm">{matchSummary.passLaunchedOpposing}</div>
                            <div>&nbsp;</div>
                            <div className="text-center text-sm">{matchSummary.defenseNeutral}</div>
                            <div className="text-center text-sm">{matchSummary.defenseOpposing}</div>
                            <div>&nbsp;</div>
                            <div className="text-center text-sm">{matchSummary.robotDied}</div>
                            <div className="text-center text-sm">{matchSummary.robotBroke}</div>

                        </div>))}
                </div>))}
        </div>
    )
}

export default ScoutInsights;
'use client'

import { useState, useEffect } from "react"
import { useAppContext } from "@/context/AppContext"

import { getRankings } from '@/lib/scout/getrankings';
import { get } from "http";
import { CircleArrowRight, ArrowRight, CircleArrowUp, CircleArrowDown, CircleMinus } from "lucide-react";


 interface IProps {
    eventCode: string,
    list: string,
    closeForm: () => void
   }


const AlliancePickForm = ({eventCode, list}: IProps) => {
    const [picks, setPicks] = useState<string[]>([]);
    const [newPicks, setNewPicks] = useState<string[]>([]);
    const [rankings, setRankings] = useState<any[]>([]);
    const [displayRankings, setDisplayRankings] = useState<any[]>([]);
    
    const [showPickLists, setShowPickLists] = useState<boolean[]>([true,true,true,true,true]);
    const { appEvent } = useAppContext();
    const [listName, setListName] = useState(list);

    const getTeamName = (teamNumber: string) => {
        if (appEvent?.teams) {
            const team = appEvent?.teams.find((team) => team.number === teamNumber);
            if (team) {
                return team.name;
            }
        }
        return teamNumber;
    }

    const addSelection = (teamNumber: string) => {
        setNewPicks(newPicks.concat(teamNumber));
    }

    const subtractSelection = (teamNumber: string) => {
        const updatedPicks = picks.filter((pick) => pick !== teamNumber);
        setNewPicks(updatedPicks);
    }

    const moveSelection = (index: number, direction: string) => {
        const updatedPicks = [...picks]
        let targetIndex = direction === "up" ? index - 1 : index + 1;
        console.log("targetIndex");
        if (targetIndex < 0 || targetIndex >= updatedPicks.length) {
            return;
        }
        
        [updatedPicks[index], updatedPicks[targetIndex]] = [updatedPicks[targetIndex], updatedPicks[index]];

        setNewPicks(updatedPicks);
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


    useEffect(() => {
        if (rankings.length > 0) {
            setDisplayRankings(rankings);
        }
    }, [rankings]);

    useEffect(() => {
        setDisplayRankings(rankings.filter((ranking) => !picks.includes(ranking.teamNumber)));
    }, [picks]);

    useEffect(() => {
        setPicks(newPicks);
    }, [newPicks]);


    function closeForm(): void {
        throw new Error("Function not implemented.");
    }

 return (

    <><div className="grid grid-cols-2 p-4 gap-2">

         <div className="flex flex-col text-right text-xs p-2">
             <div className="flex flex-row text-lg font-bold justify-end place-items-end">List Name <ArrowRight /></div>
             <div>Duplicate names will overwrite existing pick lists.</div>
         </div>

         <div className="flex flex-col p-2">
             <input type="text" placeholder="Choose a name for your list." value={listName} onChange={(e) => setListName(e.target.value)} className="w-full p-2 text-sm font-bold bg-neutral-800 rounded-xl text-white" />
         </div>

         <div className="flex flex-col gap-2">
             <h1 className="text-lg font-bold">Event Rankings</h1>
             <p>Select the teams to include in your pick list.</p>
             {displayRankings.map((ranking, index) => (
                 <div key={index} className="grid grid-cols-[1fr_2fr_5fr_1fr] p-2 gap-2 bg-neutral-800 text-white text-xs rounded-xl justifly-center place-items-center">
                     <div>{ranking.rank}</div>
                     <div>{ranking.teamNumber}</div>
                     <div>{getTeamName(ranking.teamNumber)}</div>
                     <div><CircleArrowRight onClick={() => addSelection(ranking.teamNumber)} /></div>
                 </div>))}
         </div>

         <div className="flex flex-col gap-2">
             <h1 className="text-lg font-bold">Your Picks</h1>
             <p>Use the arrows to change the order in the list.
                 <br />
                 {newPicks.length > 0 && <span className="text-red-500">{newPicks.join(', ')}</span>}
             </p>
             {newPicks.map((pick, index) => (
                 <div key={index} className="grid grid-cols-[1fr_2fr_5fr_1fr] p-2 gap-2 bg-blue-200 text-black text-xs rounded-xl justifly-center place-items-center">
                     <div>{index + 1}</div>
                     <div className="text-lg">{pick}</div>
                     <div>{getTeamName(pick)}</div>
                     <div>
                         <CircleArrowUp onClick={() => moveSelection(index, "up")} />
                         <CircleArrowDown onClick={() => moveSelection(index, "down")} />
                         <CircleMinus onClick={() => subtractSelection(pick)} />

                     </div>
                 </div>))}

         </div>

     </div><div className="flex flex-row flex-wrap gap-2 place-items-center p-2 mt-2">
             <button className="bg-green-500 hover:bg-green-700 text-white w-full font-bold py-2 px-4 rounded-lg" onClick={() => console.log("submit picks to database")}>SUBMIT PICKS</button>
         </div></>

 )}

export default AlliancePickForm;
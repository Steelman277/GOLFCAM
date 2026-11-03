'Use client'

import { use, useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getRankings } from '@/lib/scout/getrankings';
import { ChevronUp, ChevronDown, CirclePlus, CircleX } from 'lucide-react';

import AlliancePickForm from '@/components/scout/AlliancePickForm';


interface IProps {

    eventCode: string,

}

const AllianceTools = ({eventCode}: IProps) => {
    const [alliances, setAlliances] = useState<string[]>([]);
    const [rankings, setRankings] = useState<any[]>([]);
    const [displayRankings, setDisplayRankings] = useState<any[]>([]);
    const [showEventRankings, setShowEventRankings] = useState<boolean>(true);
    const [showPickLists, setShowPickLists] = useState<boolean[]>([true,true,true,true,true]);
    const { appEvent } = useAppContext();
    const [showForm, setShowForm] = useState(false);

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
        //const updatedAliances = alliances
        //updatedAliances.push(teamNumber);
        setAlliances(alliances.concat(teamNumber));
    }

    const subtractAlliance = () => {
        const updatedAlliances = alliances.filter((alliance) => alliance !== alliances[alliances.length - 1]);
        setAlliances(updatedAlliances);
    }

    const handleShowPickLists = (index: number) => {
        const updatedShowPickLists = showPickLists.map((showPickList, i) => i === index ? !showPickList : showPickList);
        setShowPickLists(updatedShowPickLists);
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
        setDisplayRankings(rankings.filter((ranking) => !alliances.includes(ranking.teamNumber)));
    }, [alliances]);




return (
<div className='w-19/20'>
<div className="grid place-items-center pb-1">Alliance Tools</div>

{/* Alliance Section   */}
<div className="flex flex-row flex-wrap gap-2 place-items-center bg-blue-950 rounded-lg p-2">



<div className=' w-32 sm:w-60 md:w-72 text-center'>
<p>Allience 1</p>
<div className=' border-3 w-full text-center'>
    <div className="grid grid-cols-2 place-items-center">
    <p className='font-bold text-base'>{alliances[0]}</p><p className='text-[8px]'>{getTeamName(alliances[0])}</p>
    <p className='font-bold text-base'>{alliances[1]}</p><p className='text-[8px]'>{getTeamName(alliances[1])}</p>
    <p className='font-bold text-base'>{alliances[23]}</p><p className='text-[8px]'>{getTeamName(alliances[23])}</p>
    </div>
</div>
</div>

<div className=' w-32 sm:w-60 md:w-72 text-center'>
<p>Allience 2</p>
<div className=' border-3 w-full text-center'>
    <div className="grid grid-cols-2 place-items-center">
    <p className='font-bold text-base'>{alliances[2]}</p><p className='text-[8px]'>{getTeamName(alliances[2])}</p>
    <p className='font-bold text-base'>{alliances[3]}</p><p className='text-[8px]'>{getTeamName(alliances[3])}</p>
    <p className='font-bold text-base'>{alliances[22]}</p><p className='text-[8px]'>{getTeamName(alliances[22])}</p>
    </div>
</div>
</div>

<div className=' w-32 sm:w-60 md:w-72 text-center'>
<p>Allience 3</p>
<div className=' border-3 w-full text-center'>
    <div className="grid grid-cols-2 place-items-center">
    <p className='font-bold text-base'>{alliances[4]}</p><p className='text-[8px]'>{getTeamName(alliances[4])}</p>
    <p className='font-bold text-base'>{alliances[5]}</p><p className='text-[8px]'>{getTeamName(alliances[5])}</p>
    <p className='font-bold text-base'>{alliances[21]}</p><p className='text-[8px]'>{getTeamName(alliances[21])}</p>
    </div>
</div>
</div>

<div className=' w-32 sm:w-60 md:w-72 text-center'>
<p>Allience 4</p>
<div className=' border-3 w-full text-center'>
    <div className="grid grid-cols-2 place-items-center">
    <p className='font-bold text-base'>{alliances[6]}</p><p className='text-[8px]'>{getTeamName(alliances[6])}</p>
    <p className='font-bold text-base'>{alliances[7]}</p><p className='text-[8px]'>{getTeamName(alliances[7])}</p>
    <p className='font-bold text-base'>{alliances[20]}</p><p className='text-[8px]'>{getTeamName(alliances[20])}</p>
    </div>
</div>
</div>

<div className=' w-32 sm:w-60 md:w-72 text-center'>
<p>Allience 5</p>
<div className=' border-3 w-full text-center'>
    <div className="grid grid-cols-2 place-items-center">
    <p className='font-bold text-base'>{alliances[8]}</p><p className='text-[8px]'>{getTeamName(alliances[8])}</p>
    <p className='font-bold text-base'>{alliances[9]}</p><p className='text-[8px]'>{getTeamName(alliances[9])}</p>
    <p className='font-bold text-base'>{alliances[19]}</p><p className='text-[8px]'>{getTeamName(alliances[19])}</p>
    </div>
</div>
</div>

<div className=' w-32 sm:w-60 md:w-72 text-center'>
<p>Allience 6</p>
<div className=' border-3 w-full text-center'>
    <div className="grid grid-cols-2 place-items-center">
    <p className='font-bold text-base'>{alliances[10]}</p><p className='text-[8px]'>{getTeamName(alliances[10])}</p>
    <p className='font-bold text-base'>{alliances[11]}</p><p className='text-[8px]'>{getTeamName(alliances[11])}</p>
    <p className='font-bold text-base'>{alliances[18]}</p><p className='text-[8px]'>{getTeamName(alliances[18])}</p>
    </div>
</div>
</div>

<div className=' w-32 sm:w-60 md:w-72 text-center'>
<p>Allience 7</p>
<div className=' border-3 w-full text-center'>
    <div className="grid grid-cols-2 place-items-center">
    <p className='font-bold text-base'>{alliances[12]}</p><p className='text-[8px]'>{getTeamName(alliances[12])}</p>
    <p className='font-bold text-base'>{alliances[13]}</p><p className='text-[8px]'>{getTeamName(alliances[13])}</p>
    <p className='font-bold text-base'>{alliances[17]}</p><p className='text-[8px]'>{getTeamName(alliances[17])}</p>
    </div>
</div>
</div>

<div className=' w-32 sm:w-60 md:w-72 text-center'>
<p>Allience 8</p>
<div className=' border-3 w-full text-center'>
    <div className="grid grid-cols-2 place-items-center">
    <p className='font-bold text-base'>{alliances[14]}</p><p className='text-[8px]'>{getTeamName(alliances[14])}</p>
    <p className='font-bold text-base'>{alliances[15]}</p><p className='text-[8px]'>{getTeamName(alliances[15])}</p>
    <p className='font-bold text-base'>{alliances[16]}</p><p className='text-[8px]'>{getTeamName(alliances[16])}</p>
    </div>
</div>
</div>


</div>

{/* Undo Button - step backward in case of mistakes */}
<div className="flex flex-row flex-wrap gap-2 place-items-center p-2 mt-2">
    {alliances.length > 0 &&
        <button className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded-lg" onClick={() => subtractAlliance()}>UNDO</button>
    }
</div>



{/* Lists of teams Section   */}
<div className="flex flex-row flex-wrap gap-2  p-2 mt-2">

    {/* Event Rankings Section   */}
    <div className="flex flex-col gap-2 w-70">
        <div className="grid grid-cols-[3fr_1fr] gap-2 ">
            <h1 className="text-center text-lg font-bold">Event Rankings</h1>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" onClick={() => setShowEventRankings(!showEventRankings)}>
                {showEventRankings ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </button>
        </div>
        {showEventRankings && rankings.length > 0 && 
        <div className="flex flex-col w-full gap-2">
            {displayRankings.map((ranking, index) => (
                <div key={index} 
                className="grid grid-cols-[1fr_1fr_3fr] gap-2 w-full bg-neutral-800 text-white text-xs rounded-xl justify-center place-items-center"
                onClick={() => addSelection(ranking.teamNumber)}>
                    <p className="text-center font-bold text-sm my-1" >{ranking.rank}</p>
                    <p className="text-center font-bold text-sm my-1" >{ranking.teamNumber}</p>
                    <p className="text-center font-bold text-[8px] my-1" >{getTeamName(ranking.teamNumber)}</p>
                </div>
            ))}
        </div>
        }
    </div>

    {/* for each picklist, render picklist html */}
    




    <div className="flex flex-col gap-2 w-70">
        <button className=" block w-50 text-lg font-bold justify-center place-items-center" onClick={(() => setShowForm(true))}><CirclePlus /> Add a Pick List</button>
    </div>




</div>


    {/* Add Edit PickList Form */}
    {showForm && 
        <div className="fixed top-0 left-0 w-screen h-full z-150 p-4 bg-blue-950 text-white text-xs  font-bold overflow-y-auto">
            <div className="grid grid-cols-[4fr_1fr] justify-between">
                <div className="p-2 text-left folt-bold text-lg">Pick List Editor</div>
                <div className="p-2 text-right"><button onClick={(() => setShowForm(false))}><CircleX /></button></div>
            </div>
            
            <AlliancePickForm eventCode={eventCode} list={''} closeForm={() => setShowForm(false)} />
            
        </div>
    }






</div>

)}

export default AllianceTools;
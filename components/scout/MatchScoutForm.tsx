'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


// My Page is the definition of visual clutter and chaos
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { IMatchScout } from "@/models/scout/MatchScout"
import storeMatch from "@/lib/scout/storeMatch"
import getMatch from "@/lib/scout/getMatch"
import { set } from "mongoose";

interface IProps {
    teamNumber: string,
    matchNumber: string,
    eventCode: string,
    tournamentLevel: string,
    position: string,
    closeForm: () => void
}

const MatchScoutForm = ({teamNumber, matchNumber, eventCode, tournamentLevel, position, closeForm}: IProps) => {
    const [Fuel1, setFuel1] = useState(0)
    const [Fuel2, setFuel2] = useState(0)
    const [Fuel3, setFuel3] = useState(0)
    const [Fuel4, setFuel4] = useState(0)
    const [Shift, setShift] = useState("Auto")
    // 0-1 = Herd, 2-3 = Pass, 4-5 = Defense

    const [stuff,setStuff] = useState({hn:false,ho:false,pn:false,po:false,dn:false,do:false})
    const [DeadOrAlive,setDeadOrAlive] = useState({dead:false,broke:false})

    useEffect(() => {
            const fetchMatchScout = async () => {
                const matchID = eventCode + '-' + tournamentLevel + '-' + matchNumber.toString() + '-' + teamNumber + '-' + position;
                const matchScout = await getMatch(matchID);
                if (matchScout !== null) {
                    const savedData = JSON.parse(matchScout);
                    setFuel1(savedData.autoLaunches);
                    setFuel2(savedData.firstShiftLauches);
                    setFuel3(savedData.secondShiftLauches);
                    setFuel4(savedData.endgameLaunches);
                    setDeadOrAlive({
                        dead: savedData.robotDied === 1 ? true : false,
                        broke: savedData.robotBroke === 1 ? true : false,
                    });
                    setStuff({
                        hn: savedData.passHerdNeutral === 1 ? true : false,
                        ho: savedData.passHerdOpposing === 1 ? true : false,
                        pn: savedData.passLaunchedNeutral === 1 ? true : false,
                        po: savedData.passLaunchedOpposing === 1 ? true : false,
                        dn: savedData.defenseNeutral === 1 ? true : false,
                        do: savedData.defenseOpposing === 1 ? true : false,
                    })

                    
                }
            }
            fetchMatchScout();
        }, []);
    
    
    const RemoveFuel = (Amount: number) => {
        if (Shift === "Auto") {
             setFuel1(Fuel1 - Amount)
        } else if (Shift === "First") {
            setFuel2(Fuel2 - Amount)
        } else if (Shift === "Second") {
            setFuel3(Fuel3 - Amount)
        } else if (Shift === "EndGame") {
            setFuel4(Fuel4 - Amount)
        }
    }
    useEffect(() => {
         if (Fuel4 < 0) {
                setFuel4(0)
            }
        if (Fuel3 < 0) {
                setFuel3(0)
            }
        if (Fuel2 < 0) {
                setFuel2(0)
            }
        if (Fuel1 < 0) {
                setFuel1(0)
            }
    }, [Fuel1,Fuel2,Fuel3,Fuel4])

    const handleStoreData = async () => {
        const matchData = {
            matchID: eventCode + '-' + tournamentLevel + '-' + matchNumber.toString() + '-' + teamNumber + '-' + position,
            teamNumber: teamNumber,
            scoutTeamNumber: '',
            eventCode: eventCode,
            tournamentLevel: tournamentLevel,
            matchNumber: matchNumber,
            alliancePosition: position,
            autoLaunches: Fuel1,
            firstShiftLauches: Fuel2,
            secondShiftLauches: Fuel3,
            endgameLaunches: Fuel4,
            robotDied: DeadOrAlive.dead ? 1 : 0,
            robotBroke: DeadOrAlive.broke ? 1 : 0,
            passHerdNeutral: stuff.hn ? 1 : 0,
            passHerdOpposing: stuff.ho ? 1 : 0,
            passLaunchedNeutral: stuff.pn ? 1 : 0,
            passLaunchedOpposing: stuff.po ? 1 : 0,
            defenseNeutral: stuff.dn ? 1 : 0,
            defenseOpposing: stuff.do ? 1 : 0,
            updatedAt: new Date(),
        }



        const response = await storeMatch(matchData);
        if (response.result) {
            closeForm();
        }
    }


    return (
        <div className="w-full h-full justify-center place-items-center  overflow-x-clip">
                <div className="grid grid-cols-4 w-full text-white text-5xl text-center mt-10">
                    <p>{Fuel1}</p>
                    <p>{Fuel2}</p>
                    <p>{Fuel3}</p>
                    <p>{Fuel4}</p>
                </div>



                <div className="grid grid-cols-4 w-full mt-3">
                <button onClick={() => setShift("Auto")} className={`text-white p-2 rounded-lg w-20 h-15  border-3 ${Shift==="Auto" ? "bg-blue-700":"bg-gray-700"}`}>
                    Auto
                </button>
                <button onClick={() => setShift("First")} className={`text-white p-2 rounded-lg w-20 h-15  border-3 ${Shift==="First" ? "bg-blue-700":"bg-gray-700"}`}>
                    First Shift
                </button>
                 <button onClick={() => setShift("Second")} className={`text-white p-2 rounded-lg w-20 h-15  border-3 ${Shift==="Second" ? "bg-blue-700":"bg-gray-700"}`}>
                    Second Shift
                </button>
                 <button onClick={() => setShift("EndGame")} className={`text-white p-2 rounded-lg w-20 h-15 border-3 ${Shift==="EndGame" ? "bg-blue-700":"bg-gray-700"}`}>
                    End Game
                </button>
            </div>
            

            <div className="grid grid-cols-4 w-full  mt-2">
                <button  onClick={() => RemoveFuel(-10)} className="text-white bg-green-500 border-3 border-green-700 rounded-3xl w-20 h-20 font-bold text-3xl ">
                    +10
                </button>
                 <button onClick={() => RemoveFuel(-5)}className="text-white bg-green-500 border-3 border-green-700 rounded-3xl w-20 h-20 font-bold text-3xl ">
                    +5
                </button>
                 <button onClick={() => RemoveFuel(-1)}className="text-white bg-green-500 border-3 border-green-700 rounded-3xl w-20 h-20 font-bold text-3xl ">
                    +1
                </button>
                 <button onClick={() => RemoveFuel(5)} className="text-white bg-red-500 border-3 border-red-700 rounded-3xl w-20 h-20 font-bold text-3xl ">
                    -5
                </button>
        </div>
        <div className="bg-blue-400 w-full h-1.5 mt-6 rounded-4xl"></div>
        <div className="grid grid-cols-2 w-full mt-4 text-center text-lg">
              <p>Neutral Zone</p>
              <p>Opposing Zone</p>
        </div>
        <div className="grid grid-cols-2 w-full mt-2 justify-center place-items-center">
            <button onClick={() => setStuff({...stuff, hn:!stuff.hn})} className={`${stuff.hn ? "bg-blue-700":"bg-gray-700"} rounded-3xl h-10 border-4 w-30 mt-3`}>
                Herd
            </button>
            <button onClick={() => setStuff({...stuff, ho:!stuff.ho})} className={`${stuff.ho ? "bg-blue-700":"bg-gray-700"} rounded-3xl h-10 border-4 w-30  mt-3`}>
                Herd
            </button>

            <button  onClick={() => setStuff({...stuff, pn:!stuff.pn})} className={`${stuff.pn ? "bg-blue-700":"bg-gray-700"} rounded-3xl h-10 border-4 w-30  mt-3`}>
                Pass
            </button>
            <button onClick={() => setStuff({...stuff, po:!stuff.po})} className={`${stuff.po ? "bg-blue-700":"bg-gray-700"} rounded-3xl h-10 border-4 w-30  mt-3`}>
                Pass
            </button>

            <button  onClick={() => setStuff({...stuff, dn:!stuff.dn})} className={`${stuff.dn ? "bg-blue-700":"bg-gray-700"} rounded-3xl h-10 border-4 w-30  mt-3`}>
                Defense
            </button>
            <button onClick={() => setStuff({...stuff, do:!stuff.do})} className={`${stuff.do ? "bg-blue-700":"bg-gray-700"} rounded-3xl h-10 border-4 w-30  mt-3`}>
                Defense
            </button>
        </div>
        <div className="bg-blue-400 w-full h-1.5 mt-6 rounded-4xl"></div>
        <div className="grid grid-cols-2 w-full mt-4 justify-center place-items-center">
            <button onClick={() => setDeadOrAlive({...DeadOrAlive, dead:!DeadOrAlive.dead})} className={`${DeadOrAlive.dead ? "bg-blue-700":"bg-gray-700"} w-22 h-20 rounded-2xl`}>
                Robot DIED
            </button>
            <button onClick={() => setDeadOrAlive({...DeadOrAlive, broke:!DeadOrAlive.broke})} className={`${DeadOrAlive.broke ? "bg-blue-700":"bg-gray-700"} w-22 h-20 rounded-2xl`}>
                Robot BROKE
            </button>
        </div>
        <div className="bg-blue-400 w-full h-1.5 mt-6 rounded-4xl"></div>
        <div className="grid grid-cols-1 place-items-center mt-4 p-1 w-full">
                        <button className="bg-neutral-700 w-full p-2 rounded-lg h-16" onClick={() => handleStoreData()}>Save Match Data</button>
                    </div>
        </div>
    )
}

export default MatchScoutForm;
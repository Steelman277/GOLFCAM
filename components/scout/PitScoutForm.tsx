'use client'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SideBar from '@/components/app/SideBar';
import { Checkbox } from '@/components/ui/checkbox';
import { CardContent, CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { IPitScout } from "@/models/scout/PitScout"
import storePitScout from '@/lib/scout/storePitScout';
import getPitScout from '@/lib/scout/getPitScout';
import { toast } from 'sonner';

const emptyPitScout: IPitScout = {
  pitscoutID: '',
  teamNumber: '',
  scoutTeamNumber: '',
  eventCode: '',
  maxFuelCarry: 0,
  PassPosition: '',
  scoringPosition: '',
  autonPath: '',
  canGoThroughTrench: false,
  intakeType: '',
  autonClimb: 0,
  typeHopper: '',
  multishot: 0,
  teleopClimb: '',
  launchSpeed: 0,
  weight: 0,
  //meta data for the file. 
  createdAt: new Date(),
  updatedAt: new Date(),
}

interface Iprops  {
  eventCode: string,
  teamNumber: string,
  closeForm: () => void,
}

const pitScout = ({eventCode, teamNumber, closeForm}: Iprops) => {
  const [data, setData] = useState<IPitScout>({...emptyPitScout});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { appEvent, setAppEvent } = useAppContext();

  useEffect(() => {
    const fetchPitScout = async () => {
      const pitscoutID = eventCode + '-' + teamNumber;
      setData({...emptyPitScout, pitscoutID: pitscoutID, eventCode: eventCode, teamNumber: teamNumber});
      const pitScoutExisting = await getPitScout(pitscoutID);
      if (pitScoutExisting !== null) {
        setData(JSON.parse(pitScoutExisting));
      }
    }
    fetchPitScout();
  }, []);

    const handleStorePitScout = async () => {
        try {
            const response = await storePitScout(data)
            setSaving(true)
            if (response.result){
                setSuccess('save successful');
                toast.success('Pit Report Saved Successfully');
                closeForm();
            }
        } catch(err) {
            setError('an error occoured when saving the pit scout data. please check connection and try again later.');
            console.log(err);
        }
    }
    
return (
    <>
   
   <Card className="">
        <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
            <Label>How much fuel you carry?</Label>
            <Input
                id="fuelCount"
                type="number"
                required
                placeholder='1234'
                value={data.maxFuelCarry}
                onChange={(e) => setData({...data, maxFuelCarry: e.target.valueAsNumber})}
                />
        </div>
        <div className="flex flex-col gap-3">
            <Label>How do you primarily pass fuel?</Label>
            <div className="flex flex-row gap-2 p-2">
                <button className={`${data.PassPosition === 'Push' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, PassPosition: 'Push'})}>Push</button>
                <button className={`${data.PassPosition === 'Launch' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, PassPosition: 'Launch'})}>Launch</button>
                <button className={`${data.PassPosition === 'Don\'t Pass' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, PassPosition: 'Don\'t Pass'})}>Don't Pass</button>
            </div>
        </div>
        <div className="flex flex-col gap-3">
            <Label>What position can you score from?</Label>
            <div className="flex flex-row gap-2 p-2">
                <button className={`${data.scoringPosition === 'Full Zone' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, scoringPosition: 'Full Zone'})}>Full Zone</button>
                <button className={`${data.scoringPosition === '3/4 Zone' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, scoringPosition: '3/4 Zone'})}>3/4 Zone</button>
                <button className={`${data.scoringPosition === 'Center Zone' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, scoringPosition: 'Center Zone'})}>Center Zone</button>
                <button className={`${data.scoringPosition === 'Can\'t Score' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, scoringPosition: 'Can\'t Score'})}>Can't Score</button>
            </div>
        </div>

        <div className="flex flex-col gap-3">
            <Label>What is your intake type?</Label>
            <div className="flex flex-row gap-2 p-2">
                <button className={`${data.intakeType === 'Through Bumper' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, intakeType: 'Through Bumper'})}>Through Bumper</button>
                <button className={`${data.intakeType === 'Over Bumper' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, intakeType: 'Over Bumper'})}>Over Bumper</button>
                <button className={`${data.intakeType === 'Can\'t Intake' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, intakeType: 'Can\'t Intake'})}>Can't Intake</button>
               
            </div>
        </div>
        <div className="flex flex-col gap-3">
        <Label>What is the robot's weight?</Label>
            <Input
                id='weight'
                type="number"
                required
                value={data.weight}
                onChange={(e) => setData({...data, weight: e.target.valueAsNumber})}
                />

        </div>

        <div className="flex flex-col gap-3">
            <Label>Can you go through the trench?</Label>
            <div className="flex flex-row gap-2 p-2">
                <button className={`${data.canGoThroughTrench ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, canGoThroughTrench: true})}>Yes</button>
                <button className={`${!data.canGoThroughTrench? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, canGoThroughTrench: false})}>No</button>
               
            </div>
        </div>

        <div className="flex flex-col gap-3">
            <Label>Do you climb in Auton?</Label>
            <div className="flex flex-row gap-2 p-2">
                <button className={`${data.autonClimb === 1 ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, autonClimb: 1})}>Yes</button>
                <button className={`${data.autonClimb === 0 ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, autonClimb: 0})}>No</button>
               
            </div>
       
        </div>
        <div className="flex flex-col gap-3">
            <Label>What is your hopper type?</Label>
            <div className="flex flex-row gap-2 p-2">
                <button className={`${data.typeHopper === 'Open Hopper' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, typeHopper: 'Open Hopper'})}>Open Hopper</button>
                <button className={`${data.typeHopper === 'Closed Hopper' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, typeHopper: 'Closed Hopper'})}>Closed Hopper</button>
                <button className={`${data.typeHopper === 'No Hopper' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, typeHopper: 'No Hopper'})}>No Hopper</button>
               
            </div>
        </div>
        <div className="flex flex-col gap-3"> 
            <Label>How many fuel do they launch at one time?</Label>
            <Input
            id="launchSpeed"
            type="number"
            required
            placeholder="123456"
            value={data.launchSpeed}
            onChange={(e) => setData({...data, launchSpeed: e.target.valueAsNumber})}
            />
        </div>

        <div className="flex flex-col gap-3">
            <Label>What level of climb can you do in endgame?</Label>
            <div className="flex flex-row gap-2 p-2">
                <button className={`${data.teleopClimb === 'Level 1' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, teleopClimb: 'Level 1'})}>Level 1</button>
                <button className={`${data.teleopClimb === 'Level 2' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, teleopClimb: 'Level 2'})}>Level 2</button>
                <button className={`${data.teleopClimb === 'Level 3' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, teleopClimb: 'Level 3'})}>Level 3</button>
                <button className={`${data.teleopClimb === 'No CLimb' ? 'bg-blue-800' : 'bg-gray-800'} text-white border-2 border-neutral-500 rounded-lg px-2 py-2 font-bold`} 
                    onClick={() => setData({...data, teleopClimb: 'No CLimb'})}>No CLimb</button>
            </div>
        </div>

        <div className="flex flex-col gap-3">
            <Button onClick={handleStorePitScout}>
                {saving ? "Pit Scout Report Saving..." : "Submit Pit Scout Report"}
            </Button>
            {error !== '' && <div className="text-red-500">{error}</div>}
        </div>
        </CardContent>
   </Card>
</>
)
}

export default pitScout
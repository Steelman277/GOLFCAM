import { NextRequest, NextResponse } from 'next/server';

// Define DB COnnection for storing data
import connectDB from '@/lib/db';
import Event from '@/models/frc-events/Event';
import { IEvent } from '@/models/frc-events/Event';
import { ITeam } from '@/models/frc-events/Team';



export async function GET(req: NextRequest) {

    console.log('Fetching Events');

    // Define FRC-Events API URL
    const url = 'https://frc-api.firstinspires.org/v3.0/2026/events';

    // Open DB connection
    await connectDB();

    // Create event counter
    let counter = 0;



    // Fetch data from FRC-Events API
    const response = await fetch(`${url}`,
        {
            headers: {
                'Authorization': `Basic ${process.env.FRC_AUTH}`,
                'Content-Type': 'application/json',
            },
        }
    );
    if (!response.ok) {
        throw new Error('Failed to fetch data from FRC-Events API');
    }
    const data = await response.json();

    // Check if data is empty
    if (data.Events.length === 0) {
        
    }

    // Store data in MongoDB
    for (const event of data.Events) {
        console.log('Processing Event: ', event.code, event.name);
        try{ 
            // get Teams List for Event
            const teamUrl = `https://frc-api.firstinspires.org/v3.0/2026/teams?eventCode=${event.code}`;
            const response = await fetch(`${teamUrl}`,
                {
                    headers: {
                        'Authorization': `Basic ${process.env.FRC_AUTH}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch data from FRC-Events API');
            }
            const data = await response.json();

            // Check if data is empty
            if (data.teams.length === 0) {
                console.log('No teams found for event: ', event.code);
                
            }

            const eventTeams = []
            const eventTeamNumbers: string[] = [];
            for (const team of data.teams) {
                if (eventTeamNumbers.includes(team.teamNumber)) {
                    continue;
                }
                eventTeamNumbers.push(team.teamNumber);
                try{ 
                    //Create Team daocument values
                    const newTeam: ITeam = {
                        number: team.teamNumber,
                        name: team.nameShort,
                    };
                    eventTeams.push(newTeam);
                } catch (error) {
                    console.log(error);
                }
            }

            const byPassEventTeams: ITeam[] = [];

            //Create Team daocument values
            const newEvent: IEvent = {
                code: event.code,
                divisionCode: event.divisionCode,
                name: event.name,
                type: event.type,
                districtCode: event.districtCode,
                city: event.city,
                stateprov: event.stateprov,
                country: event.country,
                dateStart: event.dateStart,
                dateEnd: event.dateEnd,
                teams: eventTeams,
            };

            console.log('newEvent: ', newEvent);


            // Update or insert data into MongoDB
            const save = await Event.findOneAndUpdate(
                { code: event.code },
                newEvent,
                { upsert: true, new: true }
            );

            counter++;
            console.log('processed event: ', event.code);

        } catch (error) {
            console.log(error);

        }
    }

    let message = { result: `Successfully updated ${counter} events.` };

    return NextResponse.json(message);
}
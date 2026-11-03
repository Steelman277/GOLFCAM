import { NextRequest, NextResponse } from 'next/server';

// Define DB COnnection for storing data
import connectDB from '@/lib/db';
import Team from '@/models/frc-events/Team';
import { ITeam } from '@/models/frc-events/Team';
import { headers } from 'next/headers';


export async function GET(req: NextRequest) {

    // Define FRC-Events API URL
    const url = 'https://frc-api.firstinspires.org/v3.0/2026/teams';

    // Open DB connection
    await connectDB();

    // Create team counter
    let counter = 0;

    for (let i = 1; i <= 100; i++) {

        // Fetch data from FRC-Events API
        //console.log(`Fetching data from ${url}?page=${i}`);
        const response = await fetch(`${url}?page=${i}`,
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
            break;
        }

        // Store data in MongoDB
        for (const team of data.teams) {
            try{ 
                //Create Team daocument values
                const newTeam: ITeam = {
                    number: team.teamNumber,
                    name: team.nameShort,
                };
                // Update or insert data into MongoDB
                const save = await Team.findOneAndUpdate(
                    { number: newTeam.number },
                    { $set: newTeam },
                    { upsert: true, new: true }
                );
                counter++;
            } catch (error) {
                console.log(error);

            }
        }
    }
    let message = { result: `Successfully updated ${counter} teams.` };

    return NextResponse.json(message);
}
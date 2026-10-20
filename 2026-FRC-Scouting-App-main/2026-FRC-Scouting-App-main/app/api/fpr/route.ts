import { NextRequest, NextResponse } from 'next/server';
import { multipleLinearRegression } from '@/lib/fpr/fuelperformance';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    // Example usage:
    const X = [
        [1, 0, 1],  // Feature set for observation 1
        [0, 0, 1],  // Observation 2
        [0, 1, 1],  // Observation 3
        [1, 0, 0]   // Observation 4
    ];
    const y = [36, 24, 52, 20];

    try {
        const beta: number[] = await multipleLinearRegression(X, y);
        console.log("Regression Coefficients (β):", beta);
        console.log(`Model: y = ${beta[0].toFixed(3)} + ${beta[1].toFixed(3)}*x1 + ${beta[2].toFixed(3)}*x2`);
        return NextResponse.json(beta);
    } catch (err) {
        console.error("Error:", (err as Error).message);
        return NextResponse.json({ error: (err as Error).message });
    }



    
}
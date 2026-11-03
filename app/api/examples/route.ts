import { NextRequest, NextResponse } from "next/server"

import { getAllExamples } from "@/lib/ServerSideFunctions"
import { IExample } from "@/models/example/Example"


export async function GET(req: NextRequest) {
    const result = await getAllExamples()
    if (result.success) {
        return NextResponse.json(result.data)
    }
    return NextResponse.json({ success: false, message: result.message })
}

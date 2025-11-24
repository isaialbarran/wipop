import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
    const body = await request.text()

    try { 

        console.log(body)
        return NextResponse.json({ message: 'Webhook handler' })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try { 

        return NextResponse.json({ message: 'Webhook handler' })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}
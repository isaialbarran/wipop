import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Notificación recibida:', body)

    // Aquí puedes procesar la notificación
    // Por ejemplo: guardar en base de datos, enviar email, etc.

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error procesando notificación:', error)
    return NextResponse.json({ error: 'Error procesando notificación' }, { status: 500 })
  }
}

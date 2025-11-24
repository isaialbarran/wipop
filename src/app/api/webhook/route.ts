import { NextRequest, NextResponse } from 'next/server'
import { getStripeForServer } from '@/lib/stripe'
import { createClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  const stripe = getStripeForServer()

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  console.log('Received Stripe event:', {
    id: event.id,
    type: event.type,
    created: event.created,
    data: event.data,
  })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.payment_status === 'paid') {
          const { packageId, userId } = session.metadata!
          
          // Create order record using server client
          const supabase = await createClient()
          const { error } = await supabase
            .from('orders')
            .insert({
              user_id: userId,
              package_id: packageId,
              stripe_payment_intent_id: session.payment_intent as string,
              amount: session.amount_total! / 100, // Convert from cents
              status: 'completed',
            })

          if (error) {
            console.error('Error creating order:', error)
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
          }
        }
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update order status to failed
        const supabase = await createClient()
        const { error } = await supabase
          .from('orders')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (error) {
          console.error('Error updating order status:', error)
        }
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

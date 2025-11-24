import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

/**
 * Input type for creating a Wipop checkout session
 */
export type WipopCreateCheckoutInput = {
  amount: number;
  capture: boolean;
  description: string;
  send_email: boolean;
  currency: string;
  origin: string;
  product_type: string;
  terminal: {
    id: number;
  };
  use_cof: boolean;
  redirect_url: string;
  order_id: string;
  customer: {
    name: string;
    last_name: string;
    email: string;
    phone_number: string;
    external_id: string;
  };
};

const createCheckoutSession = async ({
  name, amount
}: {
  name: string;
  amount: number;
}) => {
  try { 
      const input: WipopCreateCheckoutInput = {
          "amount": amount,
          "description": name,
          "send_email": false,
          "currency": "EUR",
          "origin": "BOTON_DE_PAGO",
          "capture": false,
          "use_cof": true,
          "product_type": "PAYMENT_GATEWAY",
          "terminal": {
              "id": 1
          },
          "redirect_url": "https://nodex.es",
          "order_id": `${Math.floor(1000 + Math.random() * 9000)}${[...Array(8)].map(() => Math.random().toString(36)[2]).join('')}`,
          "customer": {
              "name": "Ivan",
              "last_name": "Ruiz",
              "email": "ivan.ruiz@nodex.es",
              "phone_number": "605842890",
              "external_id": "1"
          }
      }

      console.log(input)
      const basicAuth = Buffer.from(`sk_28ddec53c8b5491ab8d20d7cabf4dd4c:`).toString('base64');
      console.log('basicAuth:');
      console.log(basicAuth)
      const response = await fetch('https://api.wipop.es/k/v1/mn09ff5s6adgszlkvwb8/checkouts', {
          method: 'POST',
          body: JSON.stringify(input),
          headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Content-Type': 'application/json'
          }
      })
      console.log('response:');

      const data = await response.json()
      console.log(data)

      return data              
  } catch (error) {
      console.log('error:');
      console.log(error)
      console.error('Error creating checkout session:', error)
      
      throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { packageId } = await request.json()

    if (!packageId) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the package details
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .eq('is_active', true)
      .single()

    if (packageError || !packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    const session = await createCheckoutSession({
      name: packageData.name,
      amount: Math.round(packageData.price),
    })

    return NextResponse.json(
      { redirect: session.checkout_link },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const { packageId } = await request.json()

//     if (!packageId) {
//       return NextResponse.json({ error: 'Package ID is required' }, { status: 400 })
//     }

//     const supabase = await createClient()
    
//     // Get the current user
//     const { data: { user }, error: authError } = await supabase.auth.getUser()
    
//     if (authError || !user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     // Get the package details
//     const { data: packageData, error: packageError } = await supabase
//       .from('packages')
//       .select('*')
//       .eq('id', packageId)
//       .eq('is_active', true)
//       .single()

//     if (packageError || !packageData) {
//       return NextResponse.json({ error: 'Package not found' }, { status: 404 })
//     }

//     const stripe = getStripeForServer()
//     // Create Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'eur',
//             product_data: {
//               name: packageData.name,
//               description: packageData.description,
//             },
//             unit_amount: Math.round(packageData.price * 100), // Convert to cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
//       metadata: {
//         packageId: packageData.id,
//         userId: user.id,
//       },
//       customer_email: user.email,
//     })

//     return NextResponse.json({ sessionId: session.id })
//   } catch (error) {
//     console.error('Error creating checkout session:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

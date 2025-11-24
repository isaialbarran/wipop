# NodeX Services Landing Page

A modern Next.js application for selling consulting packages with Supabase authentication and Stripe payments.

## Features

- **Next.js 14** with TypeScript and App Router
- **Supabase** for authentication and database
- **Stripe** for payment processing
- **CSS Modules** for styling
- **Responsive design** with modern UI/UX
- **User dashboard** for managing purchased packages
- **Secure checkout flow** with webhook handling

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, CSS Modules
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: CSS Modules with modern design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nodex-services-landing
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. This will create the necessary tables and policies

### Stripe Setup

1. Create a Stripe account and get your API keys
2. Set up webhooks pointing to `https://yourdomain.com/api/webhook`
3. Configure the webhook to listen for:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── checkout/          # Checkout flow pages
│   ├── dashboard/         # User dashboard
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── Auth/              # Authentication components
│   ├── Header/            # Navigation header
│   └── PackageCard/       # Package display component
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── supabase-client.ts # Browser client
│   ├── supabase-server.ts # Server client
│   └── stripe.ts          # Stripe configuration
└── types/                 # TypeScript type definitions
    └── database.ts        # Database types
```

## Key Features

### Authentication
- User registration and login
- Protected routes
- User profile management
- Session handling

### Package Management
- Display consulting packages
- Package details and pricing
- Feature lists and descriptions

### Payment Processing
- Secure Stripe checkout
- Webhook handling for payment confirmation
- Order management
- Payment status tracking

### User Dashboard
- View purchased packages
- Order history
- Package access
- Invoice downloads

## API Routes

- `POST /api/create-checkout-session` - Create Stripe checkout session
- `POST /api/webhook` - Handle Stripe webhooks
- `GET /api/checkout-session` - Retrieve checkout session details

## Database Schema

### Tables
- `packages` - Consulting package information
- `orders` - User purchase records
- `user_profiles` - Extended user information

### Security
- Row Level Security (RLS) enabled
- User-specific data access
- Secure authentication flow

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- Ensure Node.js 18+ support
- Set all environment variables
- Configure webhook URLs for Stripe

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email contact@nodexservices.com or create an issue in the repository.
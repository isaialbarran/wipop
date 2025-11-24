-- -- Enable Row Level Security
-- ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  stripe_price_id VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Packages: Public read access
CREATE POLICY "Packages are viewable by everyone" ON packages
  FOR SELECT USING (is_active = true);

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow system to insert orders (for webhook)
CREATE POLICY "System can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow system to update orders (for webhook)
CREATE POLICY "System can update orders" ON orders
  FOR UPDATE USING (true);

-- User profiles: Users can only see and modify their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Enable RLS on all tables
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample packages
INSERT INTO packages (name, description, price, features, stripe_price_id) VALUES
(
  'Basic Consulting',
  'Perfect for small businesses looking to get started with professional consulting services.',
  299.00,
  '["1-hour consultation", "Basic strategy document", "Email support for 1 week", "Follow-up call"]',
  'price_basic_consulting'
),
(
  'Premium Consulting',
  'Comprehensive consulting package for growing businesses that need detailed guidance.',
  599.00,
  '["3-hour consultation", "Detailed strategy document", "Email support for 1 month", "2 follow-up calls", "Implementation roadmap"]',
  'price_premium_consulting'
),
(
  'Enterprise Consulting',
  'Full-service consulting package for established businesses ready to scale.',
  1299.00,
  '["8-hour consultation", "Comprehensive strategy document", "Priority email support for 3 months", "4 follow-up calls", "Implementation roadmap", "Quarterly review", "Custom templates"]',
  'price_enterprise_consulting'
);

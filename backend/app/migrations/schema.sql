-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (custom authentication)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (extends users)
CREATE TABLE public.profiles (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pack_id TEXT DEFAULT 'free',
  pack_expires_at TIMESTAMP WITH TIME ZONE,
  is_admin BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Stripe subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  pack_id TEXT NOT NULL,
  status TEXT NOT NULL, -- active, canceled, past_due, etc.
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stripe payments/transactions table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  pack_id TEXT NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'chf',
  status TEXT NOT NULL, -- succeeded, failed, pending
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  pack_id TEXT, -- Track which pack enabled this message
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily message limits table
CREATE TABLE public.user_limits (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  messages_today INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE
);

-- Live stats table (editable by admin)
CREATE TABLE public.live_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stat_key TEXT UNIQUE NOT NULL,
  stat_label TEXT NOT NULL,
  stat_value TEXT NOT NULL,
  stat_source TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Masterclass progress table
CREATE TABLE public.masterclass_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, module_id)
);

-- Quiz results table
CREATE TABLE public.quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV templates table
CREATE TABLE public.cv_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- tech, finance, medicine, etc.
  description TEXT,
  template_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User CVs table (saved instances)
CREATE TABLE public.user_cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.cv_templates(id),
  name TEXT NOT NULL,
  cv_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cantonal data table
CREATE TABLE public.cantonal_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  canton_code TEXT UNIQUE NOT NULL,
  canton_name TEXT NOT NULL,
  language TEXT NOT NULL,
  immigration_info JSONB NOT NULL,
  citizenship_info JSONB NOT NULL,
  embassy_info JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin activity log
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.profiles(id),
  action_type TEXT NOT NULL,
  action_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email leads table (for marketing/lead generation)
CREATE TABLE IF NOT EXISTS public.email_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  lead_magnet VARCHAR(255),
  source VARCHAR(100) DEFAULT 'website',
  subscribed BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email)
);

-- Consultations table (for booking consultation calls)
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  consultation_type TEXT NOT NULL, -- 'quick' (30min CHF 200), 'full' (60min CHF 500), 'support' (package CHF 1500)
  preferred_date TIMESTAMP WITH TIME ZONE,
  timezone TEXT DEFAULT 'UTC',
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, canceled
  amount INTEGER NOT NULL, -- in cents (CHF 200 = 20000)
  stripe_payment_intent_id TEXT,
  notes TEXT,
  meeting_link TEXT, -- Zoom/Google Meet link
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at);

-- Email sequences tracking table
CREATE TABLE IF NOT EXISTS public.email_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  sequence_type TEXT NOT NULL, -- 'welcome', 'value', 'upgrade', 'consultation_followup'
  step_index INTEGER NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sequence_type, step_index)
);

CREATE INDEX IF NOT EXISTS idx_email_sequences_email ON public.email_sequences(email);
CREATE INDEX IF NOT EXISTS idx_email_sequences_user_id ON public.email_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_type ON public.email_sequences(sequence_type);

CREATE INDEX IF NOT EXISTS idx_email_leads_email ON public.email_leads(email);
CREATE INDEX IF NOT EXISTS idx_email_leads_created_at ON public.email_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_email_leads_subscribed ON public.email_leads(subscribed) WHERE subscribed = true;

-- RLS Policies (disabled for custom auth)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_limits ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.masterclass_progress ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_cvs ENABLE ROW LEVEL SECURITY;

-- RLS Policies commented out for custom authentication
-- Policies for profiles
-- CREATE POLICY "Users can view own profile"
--   ON public.profiles FOR SELECT
--   USING (auth.uid() = id);
--
-- CREATE POLICY "Users can update own profile"
--   ON public.profiles FOR UPDATE
--   USING (auth.uid() = id);
--
-- -- Policies for chat messages
-- CREATE POLICY "Users can insert own messages"
--   ON public.chat_messages FOR INSERT
--   WITH CHECK (auth.uid() = user_id);
--
-- CREATE POLICY "Users can view own messages"
--   ON public.chat_messages FOR SELECT
--   USING (auth.uid() = user_id);
--
-- -- Policies for subscriptions
-- CREATE POLICY "Users can view own subscriptions"
--   ON public.subscriptions FOR SELECT
--   USING (auth.uid() = user_id);
--
-- -- Policies for payments
-- CREATE POLICY "Users can view own payments"
--   ON public.payments FOR SELECT
--   USING (auth.uid() = user_id);
--
-- -- Policies for masterclass progress
-- CREATE POLICY "Users can manage own progress"
--   ON public.masterclass_progress FOR ALL
--   USING (auth.uid() = user_id);
--
-- -- Policies for quiz results
-- CREATE POLICY "Users can manage own quiz results"
--   ON public.quiz_results FOR ALL
--   USING (auth.uid() = user_id);
--
-- -- Policies for user CVs
-- CREATE POLICY "Users can manage own CVs"
--   ON public.user_cvs FOR ALL
--   USING (auth.uid() = user_id);
--
-- -- Admin policies (is_admin check)
-- CREATE POLICY "Admins can view all profiles"
--   ON public.profiles FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE id = auth.uid() AND is_admin = TRUE
--     )
--   );
--
-- CREATE POLICY "Admins can view all chat messages"
--   ON public.chat_messages FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE id = auth.uid() AND is_admin = TRUE
--     )
--   );
--
-- CREATE POLICY "Admins can view all subscriptions"
--   ON public.subscriptions FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE id = auth.uid() AND is_admin = TRUE
--     )
--   );

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_masterclass_progress_updated_at BEFORE UPDATE ON public.masterclass_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_cvs_updated_at BEFORE UPDATE ON public.user_cvs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default stats
INSERT INTO public.live_stats (stat_key, stat_label, stat_value, stat_source, display_order) VALUES
('permit_updates', 'Permit Monitoring Status', 'Updated Weekly', 'SEM', 1),
('foreign_residents', 'Foreign Residents', '2.5M (29%)', 'FSO', 2),
('avg_processing', 'Avg Processing Time', '8-12 Weeks', 'SEM', 3);

-- Insert sample canton data
INSERT INTO public.cantonal_data (canton_code, canton_name, language, immigration_info, citizenship_info) VALUES
('ZH', 'Zurich', 'de', '{"quota_multiplier": 1.2, "priority_jobs": ["IT", "Finance", "Engineering"]}', '{"avg_processing_months": 12, "requirements": "Strict German B2+"}'),
('GE', 'Geneva', 'fr', '{"quota_multiplier": 1.5, "priority_jobs": ["Finance", "Diplomacy", "Medicine"]}', '{"avg_processing_months": 10, "requirements": "French B2 required"}'),
('BS', 'Basel', 'de', '{"quota_multiplier": 1.1, "priority_jobs": ["Pharma", "Chemistry", "Biotech"]}', '{"avg_processing_months": 11, "requirements": "German B2"}'),
('VD', 'Vaud', 'fr', '{"quota_multiplier": 1.3, "priority_jobs": ["Finance", "Tech", "Tourism"]}', '{"avg_processing_months": 10, "requirements": "French B1+"}'),
('BE', 'Bern', 'de', '{"quota_multiplier": 1.0, "priority_jobs": ["Government", "Agriculture", "IT"]}', '{"avg_processing_months": 12, "requirements": "German B1+"}');


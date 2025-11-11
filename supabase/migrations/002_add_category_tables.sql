-- Create supplier_categories reference table
CREATE TABLE IF NOT EXISTS public.supplier_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create checklist_categories reference table
CREATE TABLE IF NOT EXISTS public.checklist_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rsvp_statuses reference table
CREATE TABLE IF NOT EXISTS public.rsvp_statuses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default supplier categories
INSERT INTO public.supplier_categories (name, display_order) VALUES
  ('Venue', 1),
  ('Catering', 2),
  ('Photography', 3),
  ('Videography', 4),
  ('Florist', 5),
  ('Music/DJ', 6),
  ('Decor', 7),
  ('Transportation', 8),
  ('Other', 9)
ON CONFLICT (name) DO NOTHING;

-- Insert default checklist categories
INSERT INTO public.checklist_categories (name, label, display_order) VALUES
  ('all', 'All Tasks', 1),
  ('venue', 'Venue', 2),
  ('vendors', 'Vendors', 3),
  ('guests', 'Guests', 4),
  ('food', 'Food & Drink', 5),
  ('decor', 'Decor', 6),
  ('planning', 'Planning', 7)
ON CONFLICT (name) DO NOTHING;

-- Insert default RSVP statuses
INSERT INTO public.rsvp_statuses (name, label, display_order) VALUES
  ('pending', 'Pending', 1),
  ('accepted', 'Accepted', 2),
  ('declined', 'Declined', 3)
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security on category tables
ALTER TABLE public.supplier_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_statuses ENABLE ROW LEVEL SECURITY;

-- Create policies for category tables (read-only for all authenticated users)
CREATE POLICY "Anyone can view supplier categories"
  ON public.supplier_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view checklist categories"
  ON public.checklist_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view RSVP statuses"
  ON public.rsvp_statuses FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS supplier_categories_display_order_idx ON public.supplier_categories(display_order);
CREATE INDEX IF NOT EXISTS checklist_categories_display_order_idx ON public.checklist_categories(display_order);
CREATE INDEX IF NOT EXISTS rsvp_statuses_display_order_idx ON public.rsvp_statuses(display_order);

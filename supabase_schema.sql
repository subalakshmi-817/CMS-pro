-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('staff', 'admin', 'manager')),
  employee_id TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  reporter_id UUID REFERENCES auth.users ON DELETE SET NULL,
  reporter_name TEXT NOT NULL,
  assigned_manager_id UUID REFERENCES auth.users ON DELETE SET NULL,
  assigned_manager_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Complaint Updates Table
CREATE TABLE IF NOT EXISTS complaint_updates (
  id TEXT PRIMARY KEY,
  complaint_id TEXT REFERENCES complaints(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT NOT NULL,
  updated_by UUID REFERENCES auth.users ON DELETE SET NULL,
  updated_by_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_updates ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies for complaints
DROP POLICY IF EXISTS "Everyone can view complaints" ON complaints;
CREATE POLICY "Everyone can view complaints" ON complaints
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can create complaints" ON complaints;
CREATE POLICY "Staff can create complaints" ON complaints
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Admins and assigned managers can update" ON complaints;
CREATE POLICY "Admins and assigned managers can update" ON complaints
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR id = complaints.assigned_manager_id)
    )
  );

-- Policies for updates
DROP POLICY IF EXISTS "Everyone can view updates" ON complaint_updates;
CREATE POLICY "Everyone can view updates" ON complaint_updates
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authorized users can insert updates" ON complaint_updates;
CREATE POLICY "Authorized users can insert updates" ON complaint_updates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
  );

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

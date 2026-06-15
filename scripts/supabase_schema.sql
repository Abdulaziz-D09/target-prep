-- ==============================================================
-- Target Prep Supabase Database Schema
-- Run this script in your Supabase SQL Editor
-- ==============================================================

-- 1. Create User Profiles Table (Extension of auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'student', -- 'student' or 'teacher'
    school TEXT,
    grade_level TEXT,
    birthdate DATE,
    graduation_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for User Profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id);


-- 2. Create Question History Table (For granular tracking)
CREATE TABLE IF NOT EXISTS public.question_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    assignment_id TEXT, -- Could be mock session ID or assignment ID
    question_id TEXT NOT NULL,
    chosen_option TEXT, -- A, B, C, D
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast queries by student and assignment
CREATE INDEX IF NOT EXISTS idx_question_history_student ON public.question_history(student_id);
CREATE INDEX IF NOT EXISTS idx_question_history_assignment ON public.question_history(assignment_id);

-- Enable RLS for Question History
ALTER TABLE public.question_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own history" 
ON public.question_history FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own history" 
ON public.question_history FOR INSERT 
WITH CHECK (auth.uid() = student_id);


-- 3. Create Automated Trigger for new Auth Users
-- This trigger automatically inserts a row into user_profiles when a user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, role, school, grade_level, birthdate)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'school',
    NEW.raw_user_meta_data->>'grade_level',
    NULLIF(NEW.raw_user_meta_data->>'birthdate', '')::DATE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent errors on multiple runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================
-- End of Schema
-- ==============================================================

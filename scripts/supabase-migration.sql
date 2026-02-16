-- Supabase Migration Script (PostgreSQL)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table if not exists public.users (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    password text,
    name text,
    role text default 'USER' check (role in ('USER', 'TUTOR', 'ADMIN', 'SUPER_ADMIN')),
    username text unique,
    avatar text,
    bio text,
    skills jsonb,
    social_links jsonb,
    onboarding_completed boolean default false,
    otp_code text,
    otp_expires_at timestamp with time zone,
    last_login timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Courses Table
create table if not exists public.courses (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    price text,
    difficulty text,
    duration text,
    thumbnail text,
    video_url text,
    instructor_name text,
    instructor_avatar text,
    tutor_id uuid references public.users(id),
    category text,
    status text default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
    created_at timestamp with time zone default now()
);

-- Enrollments Table
create table if not exists public.enrollments (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id),
    course_id uuid references public.courses(id),
    status text default 'active' check (status in ('active', 'completed', 'dropped')),
    progress integer default 0,
    created_at timestamp with time zone default now(),
    unique(user_id, course_id)
);

-- Tutor Requests Table
create table if not exists public.tutor_requests (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id),
    name text not null,
    role text not null,
    email text not null,
    portfolio text,
    expertise text,
    bio text,
    status text default 'PENDING' check (status in ('PENDING', 'APPROVED', 'DECLINED')),
    stage text default 'REVIEW' check (stage in ('REVIEW', 'INTERVIEW', 'VETTING', 'ONBOARDING')),
    created_at timestamp with time zone default now()
);

-- Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.tutor_requests enable row level security;

-- Policies (Simplified for initial setup)
create policy "Public courses are viewable by everyone" on public.courses
    for select using (status = 'APPROVED');

create policy "Users can view their own profile" on public.users
    for select using (auth.uid() = id);

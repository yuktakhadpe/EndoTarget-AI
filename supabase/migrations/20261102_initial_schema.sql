-- ====================================================================
-- EndoTarget AI - PostgreSQL Initial Database Schema & RLS Policies
-- Migration: 20261102_initial_schema.sql
-- Description: Sets up persistent storage for user profiles, research
-- papers, AI analysis results, identified targets, ranking preferences,
-- saved targets, and research notes with Row Level Security (RLS)
-- and Supabase Storage bucket for PDF documents.
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 2. User Profiles Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 3. Research Papers Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.research_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    authors TEXT DEFAULT 'Unknown Authors',
    journal TEXT DEFAULT 'Biomedical Literature',
    year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    doi TEXT,
    pmid TEXT,
    file_url TEXT,
    source_type TEXT NOT NULL CHECK (source_type IN ('pdf', 'url')),
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    sample_size TEXT,
    abstract TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_research_papers_user_id ON public.research_papers(user_id);
CREATE INDEX IF NOT EXISTS idx_research_papers_status ON public.research_papers(status);
CREATE INDEX IF NOT EXISTS idx_research_papers_source_type ON public.research_papers(source_type);

-- ====================================================================
-- 4. Research Analysis Results Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.research_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID NOT NULL REFERENCES public.research_papers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    research_objective TEXT,
    main_findings TEXT,
    genes_identified JSONB DEFAULT '[]'::jsonb,
    proteins_identified JSONB DEFAULT '[]'::jsonb,
    biological_pathways JSONB DEFAULT '[]'::jsonb,
    relationship_with_endometriosis TEXT,
    experimental_model TEXT,
    evidence_classification JSONB DEFAULT '{}'::jsonb,
    evidence_distribution JSONB DEFAULT '{}'::jsonb,
    potential_drug_targets JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analysis_paper_id ON public.research_analysis_results(paper_id);
CREATE INDEX IF NOT EXISTS idx_analysis_user_id ON public.research_analysis_results(user_id);

-- ====================================================================
-- 5. Identified Drug Targets Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.identified_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    paper_id UUID REFERENCES public.research_papers(id) ON DELETE SET NULL,
    gene_symbol TEXT NOT NULL,
    target_name TEXT NOT NULL,
    biological_category TEXT,
    clinical_phase TEXT DEFAULT 'Preclinical',
    calculated_score NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_targets_user_id ON public.identified_targets(user_id);
CREATE INDEX IF NOT EXISTS idx_targets_gene_symbol ON public.identified_targets(gene_symbol);

-- ====================================================================
-- 6. Target Ranking Preferences & Weights Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.target_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    weights JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 7. Saved Targets & Bookmarks Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.saved_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_saved_target UNIQUE (user_id, target_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_targets_user_id ON public.saved_targets(user_id);

-- ====================================================================
-- 8. Research Notes Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.research_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_id TEXT,
    category TEXT DEFAULT 'Target Validation',
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_research_notes_user_id ON public.research_notes(user_id);

-- ====================================================================
-- 9. Storage Bucket: research-papers
-- ====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('research-papers', 'research-papers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Users can upload to their own user_id directory
CREATE POLICY "Users can upload own research papers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'research-papers' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read own research papers"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'research-papers' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own research papers"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'research-papers' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- ====================================================================
-- 10. Enable Row Level Security (RLS) on All Tables
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identified_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_notes ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 11. RLS Policies: Multi-User Data Isolation
-- ====================================================================

-- PROFILES
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- RESEARCH PAPERS
CREATE POLICY "Users can view own research papers"
ON public.research_papers FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own research papers"
ON public.research_papers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own research papers"
ON public.research_papers FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own research papers"
ON public.research_papers FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RESEARCH ANALYSIS RESULTS
CREATE POLICY "Users can view own analysis results"
ON public.research_analysis_results FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis results"
ON public.research_analysis_results FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analysis results"
ON public.research_analysis_results FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analysis results"
ON public.research_analysis_results FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- IDENTIFIED TARGETS
CREATE POLICY "Users can view own targets"
ON public.identified_targets FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own targets"
ON public.identified_targets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- TARGET RANKINGS
CREATE POLICY "Users can view own ranking weights"
ON public.target_rankings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own ranking weights"
ON public.target_rankings FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- SAVED TARGETS
CREATE POLICY "Users can view own saved targets"
ON public.saved_targets FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved targets"
ON public.saved_targets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved targets"
ON public.saved_targets FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RESEARCH NOTES
CREATE POLICY "Users can view own research notes"
ON public.research_notes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own research notes"
ON public.research_notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own research notes"
ON public.research_notes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own research notes"
ON public.research_notes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);


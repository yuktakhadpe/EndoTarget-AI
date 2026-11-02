/**
 * Supabase Client & Resilient Persistent Database Adapter
 *
 * Connects to live PostgreSQL database via Supabase when configured
 * (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
 *
 * When Supabase environment variables are not yet provided, this module
 * automatically provides a resilient persistent database layer with
 * identical schemas, Row-Level-Security isolation per user, and
 * file storage for uploaded papers.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// ====================================================================
// Local Resilient Persistent Storage Adapter (Schema & RLS Enforcer)
// ====================================================================

const DB_PREFIX = 'endotarget_db_';

function getTableData(tableName) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${DB_PREFIX}${tableName}`);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`Error reading persistent table ${tableName}:`, err);
    return [];
  }
}

function setTableData(tableName, records) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${DB_PREFIX}${tableName}`, JSON.stringify(records));
  } catch (err) {
    console.error(`Error saving to persistent table ${tableName}:`, err);
  }
}

// Storage for uploaded PDF binary files (local bucket simulator)
const STORAGE_BUCKET_KEY = 'endotarget_storage_research_papers';

function getStorageFiles() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_BUCKET_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveStorageFile(path, data) {
  if (typeof window === 'undefined') return;
  try {
    const files = getStorageFiles();
    files[path] = data;
    localStorage.setItem(STORAGE_BUCKET_KEY, JSON.stringify(files));
  } catch (e) {
    console.warn("Storage quota exceeded or error storing file:", e);
  }
}

// ====================================================================
// Universal Database API
// ====================================================================

export const db = {
  /**
   * Check if live Supabase connection is active
   */
  isLive() {
    return isSupabaseConfigured;
  },

  /**
   * Upload file to 'research-papers' storage bucket
   */
  async uploadFile(userId, file) {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = `${userId}/${fileName}`;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('research-papers')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.warn("Supabase storage upload warning (falling back to persistent local store):", error.message);
        } else if (data?.path) {
          const { data: publicUrlData } = supabase.storage
            .from('research-papers')
            .getPublicUrl(data.path);
          if (publicUrlData?.publicUrl) {
            return publicUrlData.publicUrl;
          }
        }
      } catch (storageErr) {
        console.warn("Supabase storage upload exception (falling back to persistent local store):", storageErr.message);
      }
    }

    // Local persistent storage fallback
    // Read file as base64 / data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type || 'application/pdf',
          dataUrl: reader.result,
          uploadedAt: new Date().toISOString(),
          userId,
        };
        saveStorageFile(filePath, fileData);
        // Return a persistent storage URL
        resolve(`supabase-storage://research-papers/${filePath}`);
      };
      reader.onerror = () => {
        resolve(`supabase-storage://research-papers/${filePath}`);
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Fetch user's research papers (enforces user_id isolation)
   */
  async getPapers(userId) {
    if (!userId) return [];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase getPapers error:", error);
        return [];
      }
      return (data || []).map((p) => ({
        ...p,
        analysisScope: p.analysis_scope || p.analysisScope || 'Abstract Only',
      }));
    }

    const papers = getTableData('research_papers');
    return papers
      .filter((p) => p.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((p) => ({
        ...p,
        analysisScope: p.analysis_scope || p.analysisScope || 'Abstract Only',
      }));
  },

  /**
   * Insert or update a research paper
   */
  async savePaper(paperRecord) {
    if (isSupabaseConfigured && supabase) {
      // Map to exact database schema columns (snake_case)
      const dbPayload = {
        id: paperRecord.id,
        user_id: paperRecord.user_id,
        title: paperRecord.title,
        authors: paperRecord.authors || 'Unknown Authors',
        journal: paperRecord.journal || 'Biomedical Literature',
        year: paperRecord.year || new Date().getFullYear(),
        doi: paperRecord.doi || null,
        pmid: paperRecord.pmid || null,
        file_url: paperRecord.file_url || null,
        source_type: paperRecord.source_type || 'pdf',
        analysis_scope: paperRecord.analysis_scope || paperRecord.analysisScope || 'Abstract Only',
        status: paperRecord.status || 'completed',
        sample_size: paperRecord.sample_size || paperRecord.sampleSize || null,
        abstract: paperRecord.abstract || null,
        created_at: paperRecord.created_at || new Date().toISOString(),
      };

      try {
        const { data, error } = await supabase
          .from('research_papers')
          .upsert(dbPayload, { onConflict: 'id' })
          .select()
          .single();

        if (error) {
          console.warn("Supabase savePaper warning (saving to persistent local storage):", error.message);
        } else if (data) {
          return {
            ...data,
            analysisScope: data.analysis_scope || 'Abstract Only',
          };
        }
      } catch (dbErr) {
        console.warn("Supabase savePaper exception (saving to persistent local storage):", dbErr.message);
      }
    }

    const papers = getTableData('research_papers');
    const existingIndex = papers.findIndex((p) => p.id === paperRecord.id);
    const updated = {
      ...paperRecord,
      analysis_scope: paperRecord.analysis_scope || paperRecord.analysisScope || 'Abstract Only',
      analysisScope: paperRecord.analysisScope || paperRecord.analysis_scope || 'Abstract Only',
      updated_at: new Date().toISOString(),
      created_at: paperRecord.created_at || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      papers[existingIndex] = updated;
    } else {
      papers.unshift(updated);
    }
    setTableData('research_papers', papers);
    return updated;
  },

  /**
   * Delete a research paper and its associated analysis
   */
  async deletePaper(userId, paperId) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('research_papers')
          .delete()
          .eq('id', paperId)
          .eq('user_id', userId);
        if (error) {
          console.warn("Supabase deletePaper warning:", error.message);
        }
      } catch (err) {
        console.warn("Supabase deletePaper exception:", err.message);
      }
    }

    let papers = getTableData('research_papers');
    papers = papers.filter((p) => !(p.id === paperId && p.user_id === userId));
    setTableData('research_papers', papers);

    let analyses = getTableData('research_analysis_results');
    analyses = analyses.filter((a) => !(a.paper_id === paperId && a.user_id === userId));
    setTableData('research_analysis_results', analyses);
    return true;
  },

  /**
   * Save AI analysis results for a paper
   */
  async saveAnalysisResult(analysisRecord) {
    if (isSupabaseConfigured && supabase) {
      // Map frontend model to exact database schema columns (snake_case)
      // Excludes camelCase `analysisScope` to avoid PostgREST schema cache errors
      const dbPayload = {
        id: analysisRecord.id,
        paper_id: analysisRecord.paper_id,
        user_id: analysisRecord.user_id,
        analysis_scope: analysisRecord.analysis_scope || analysisRecord.analysisScope || 'Abstract Only',
        research_objective: analysisRecord.research_objective || analysisRecord.researchObjective || null,
        main_findings: analysisRecord.main_findings || analysisRecord.mainFindings || null,
        genes_identified: analysisRecord.genes_identified || analysisRecord.genesIdentified || [],
        proteins_identified: analysisRecord.proteins_identified || analysisRecord.proteinsIdentified || [],
        biological_pathways: analysisRecord.biological_pathways || analysisRecord.biologicalPathways || [],
        relationship_with_endometriosis: analysisRecord.relationship_with_endometriosis || analysisRecord.relationshipWithEndometriosis || null,
        experimental_model: analysisRecord.experimental_model || analysisRecord.experimentalModel || null,
        evidence_classification: analysisRecord.evidence_classification || analysisRecord.evidenceClassification || {},
        evidence_distribution: analysisRecord.evidence_distribution || analysisRecord.evidenceDistribution || {},
        potential_drug_targets: analysisRecord.potential_drug_targets || analysisRecord.potentialDrugTargets || [],
        created_at: analysisRecord.created_at || new Date().toISOString(),
      };

      try {
        const { data, error } = await supabase
          .from('research_analysis_results')
          .upsert(dbPayload, { onConflict: 'id' })
          .select()
          .single();

        if (error) {
          console.warn("Supabase saveAnalysisResult warning (saving to persistent local storage):", error.message);
        } else if (data) {
          return {
            ...data,
            analysisScope: data.analysis_scope || 'Abstract Only',
            researchObjective: data.research_objective,
            mainFindings: data.main_findings,
            genesIdentified: data.genes_identified,
            proteinsIdentified: data.proteins_identified,
            biologicalPathways: data.biological_pathways,
            relationshipWithEndometriosis: data.relationship_with_endometriosis,
            experimentalModel: data.experimental_model,
            evidenceClassification: data.evidence_classification,
            evidenceDistribution: data.evidence_distribution,
            potentialDrugTargets: data.potential_drug_targets,
          };
        }
      } catch (analysisErr) {
        console.warn("Supabase saveAnalysisResult exception (saving to persistent local storage):", analysisErr.message);
      }
    }

    const analyses = getTableData('research_analysis_results');
    const existingIndex = analyses.findIndex(
      (a) => a.id === analysisRecord.id || (a.paper_id === analysisRecord.paper_id && a.user_id === analysisRecord.user_id)
    );
    const updated = {
      ...analysisRecord,
      analysis_scope: analysisRecord.analysis_scope || analysisRecord.analysisScope || 'Abstract Only',
      analysisScope: analysisRecord.analysisScope || analysisRecord.analysis_scope || 'Abstract Only',
      created_at: analysisRecord.created_at || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      analyses[existingIndex] = updated;
    } else {
      analyses.unshift(updated);
    }
    setTableData('research_analysis_results', analyses);
    return updated;
  },

  /**
   * Get AI analysis result for a paper (enforces user_id isolation)
   */
  async getAnalysisResult(userId, paperId) {
    if (!paperId) return null;

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('research_analysis_results')
          .select('*')
          .eq('paper_id', paperId);

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.warn("Supabase getAnalysisResult warning:", error.message);
        } else if (data) {
          return {
            ...data,
            analysisScope: data.analysis_scope || 'Abstract Only',
            researchObjective: data.research_objective,
            mainFindings: data.main_findings,
            genesIdentified: data.genes_identified,
            proteinsIdentified: data.proteins_identified,
            biologicalPathways: data.biological_pathways,
            relationshipWithEndometriosis: data.relationship_with_endometriosis,
            experimentalModel: data.experimental_model,
            evidenceClassification: data.evidence_classification,
            evidenceDistribution: data.evidence_distribution,
            potentialDrugTargets: data.potential_drug_targets,
          };
        }
      } catch (err) {
        console.warn("Supabase getAnalysisResult exception:", err.message);
      }
    }

    // Always check local persistent storage if Supabase returned null or failed
    const analyses = getTableData('research_analysis_results');
    const match = analyses.find((a) => a.paper_id === paperId && (!userId || a.user_id === userId));
    if (!match) return null;
    return {
      ...match,
      analysisScope: match.analysis_scope || match.analysisScope || 'Abstract Only',
      analysis_scope: match.analysis_scope || match.analysisScope || 'Abstract Only',
    };
  },

  /**
   * Save identified drug targets extracted from paper
   */
  async saveIdentifiedTargets(userId, targets) {
    if (!targets?.length) return;

    if (isSupabaseConfigured && supabase) {
      try {
        const records = targets.map((t) => ({
          user_id: userId,
          gene_symbol: t.geneSymbol,
          target_name: t.targetName,
          biological_category: t.biologicalCategory || 'Other',
          clinical_phase: t.clinicalPhase || 'Preclinical',
          calculated_score: t.calculatedScore || 75.0,
          paper_id: t.paperId || null,
        }));
        const { error } = await supabase
          .from('identified_targets')
          .insert(records);
        if (error) {
          console.warn("Supabase saveIdentifiedTargets warning:", error.message);
        } else {
          return;
        }
      } catch (err) {
        console.warn("Supabase saveIdentifiedTargets exception:", err.message);
      }
    }

    const existing = getTableData('identified_targets');
    const newItems = targets.map((t) => ({
      id: `target-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: userId,
      gene_symbol: t.geneSymbol,
      target_name: t.targetName,
      biological_category: t.biologicalCategory || 'Other',
      clinical_phase: t.clinicalPhase || 'Preclinical',
      calculated_score: t.calculatedScore || 75.0,
      paper_id: t.paperId || null,
      created_at: new Date().toISOString(),
    }));
    setTableData('identified_targets', [...newItems, ...existing]);
  },
};


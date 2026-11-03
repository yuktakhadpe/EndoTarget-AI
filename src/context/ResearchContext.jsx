import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { INITIAL_TARGETS, INITIAL_WEIGHTS, calculateTargetScore } from '../data/targetsData';
import { supabase } from '../services/supabaseClient';
import { INITIAL_PAPERS } from '../data/papersData';
import {
  getUserData,
  saveUserData,
  signUpWithSupabase,
  signInWithSupabase,
  signOutFromSupabase,
  getSupabaseSession,
} from '../services/userService';
import {
  fetchUserPapers,
  uploadPdfPaper,
  importPaperFromUrl as importPaperFromUrlService,
  getPaperAnalysis,
  removePaper,
} from '../services/paperService';

const ResearchContext = createContext(null);

export function ResearchProvider({ children }) {
  // Authentication state - retrieved from persistent session
  // Authentication state - restored from Supabase session
const [user, setUser] = useState({ isLoggedIn: false });
const [authLoading, setAuthLoading] = useState(true);

// Restore and monitor Supabase authentication session
useEffect(() => {
  let mounted = true;

  const restoreSession = async () => {
    try {
      const session = await getSupabaseSession();

      if (!mounted) return;

      if (session?.user) {
        const authUser = session.user;

        setUser({
          id: authUser.id,
          name: authUser.user_metadata?.name || authUser.email,
          email: authUser.email,
          role: authUser.user_metadata?.role || 'Research Scientist',
          isLoggedIn: true,
        });

        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Session restoration failed:', error);
    } finally {
      if (mounted) setAuthLoading(false);
    }
  };

  restoreSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (!mounted) return;

    if (session?.user) {
      const authUser = session.user;

      setUser({
        id: authUser.id,
        name: authUser.user_metadata?.name || authUser.email,
        email: authUser.email,
        role: authUser.user_metadata?.role || 'Research Scientist',
        isLoggedIn: true,
      });
    } else if (event === 'SIGNED_OUT') {
      setUser({ isLoggedIn: false });
      setCurrentPage('landing');
    }
  });

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);

  // Current active page: 'landing' | 'login' | 'dashboard' | 'library' | 'discovery' | 'ranking' | 'pathway' | 'workspace' | 'resources'
  const [currentPage, setCurrentPage] = useState('landing');

  // Bio Resources Hub navigation & search state
  const [activeResourceTab, setActiveResourceTab] = useState('geo');
  const [resourceQuery, setResourceQuery] = useState('GSE213216');

  // Selected Target for Page 7 Target Details Dossier modal/view
  const [selectedTargetId, setSelectedTargetId] = useState(null);

  // Comparison target IDs (for multi-target comparison)
  const [comparisonTargetIds, setComparisonTargetIds] = useState(['ESR2', 'PTGS2']);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Scoring weights configuration
  const [weights, setWeights] = useState(INITIAL_WEIGHTS);

  // Research library papers - isolated per authenticated user ID
  const [papers, setPapers] = useState([]);

  // Load user papers from database whenever user session changes
  useEffect(() => {
    let isMounted = true;
    if (user?.isLoggedIn && user?.id) {
      fetchUserPapers(user.id).then((userPapers) => {
        if (isMounted) {
          setPapers(userPapers || []);
        }
      });
    } else {
      setPapers([]);
    }
    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.isLoggedIn]);

  // User workspace data - initialized after Supabase authentication
  const [savedTargetIds, setSavedTargetIds] = useState([]);
  const [savedPaperIds, setSavedPaperIds] = useState([]);
  const [notes, setNotes] = useState([]);
  const [humanModelQueries, setHumanModelQueries] = useState([]);

  // Automatically persist user-specific data whenever it changes
  useEffect(() => {
    if (user?.isLoggedIn && user?.id) {
      saveUserData(user.id, {
        savedTargetIds,
        savedPaperIds,
        notes,
        humanModelQueries,
      });
    }
  }, [user, savedTargetIds, savedPaperIds, notes, humanModelQueries]);

  // Notifications queue
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ id: Date.now(), message, type });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Dynamically recalculated targets based on weights
  const targets = useMemo(() => {
    const scored = INITIAL_TARGETS.map(target => {
      const score = calculateTargetScore(target.rawScores, weights);
      return {
        ...target,
        calculatedScore: score,
        priorityTier: score >= 85 ? "High Priority" : score >= 75 ? "Moderate Priority" : "Exploratory Priority"
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.calculatedScore - a.calculatedScore);

    // Assign ranking dynamically
    return scored.map((target, index) => ({
      ...target,
      rank: index + 1
    }));
  }, [weights]);

  // Active target object
  const selectedTarget = useMemo(() => {
    if (!selectedTargetId) return null;
    return targets.find(t => t.id === selectedTargetId) || INITIAL_TARGETS.find(t => t.id === selectedTargetId) || null;
  }, [selectedTargetId, targets]);

  // Actions
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openResourceExplorer = (tab = 'geo', query = '') => {
    if (tab) setActiveResourceTab(tab);
    if (query) setResourceQuery(query);
    setCurrentPage('resources');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTargetDetails = (targetId) => {
    setSelectedTargetId(targetId);
  };

  const closeTargetDetails = () => {
    setSelectedTargetId(null);
  };

  const toggleSaveTarget = (targetId) => {
    setSavedTargetIds(prev => {
      const exists = prev.includes(targetId);
      const next = exists ? prev.filter(id => id !== targetId) : [...prev, targetId];
      showNotification(
        exists ? `Target ${targetId} removed from Workspace` : `Target ${targetId} saved to Research Workspace`,
        exists ? 'info' : 'success'
      );
      return next;
    });
  };

  const toggleSavePaper = (paperId) => {
    setSavedPaperIds(prev => {
      const exists = prev.includes(paperId);
      const next = exists ? prev.filter(id => id !== paperId) : [...prev, paperId];
      showNotification(
        exists ? `Paper unbookmarked` : `Paper bookmarked to Library Workspace`,
        exists ? 'info' : 'success'
      );
      return next;
    });
  };

  const toggleCompareTarget = (targetId) => {
    setComparisonTargetIds(prev => {
      if (prev.includes(targetId)) {
        if (prev.length <= 1) {
          showNotification("You must have at least one target for comparison", "warning");
          return prev;
        }
        return prev.filter(id => id !== targetId);
      } else {
        if (prev.length >= 4) {
          showNotification("Maximum 4 targets can be compared simultaneously", "warning");
          return prev;
        }
        return [...prev, targetId];
      }
    });
  };

  const updateWeights = (newWeights) => {
    setWeights(newWeights);
    showNotification("Scoring algorithm recalibrated successfully", "success");
  };

  const resetWeights = () => {
    setWeights(INITIAL_WEIGHTS);
    showNotification("Weights reset to scientific consensus defaults", "info");
  };

  const addNote = (newNote) => {
    const note = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...newNote
    };
    setNotes(prev => [note, ...prev]);
    showNotification("Research note saved", "success");
  };

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    showNotification("Note deleted", "info");
  };

  const addPaper = (paper) => {
    setPapers(prev => [paper, ...prev]);
    showNotification(`New scientific paper "${paper.title.slice(0, 35)}..." added to Library`, "success");
  };

  const uploadPaper = async (file, customMetadata = {}) => {
    if (!user?.id) {
      showNotification("Please log in to upload research papers", "warning");
      throw new Error("User not authenticated");
    }
    const result = await uploadPdfPaper(user.id, file, customMetadata);
    setPapers(prev => [result.paper, ...prev.filter(p => p.id !== result.paper.id)]);
    showNotification(`Uploaded and analyzed "${result.paper.title.slice(0, 35)}..."`, "success");
    return result;
  };

  const importPaperFromUrl = async (urlStr, customMetadata = {}) => {
    if (!user?.id) {
      showNotification("Please log in to import research papers", "warning");
      throw new Error("User not authenticated");
    }
    const result = await importPaperFromUrlService(user.id, urlStr, customMetadata);
    setPapers(prev => [result.paper, ...prev.filter(p => p.id !== result.paper.id)]);
    showNotification(`Imported and analyzed "${result.paper.title.slice(0, 35)}..."`, "success");
    return result;
  };

  const importUrlPaper = importPaperFromUrl;

  const deletePaper = async (paperId) => {
    if (user?.id) {
      await removePaper(user.id, paperId);
    }
    setPapers(prev => prev.filter(p => p.id !== paperId));
    showNotification("Paper removed from library", "info");
  };

  const getAnalysis = async (paperId) => {
    if (!user?.id) return null;
    return await getPaperAnalysis(user.id, paperId);
  };

  const login = async (credentials) => {
      try {
        const { user: authUser } = await signInWithSupabase(credentials);
    
        if (!authUser) {
          throw new Error('Login failed. Please try again.');
        }
    
        const profile = {
          id: authUser.id,
          name: authUser.user_metadata?.name || authUser.email,
          email: authUser.email,
          role: authUser.user_metadata?.role || 'Research Scientist',
          isLoggedIn: true,
        };
    
        setUser(profile);
    
        const userData = getUserData(authUser.id);
        setSavedTargetIds(userData.savedTargetIds || []);
        setSavedPaperIds(userData.savedPaperIds || []);
        setNotes(userData.notes || []);
    
        const userPapers = await fetchUserPapers(authUser.id);
        setPapers(userPapers || []);
    
        setCurrentPage('dashboard');
        showNotification(`Welcome back, ${profile.name}!`, 'success');
    
        return { success: true, user: profile };
      } catch (err) {
        showNotification(err.message, 'warning');
        return { success: false, error: err.message };
      }
    };

    const register = async (registrationData) => {
      try {
        const { user: authUser, session } =
          await signUpWithSupabase(registrationData);
    
        if (!authUser) {
          throw new Error('Registration failed. Please try again.');
        }
    
        const profile = {
          id: authUser.id,
          name: authUser.user_metadata?.name || registrationData.name,
          email: authUser.email,
          role: authUser.user_metadata?.role || registrationData.role,
          isLoggedIn: Boolean(session),
        };
    
        if (session) {
          setUser(profile);
    
          setSavedTargetIds([]);
          setSavedPaperIds([]);
          setNotes([]);
          setPapers([]);
    
          setCurrentPage('dashboard');
    
          showNotification(
            `Account created successfully! Welcome, ${profile.name}.`,
            'success'
          );
        } else {
          showNotification(
            'Account created! Please verify your email before signing in.',
            'success'
          );
        }
    
        return { success: true, user: profile };
      } catch (err) {
        showNotification(err.message, 'warning');
        return { success: false, error: err.message };
      }
    };

    const logout = async () => {
      try {
        await signOutFromSupabase();
    
        setUser({ isLoggedIn: false });
        setSavedTargetIds([]);
        setSavedPaperIds([]);
        setNotes([]);
        setPapers([]);
        setCurrentPage('landing');
    
        showNotification('You have signed out.', 'info');
      } catch (err) {
        showNotification(err.message, 'warning');
      }
    };

  return (
    <ResearchContext.Provider
      value={{
        user,
        currentPage,
        selectedTarget,
        selectedTargetId,
        comparisonTargetIds,
        isComparisonOpen,
        weights,
        targets,
        papers,
        savedTargetIds,
        savedPaperIds,
        notes,
        notification,
        navigateTo,
        openTargetDetails,
        closeTargetDetails,
        toggleSaveTarget,
        toggleSavePaper,
        toggleCompareTarget,
        setIsComparisonOpen,
        updateWeights,
        resetWeights,
        addNote,
        deleteNote,
        addPaper,
        uploadPaper,
        importPaperFromUrl,
        importUrlPaper,
        getAnalysis,
        deletePaper,
        login,
        register,
        logout,
        showNotification,
        activeResourceTab,
        setActiveResourceTab,
        resourceQuery,
        setResourceQuery,
        openResourceExplorer,
        humanModelQueries,
        setHumanModelQueries,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error("useResearch must be used within a ResearchProvider");
  }
  return context;
}

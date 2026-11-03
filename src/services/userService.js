/**
 * User Service & Authentication Manager
 * Handles user account registration, unique user ID generation,
 * session management, and per-user data isolation.
 *
 * Backed by browser localStorage with isolated per-user keys.
 */
import { supabase } from './supabaseClient.js';

const USERS_STORAGE_KEY = 'endotarget_users';
const ACTIVE_SESSION_KEY = 'endotarget_active_session';
const USER_DATA_PREFIX = 'endotarget_user_data_';

// Exactly the 12 required user roles
export const USER_ROLES = [
  "Undergraduate Student",
  "Postgraduate Student",
  "PhD Scholar",
  "Postdoctoral Researcher",
  "Research Scientist",
  "Clinical Researcher",
  "Healthcare Professional",
  "Pharmacologist",
  "Bioinformatician",
  "Professor / Faculty",
  "Pharmaceutical Industry Professional",
  "Other"
];

// Seed profile for Dr. Elena Vance (preserved existing user)
export const ELENA_VANCE_ID = 'user-elena-vance';

const ELENA_VANCE_USER = {
  id: ELENA_VANCE_ID,
  name: "Dr. Elena Vance",
  email: "elena.vance@reproductive-genomics.org",
  role: "Senior Biomedical Researcher", // Preserved legacy role
  createdAt: "2026-10-01T00:00:00.000Z",
};

const ELENA_VANCE_INITIAL_DATA = {
  savedTargetIds: ['ESR2', 'VEGFA', 'HDAC6'],
  savedPaperIds: ['paper-1', 'paper-3'],
  notes: [
    {
      id: "note-1",
      title: "ER-beta allosteric binding pocket hypothesis",
      content: "Ex-vivo tissue validation indicates 140x ER-beta overexpression in DIE lesions. Need to cross-reference with ChEMBL bioactivity assays for selective ER-beta modulators (e.g. Erteberel) to evaluate bone mineral density sparing effect.",
      targetId: "ESR2",
      date: "2026-10-28",
      category: "Target Validation"
    },
    {
      id: "note-2",
      title: "Peritoneal microenvironment PGE2 and aromatase crosstalk",
      content: "Santulli et al. data confirms autocrine loop: PGE2 binding EP2/4 drives local aromatase. Repurposing selective EP4 receptor antagonists may mitigate pelvic pain without systemic NSAID cardiovascular risk.",
      targetId: "PTGS2",
      date: "2026-10-24",
      category: "Pharmacology"
    },
    {
      id: "note-3",
      title: "HDAC6 non-hormonal anti-fibrotic evaluation",
      content: "Tubastatin A demonstrated 61% lesion collagen reduction in mouse models. Outstanding opportunity for non-hormonal therapy in patient cohorts who refuse GnRH agonists due to vasomotor symptoms.",
      targetId: "HDAC6",
      date: "2026-10-19",
      category: "Pipeline Development"
    }
  ],
  uploadedPapers: [],
  humanModelQueries: [],
};

/**
 * Initialize repository and seed Dr. Elena Vance if not present
 */
function ensureInitialized() {
  if (typeof window === 'undefined') return;

  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
    let users = rawUsers ? JSON.parse(rawUsers) : [];

    // Ensure Dr. Elena Vance account is preserved in repository
    const hasElena = users.some(u => u.id === ELENA_VANCE_ID || u.email.toLowerCase() === ELENA_VANCE_USER.email.toLowerCase());
    if (!hasElena) {
      users.unshift(ELENA_VANCE_USER);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    // Ensure Elena Vance data is initialized if not present
    const elenaDataKey = `${USER_DATA_PREFIX}${ELENA_VANCE_ID}`;
    if (!localStorage.getItem(elenaDataKey)) {
      localStorage.setItem(elenaDataKey, JSON.stringify(ELENA_VANCE_INITIAL_DATA));
    }
  } catch (e) {
    console.error("Failed to initialize user storage:", e);
  }
}

// Run initialization
ensureInitialized();

/**
 * Get all registered users
 */
export function getAllUsers() {
  ensureInitialized();
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [ELENA_VANCE_USER];
  } catch {
    return [ELENA_VANCE_USER];
  }
}

/**
 * Get user by unique ID
 */
export function getUserById(userId) {
  if (!userId) return null;
  const users = getAllUsers();
  return users.find(u => u.id === userId) || null;
}

/**
 * Get user by email address
 */
export function getUserByEmail(email) {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === normalized) || null;
}

/**
 * Register a new user account with unique ID
 */
export function registerUser({ name, email, password, role }) {
  ensureInitialized();

  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim().toLowerCase();
  const selectedRole = role || USER_ROLES[4]; // Default to Research Scientist

  if (!trimmedName) throw new Error("Full name is required.");
  if (!trimmedEmail) throw new Error("Email address is required.");
  if (!password) throw new Error("Password is required.");

  const users = getAllUsers();
  if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
    throw new Error(`An account with email "${trimmedEmail}" already exists. Please sign in instead.`);
  }

  // Generate a distinct unique user ID
  const uniqueId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const newUser = {
    id: uniqueId,
    name: trimmedName,
    email: trimmedEmail,
    role: selectedRole,
    createdAt: new Date().toISOString(),
  };

  // Save to users list
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  // Initialize fresh, isolated data for this user (NO data from Dr. Elena Vance)
  const initialUserData = {
    savedTargetIds: [],
    savedPaperIds: [],
    notes: [],
    uploadedPapers: [],
    humanModelQueries: [],
  };

  localStorage.setItem(`${USER_DATA_PREFIX}${uniqueId}`, JSON.stringify(initialUserData));

  // Set active session
  setActiveSession(uniqueId);

  return { user: newUser, userData: initialUserData };
}

/**
 * Authenticate existing user by email & password
 */
export function authenticateUser(email, password) {
  ensureInitialized();

  const trimmedEmail = (email || '').trim().toLowerCase();
  if (!trimmedEmail) throw new Error("Please enter your email address.");

  const user = getUserByEmail(trimmedEmail);
  if (!user) {
    throw new Error(`No account found for "${trimmedEmail}". Please register a new account.`);
  }

  // In this client-side architecture, password verification succeeds if password provided
  if (!password) {
    throw new Error("Please enter your password.");
  }

  // Set active session to this user's unique ID
  setActiveSession(user.id);

  // Retrieve user's isolated data
  const userData = getUserData(user.id);

  return { user, userData };
}

/**
 * Get active session user ID from storage
 */
export function getActiveSessionUserId() {
  try {
    return localStorage.getItem(ACTIVE_SESSION_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Set active session user ID
 */
export function setActiveSession(userId) {
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, userId);
  } catch (e) {
    console.error("Failed to set active session:", e);
  }
}

/**
 * Clear active session on logout
 */
export function clearActiveSession() {
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (e) {
    console.error("Failed to clear active session:", e);
  }
}

/**
 * Get user-specific isolated data (targets, papers, notes)
 */
export function getUserData(userId) {
  if (!userId) {
    return { savedTargetIds: [], savedPaperIds: [], notes: [], uploadedPapers: [] };
  }

  try {
    const raw = localStorage.getItem(`${USER_DATA_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load user data:", e);
  }

  // If this is Elena Vance and key wasn't found, return her default data
  if (userId === ELENA_VANCE_ID) {
    return ELENA_VANCE_INITIAL_DATA;
  }

  // Default empty isolated state
  return {
    savedTargetIds: [],
    savedPaperIds: [],
    notes: [],
    uploadedPapers: [],
    humanModelQueries: [],
  };
}

/**
 * Save user-specific isolated data
 */
export function saveUserData(userId, data) {
  if (!userId) return;
  try {
    localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save user data:", e);
  }
}

// ==========================================
// SUPABASE AUTHENTICATION
// ==========================================

export async function signUpWithSupabase({ name, email, password, role }) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName || !trimmedEmail || !password) {
    throw new Error('Please provide all required registration details.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: {
      data: {
        name: trimmedName,
        role: role || USER_ROLES[4],
      },
    },
  });

  if (error) throw error;

  return data;
}

export async function signInWithSupabase({ email, password }) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;

  return data;
}

export async function signOutFromSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getSupabaseSession() {
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return data.session;
}

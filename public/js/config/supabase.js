/**
 * Supabase Configuration - Browser Version
 * إعدادات الاتصال بـ Supabase
 */

// Import Supabase from CDN (loaded in HTML)
const { createClient } = window.supabase || {};

// Supabase credentials (from your Supabase project)
const supabaseUrl = 'https://rzenhmmwocctvonwhnrj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZW5obW13b2NjdHZvbndobnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTAwODYsImV4cCI6MjA3ODc2NjA4Nn0.wGQZ4osd-MrQudrt6lBhHaumbFjYT26-hoNR4TnjEQM';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'Arab Research Publishing Platform',
    },
  },
});

// Storage buckets
export const STORAGE_BUCKETS = {
  RESEARCH_FILES: 'research-files',
};

// Helper functions
export const getStorageUrl = (bucket, path) => {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

export default supabase;


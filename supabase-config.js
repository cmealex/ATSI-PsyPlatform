/**
 * Supabase Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Supabase account at https://supabase.com
 * 2. Create a new project
 * 3. Go to Settings → API
 * 4. Copy your Project URL and anon/public key
 * 5. Replace the placeholder values below with your actual credentials
 * 6. Run the SQL schema from 'supabase-schema.sql' in the SQL Editor
 */

// ⚠️ REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
const SUPABASE_URL = 'https://imdotxzhauqqulmterqv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZG90eHpoYXVxcXVsbXRlcnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjkxNjIsImV4cCI6MjA3NjA0NTE2Mn0.61F8t5gZ9c_8LZk52ZHmrTjBR8P45oMKMXBdj9I_uoY';

// Initialize Supabase client
// This will be available globally as 'supabase'
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other modules
window.supabaseClient = supabase;

// Helper function to check if Supabase is properly configured
function checkSupabaseConfig() {
    if (SUPABASE_URL === 'https://your-project-id.supabase.co' || 
        SUPABASE_ANON_KEY === 'your-anon-key-here') {
        console.error('⚠️ SUPABASE NOT CONFIGURED!');
        console.error('Please update supabase-config.js with your actual credentials.');
        console.error('See instructions at the top of supabase-config.js');
        return false;
    }
    console.log('✅ Supabase configured successfully');
    return true;
}

// Check configuration on load
checkSupabaseConfig();


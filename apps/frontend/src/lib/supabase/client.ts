/**
 * Supabase Client - For User-Connected External Tools ONLY
 * 
 * This Supabase client is NOT used for bapx.in authentication.
 * It's only available for users to connect their OWN Supabase projects
 * as external data sources/tools within the bapx.in platform.
 * 
 * For bapx.in authentication, use: @/lib/trailbase/client
 */

import { createBrowserClient } from '@supabase/ssr';

let toolClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Create Supabase client for user's external projects
 * NOT for bapx.in authentication
 */
export function createClient() {
  // Check if user has configured their own Supabase project
  const supabaseUrl = process.env.NEXT_PUBLIC_USER_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_USER_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    // Return a mock client that throws helpful errors
    return createMockSupabaseClient();
  }

  if (toolClient) {
    return toolClient;
  }

  toolClient = createBrowserClient(supabaseUrl, supabaseKey);
  return toolClient;
}

/**
 * Create a mock Supabase client for when user hasn't configured their own Supabase
 */
function createMockSupabaseClient() {
  const throwError = () => {
    throw new Error(
      'Supabase not configured for tool access. ' +
      'This client is only for connecting external Supabase projects as tools. ' +
      'Configure NEXT_PUBLIC_USER_SUPABASE_URL and NEXT_PUBLIC_USER_SUPABASE_ANON_KEY in your .env file.'
    );
  };

  return {
    from: () => ({
      select: throwError,
      insert: throwError,
      update: throwError,
      delete: throwError,
    }),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithOtp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
    },
    rpc: throwError,
  } as any;
}

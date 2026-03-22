/**
 * Trailbase Server Client - PRIMARY AUTH for bapx.in
 * 
 * Uses Trailbase for all authentication.
 * No Supabase for core platform auth.
 */

import { getSession, getUser, login, signup, logout } from '@/lib/trailbase/server';
import { cookies } from 'next/headers';

export { getSession, getUser, login, signup, logout };
export { cookies };

/**
 * Trailbase auth client for bapx.in
 * Compatible interface for existing code
 */
export function createClient() {
  const trailbaseUrl = process.env.NEXT_PUBLIC_TRAILBASE_URL || 'http://localhost:4000';
  
  return {
    auth: {
      getSession: async () => {
        try {
          const session = await getSession();
          return { data: { session }, error: null };
        } catch (e) {
          return { data: { session: null }, error: e as Error };
        }
      },
      
      getUser: async () => {
        try {
          const user = await getUser();
          return { data: { user }, error: null };
        } catch (e) {
          return { data: { user: null }, error: e as Error };
        }
      },
      
      signInWithOtp: async ({ email, options }: any) => {
        try {
          const response = await fetch(`${trailbaseUrl}/api/auth/v1/otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          
          if (response.ok) {
            return { data: { user: null, session: null }, error: null };
          }
          return { data: null, error: { message: 'Failed to send OTP' } };
        } catch (e) {
          return { data: null, error: { message: 'Network error' } };
        }
      },
      
      signInWithPassword: async ({ email, password }: any) => {
        try {
          const result = await login(email, password);
          if (result.success && result.session) {
            return { 
              data: { 
                user: result.session.user, 
                session: result.session 
              }, 
              error: null 
            };
          }
          return { data: null, error: { message: result.error || 'Login failed' } };
        } catch (e) {
          return { data: null, error: { message: 'Login failed' } };
        }
      },
      
      signUp: async ({ email, password, options }: any) => {
        try {
          const result = await signup(email, password);
          if (result.success && result.session) {
            return { 
              data: { 
                user: result.session.user, 
                session: result.session 
              }, 
              error: null 
            };
          }
          return { data: null, error: { message: result.error || 'Signup failed' } };
        } catch (e) {
          return { data: null, error: { message: 'Signup failed' } };
        }
      },
      
      signOut: async () => {
        try {
          await logout();
          return { error: null };
        } catch (e) {
          return { error: e as Error };
        }
      },
      
      updateUser: async ({ password, email }: any) => {
        return { data: null, error: { message: 'Not implemented' } };
      },
      
      resetPasswordForEmail: async (email: string, { redirectTo }: any) => {
        return { data: null, error: { message: 'Not implemented' } };
      },
      
      verifyOtp: async ({ email, token, type }: any) => {
        return { data: null, error: { message: 'Not implemented' } };
      },
    },
  };
}

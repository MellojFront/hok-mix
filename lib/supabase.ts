import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Типы для базы данных
export interface Database {
  public: {
    Tables: {
      mixes: {
        Row: {
          id: string;
          title: string;
          description: string;
          ingredients: any; // JSON
          is_official: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          author_name: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          ingredients: any;
          is_official?: boolean;
          created_by?: string | null;
          author_name?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          ingredients?: any;
          is_official?: boolean;
          author_name?: string | null;
        };
      };
      mix_submissions: {
        Row: {
          id: string;
          mix_id: string | null;
          title: string;
          description: string;
          ingredients: any;
          submitted_by: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mix_id?: string | null;
          title: string;
          description: string;
          ingredients: any;
          submitted_by: string;
          status?: 'pending' | 'approved' | 'rejected';
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
        };
      };
    };
  };
}


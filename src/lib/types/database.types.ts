export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      supplier_categories: {
        Row: {
          id: string
          name: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_order?: number
          created_at?: string
        }
      }
      checklist_categories: {
        Row: {
          id: string
          name: string
          label: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          label: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          label?: string
          display_order?: number
          created_at?: string
        }
      }
      rsvp_statuses: {
        Row: {
          id: string
          name: string
          label: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          label: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          label?: string
          display_order?: number
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          partner_name: string | null
          wedding_date: string | null
          total_budget: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          partner_name?: string | null
          wedding_date?: string | null
          total_budget?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          partner_name?: string | null
          wedding_date?: string | null
          total_budget?: number
          created_at?: string
          updated_at?: string
        }
      }
      budget_items: {
        Row: {
          id: string
          user_id: string
          category: string
          amount: number
          paid: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          amount: number
          paid?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          amount?: number
          paid?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      checklist_items: {
        Row: {
          id: string
          user_id: string
          task: string
          completed: boolean
          category: string
          due_date: string | null
          priority: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task: string
          completed?: boolean
          category: string
          due_date?: string | null
          priority?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task?: string
          completed?: boolean
          category?: string
          due_date?: string | null
          priority?: string
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          contact_person: string | null
          email: string | null
          phone: string | null
          cost: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          cost?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          cost?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          rsvp_status: 'pending' | 'accepted' | 'declined'
          plus_one: boolean
          table_number: number | null
          dietary_restrictions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          rsvp_status?: 'pending' | 'accepted' | 'declined'
          plus_one?: boolean
          table_number?: number | null
          dietary_restrictions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          rsvp_status?: 'pending' | 'accepted' | 'declined'
          plus_one?: boolean
          table_number?: number | null
          dietary_restrictions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

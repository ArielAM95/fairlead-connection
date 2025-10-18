export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accepted_quotes: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          payment_method: string | null
          price: string
          professional_id: string
          professional_name: string
          quote_id: string
          request_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          id?: string
          payment_method?: string | null
          price: string
          professional_id: string
          professional_name: string
          quote_id: string
          request_id: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          payment_method?: string | null
          price?: string
          professional_id?: string
          professional_name?: string
          quote_id?: string
          request_id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_super_admin: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_super_admin?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_super_admin?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string | null
          id: string
          image: string | null
          published: boolean | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          image?: string | null
          published?: boolean | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          image?: string | null
          published?: boolean | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      auth_rate_limits: {
        Row: {
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          id: string
          identifier: string
          last_attempt_at: string | null
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier: string
          last_attempt_at?: string | null
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          last_attempt_at?: string | null
        }
        Relationships: []
      }
      auth_tokens: {
        Row: {
          created_at: string | null
          device_info: string | null
          expires_at: string
          id: string
          is_active: boolean | null
          last_used_at: string | null
          professional_id: string | null
          token: string
        }
        Insert: {
          created_at?: string | null
          device_info?: string | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          professional_id?: string | null
          token: string
        }
        Update: {
          created_at?: string | null
          device_info?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          professional_id?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "auth_tokens_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auth_tokens_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          commission_date: string
          created_at: string
          id: string
          last_attempt_at: string | null
          lead_owner_commission: number
          ofair_commission: number
          payment_method_id: string
          professional_id: string
          retry_count: number
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          commission_date: string
          created_at?: string
          id?: string
          last_attempt_at?: string | null
          lead_owner_commission?: number
          ofair_commission?: number
          payment_method_id: string
          professional_id: string
          retry_count?: number
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          commission_date?: string
          created_at?: string
          id?: string
          last_attempt_at?: string | null
          lead_owner_commission?: number
          ofair_commission?: number
          payment_method_id?: string
          professional_id?: string
          retry_count?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_access_logs: {
        Row: {
          access_granted: boolean
          access_type: string
          accessed_at: string | null
          accessed_professional_id: string
          accessor_professional_id: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          access_granted: boolean
          access_type: string
          accessed_at?: string | null
          accessed_professional_id: string
          accessor_professional_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          access_granted?: boolean
          access_type?: string
          accessed_at?: string | null
          accessed_professional_id?: string
          accessor_professional_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: []
      }
      credit_card_tokens: {
        Row: {
          card_expiry: string
          card_last4: string
          card_type: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          professional_id: string
          tranzila_index: string | null
          tranzila_token: string | null
          updated_at: string | null
        }
        Insert: {
          card_expiry: string
          card_last4: string
          card_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          professional_id: string
          tranzila_index?: string | null
          tranzila_token?: string | null
          updated_at?: string | null
        }
        Update: {
          card_expiry?: string
          card_last4?: string
          card_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          professional_id?: string
          tranzila_index?: string | null
          tranzila_token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_card_tokens_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_card_tokens_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_contact_access_logs: {
        Row: {
          access_granted: boolean
          access_type: string
          accessed_at: string | null
          accessor_professional_id: string | null
          id: string
          ip_address: unknown | null
          lead_id: string
          user_agent: string | null
        }
        Insert: {
          access_granted: boolean
          access_type: string
          accessed_at?: string | null
          accessor_professional_id?: string | null
          id?: string
          ip_address?: unknown | null
          lead_id: string
          user_agent?: string | null
        }
        Update: {
          access_granted?: boolean
          access_type?: string
          accessed_at?: string | null
          accessor_professional_id?: string | null
          id?: string
          ip_address?: unknown | null
          lead_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      internal_crm: {
        Row: {
          created_at: string
          email: string
          id: string
          is_super_admin: boolean
          name: string | null
          password_hash: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_super_admin?: boolean
          name?: string | null
          password_hash?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_super_admin?: boolean
          name?: string | null
          password_hash?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      issue_reports: {
        Row: {
          admin_response: string | null
          created_at: string | null
          description: string
          id: string
          issue_type: string
          professional_id: string
          resolved_at: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string | null
          description: string
          id?: string
          issue_type: string
          professional_id: string
          resolved_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string | null
          description?: string
          id?: string
          issue_type?: string
          professional_id?: string
          resolved_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_issue_reports_professional_id"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_issue_reports_professional_id"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_payments: {
        Row: {
          commission_amount: number
          created_at: string
          final_amount: number
          id: string
          includes_vat: boolean
          invoice_url: string | null
          lead_id: string
          notes: string | null
          payment_method: string
          professional_id: string
          proposal_id: string
          share_percentage: number
        }
        Insert: {
          commission_amount?: number
          created_at?: string
          final_amount: number
          id?: string
          includes_vat?: boolean
          invoice_url?: string | null
          lead_id: string
          notes?: string | null
          payment_method: string
          professional_id: string
          proposal_id: string
          share_percentage?: number
        }
        Update: {
          commission_amount?: number
          created_at?: string
          final_amount?: number
          id?: string
          includes_vat?: boolean
          invoice_url?: string | null
          lead_id?: string
          notes?: string | null
          payment_method?: string
          professional_id?: string
          proposal_id?: string
          share_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "lead_payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_payments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_payments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_payments_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          budget: number | null
          category: string | null
          client_address: string | null
          client_name: string | null
          client_phone: string | null
          constraints: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          image_urls: string[] | null
          includes_vat: boolean
          latitude: number | null
          location: string
          longitude: number | null
          notes: string | null
          profession: string | null
          professional_id: string | null
          share_percentage: number
          status: string
          title: string
          work_date: string | null
          work_time: string | null
        }
        Insert: {
          budget?: number | null
          category?: string | null
          client_address?: string | null
          client_name?: string | null
          client_phone?: string | null
          constraints?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          includes_vat?: boolean
          latitude?: number | null
          location: string
          longitude?: number | null
          notes?: string | null
          profession?: string | null
          professional_id?: string | null
          share_percentage?: number
          status?: string
          title: string
          work_date?: string | null
          work_time?: string | null
        }
        Update: {
          budget?: number | null
          category?: string | null
          client_address?: string | null
          client_name?: string | null
          client_phone?: string | null
          constraints?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          includes_vat?: boolean
          latitude?: number | null
          location?: string
          longitude?: number | null
          notes?: string | null
          profession?: string | null
          professional_id?: string | null
          share_percentage?: number
          status?: string
          title?: string
          work_date?: string | null
          work_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          client_details: Json | null
          created_at: string
          description: string
          id: string
          is_read: boolean
          professional_id: string
          related_id: string | null
          related_type: string | null
          title: string
          type: string
        }
        Insert: {
          client_details?: Json | null
          created_at?: string
          description: string
          id?: string
          is_read?: boolean
          professional_id: string
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
        }
        Update: {
          client_details?: Json | null
          created_at?: string
          description?: string
          id?: string
          is_read?: boolean
          professional_id?: string
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          card_last4: string
          created_at: string
          expiry_month: number
          expiry_year: number
          id: string
          is_default: boolean
          professional_id: string
          token_encrypted: string
          updated_at: string
        }
        Insert: {
          card_last4: string
          created_at?: string
          expiry_month: number
          expiry_year: number
          id?: string
          is_default?: boolean
          professional_id: string
          token_encrypted: string
          updated_at?: string
        }
        Update: {
          card_last4?: string
          created_at?: string
          expiry_month?: number
          expiry_year?: number
          id?: string
          is_default?: boolean
          professional_id?: string
          token_encrypted?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_methods_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_revelations: {
        Row: {
          created_at: string | null
          id: string
          professional_id: string
          professional_name: string
          professional_phone: string
          revealed_at: string | null
          user_agent: string | null
          user_id: string
          user_ip: unknown | null
          user_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          professional_id: string
          professional_name: string
          professional_phone: string
          revealed_at?: string | null
          user_agent?: string | null
          user_id: string
          user_ip?: unknown | null
          user_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          professional_id?: string
          professional_name?: string
          professional_phone?: string
          revealed_at?: string | null
          user_agent?: string | null
          user_id?: string
          user_ip?: unknown | null
          user_name?: string | null
        }
        Relationships: []
      }
      professional_certificates: {
        Row: {
          certificate_name: string
          certificate_url: string
          created_at: string
          file_name: string
          file_size: number | null
          id: string
          professional_id: string
          updated_at: string
          upload_date: string
        }
        Insert: {
          certificate_name: string
          certificate_url: string
          created_at?: string
          file_name: string
          file_size?: number | null
          id?: string
          professional_id: string
          updated_at?: string
          upload_date?: string
        }
        Update: {
          certificate_name?: string
          certificate_url?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          id?: string
          professional_id?: string
          updated_at?: string
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_professional_certificates_professional_id"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_professional_certificates_professional_id"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_notification_areas: {
        Row: {
          area_name: string
          created_at: string
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          professional_id: string
          radius_km: number | null
          updated_at: string
        }
        Insert: {
          area_name: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          professional_id: string
          radius_km?: number | null
          updated_at?: string
        }
        Update: {
          area_name?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          professional_id?: string
          radius_km?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      professional_ratings: {
        Row: {
          company_name: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          professional_name: string
          professional_phone: string
          rating_cleanliness: number
          rating_communication: number
          rating_overall: number
          rating_quality: number
          rating_recommendation: number
          rating_timing: number
          rating_value: number
          recommendation: string | null
          weighted_average: number
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          id?: string
          professional_name: string
          professional_phone: string
          rating_cleanliness: number
          rating_communication: number
          rating_overall: number
          rating_quality: number
          rating_recommendation: number
          rating_timing: number
          rating_value: number
          recommendation?: string | null
          weighted_average: number
        }
        Update: {
          company_name?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          professional_name?: string
          professional_phone?: string
          rating_cleanliness?: number
          rating_communication?: number
          rating_overall?: number
          rating_quality?: number
          rating_recommendation?: number
          rating_timing?: number
          rating_value?: number
          recommendation?: string | null
          weighted_average?: number
        }
        Relationships: []
      }
      professionals: {
        Row: {
          about: string | null
          areas: string | null
          business_license_number: string | null
          certifications: string[] | null
          city: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          experience_range: string | null
          experience_years: string | null
          id: string
          image: string | null
          image_url: string | null
          is_verified: boolean | null
          languages: string[]
          location: string
          main_profession: string | null
          marketing_consent: boolean | null
          name: string
          phone_number: string | null
          profession: string
          profile_completion_percentage: number | null
          rating: number | null
          review_count: number | null
          specialties: string[] | null
          status: string | null
          sub_specializations: string[] | null
          terms_accepted: boolean
          tutorial_completed: boolean | null
          updated_at: string | null
          user_id: string | null
          work_hours: string | null
          working_hours: string | null
        }
        Insert: {
          about?: string | null
          areas?: string | null
          business_license_number?: string | null
          certifications?: string[] | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          experience_range?: string | null
          experience_years?: string | null
          id?: string
          image?: string | null
          image_url?: string | null
          is_verified?: boolean | null
          languages?: string[]
          location: string
          main_profession?: string | null
          marketing_consent?: boolean | null
          name: string
          phone_number?: string | null
          profession: string
          profile_completion_percentage?: number | null
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          status?: string | null
          sub_specializations?: string[] | null
          terms_accepted?: boolean
          tutorial_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          work_hours?: string | null
          working_hours?: string | null
        }
        Update: {
          about?: string | null
          areas?: string | null
          business_license_number?: string | null
          certifications?: string[] | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          experience_range?: string | null
          experience_years?: string | null
          id?: string
          image?: string | null
          image_url?: string | null
          is_verified?: boolean | null
          languages?: string[]
          location?: string
          main_profession?: string | null
          marketing_consent?: boolean | null
          name?: string
          phone_number?: string | null
          profession?: string
          profile_completion_percentage?: number | null
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          status?: string | null
          sub_specializations?: string[] | null
          terms_accepted?: boolean
          tutorial_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          work_hours?: string | null
          working_hours?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          client: string
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          location: string | null
          media_urls: Json | null
          price: number
          professional_id: string
          progress: number
          start_date: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          client: string
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          image_url?: string | null
          location?: string | null
          media_urls?: Json | null
          price: number
          professional_id: string
          progress: number
          start_date: string
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          client?: string
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          location?: string | null
          media_urls?: Json | null
          price?: number
          professional_id?: string
          progress?: number
          start_date?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      proposal_reminders: {
        Row: {
          created_at: string | null
          id: string
          is_scheduled: boolean | null
          last_reminder: string | null
          proposal_id: string
          proposal_type: string
          reminder_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_scheduled?: boolean | null
          last_reminder?: string | null
          proposal_id: string
          proposal_type: string
          reminder_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_scheduled?: boolean | null
          last_reminder?: string | null
          proposal_id?: string
          proposal_type?: string
          reminder_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_proposal_reminders_proposal_id"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          created_at: string
          description: string
          estimated_completion: string | null
          final_amount: number | null
          id: string
          includes_vat: boolean
          lead_id: string | null
          lower_price_value: number | null
          lower_price_willing: boolean | null
          media_urls: string[] | null
          price: number | null
          professional_id: string | null
          sample_image_url: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description: string
          estimated_completion?: string | null
          final_amount?: number | null
          id?: string
          includes_vat?: boolean
          lead_id?: string | null
          lower_price_value?: number | null
          lower_price_willing?: boolean | null
          media_urls?: string[] | null
          price?: number | null
          professional_id?: string | null
          sample_image_url?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string
          estimated_completion?: string | null
          final_amount?: number | null
          id?: string
          includes_vat?: boolean
          lead_id?: string | null
          lower_price_value?: number | null
          lower_price_willing?: boolean | null
          media_urls?: string[] | null
          price?: number | null
          professional_id?: string | null
          sample_image_url?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_payments: {
        Row: {
          commission_amount: number
          created_at: string
          final_amount: number
          id: string
          includes_vat: boolean
          invoice_url: string | null
          notes: string | null
          payment_method: string
          professional_id: string
          quote_id: string | null
          request_id: string
          share_percentage: number
        }
        Insert: {
          commission_amount?: number
          created_at?: string
          final_amount: number
          id?: string
          includes_vat?: boolean
          invoice_url?: string | null
          notes?: string | null
          payment_method: string
          professional_id: string
          quote_id?: string | null
          request_id: string
          share_percentage?: number
        }
        Update: {
          commission_amount?: number
          created_at?: string
          final_amount?: number
          id?: string
          includes_vat?: boolean
          invoice_url?: string | null
          notes?: string | null
          payment_method?: string
          professional_id?: string
          quote_id?: string | null
          request_id?: string
          share_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_quote_payments_request_id"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_quote_payments_request_id"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string
          description: string
          estimated_time: string | null
          final_amount: number | null
          id: string
          includes_vat: boolean
          media_urls: string[] | null
          price: string
          professional_id: string
          request_id: string
          request_status: string | null
          sample_image_url: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          estimated_time?: string | null
          final_amount?: number | null
          id?: string
          includes_vat?: boolean
          media_urls?: string[] | null
          price: string
          professional_id: string
          request_id: string
          request_status?: string | null
          sample_image_url?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          estimated_time?: string | null
          final_amount?: number | null
          id?: string
          includes_vat?: boolean
          media_urls?: string[] | null
          price?: string
          professional_id?: string
          request_id?: string
          request_status?: string | null
          sample_image_url?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          completed_work: boolean | null
          created_at: string | null
          date: string | null
          id: string
          phone_number: string
          profession: string | null
          professional_id: string | null
          professional_name: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_work?: boolean | null
          created_at?: string | null
          date?: string | null
          id?: string
          phone_number: string
          profession?: string | null
          professional_id?: string | null
          professional_name: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_work?: boolean | null
          created_at?: string | null
          date?: string | null
          id?: string
          phone_number?: string
          profession?: string | null
          professional_id?: string | null
          professional_name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          category: string | null
          constraints: string | null
          created_at: string
          date: string
          description: string
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          media_urls: string[] | null
          status: string
          timing: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          constraints?: string | null
          created_at?: string
          date?: string
          description: string
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          media_urls?: string[] | null
          status?: string
          timing?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          constraints?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          media_urls?: string[] | null
          status?: string
          timing?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          accessor_id: string | null
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          record_id: string | null
          table_name: string
          user_agent: string | null
        }
        Insert: {
          accessor_id?: string | null
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
        }
        Update: {
          accessor_id?: string | null
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      subscription_charges: {
        Row: {
          amount: number
          charge_date: string
          created_at: string | null
          credit_card_token_id: string
          currency: string | null
          error_message: string | null
          id: string
          professional_id: string
          status: string
          tranzila_confirmation: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          charge_date: string
          created_at?: string | null
          credit_card_token_id: string
          currency?: string | null
          error_message?: string | null
          id?: string
          professional_id: string
          status: string
          tranzila_confirmation?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          charge_date?: string
          created_at?: string | null
          credit_card_token_id?: string
          currency?: string | null
          error_message?: string | null
          id?: string
          professional_id?: string
          status?: string
          tranzila_confirmation?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_charges_credit_card_token_id_fkey"
            columns: ["credit_card_token_id"]
            isOneToOne: false
            referencedRelation: "credit_card_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_charges_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_charges_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          professional_id: string | null
          related_commission_id: string | null
          request: Json | null
          response: Json | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          professional_id?: string | null
          related_commission_id?: string | null
          request?: Json | null
          response?: Json | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          professional_id?: string | null
          related_commission_id?: string | null
          request?: Json | null
          response?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_logs_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_logs_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_logs_related_commission_id_fkey"
            columns: ["related_commission_id"]
            isOneToOne: false
            referencedRelation: "commissions"
            referencedColumns: ["id"]
          },
        ]
      }
      tutorial_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current_step: number | null
          id: string
          professional_id: string
          skipped: boolean | null
          steps_completed: Json | null
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          professional_id: string
          skipped?: boolean | null
          steps_completed?: Json | null
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          professional_id?: string
          skipped?: boolean | null
          steps_completed?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tutorial_progress_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutorial_progress_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      user_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          recipient_email: string | null
          recipient_id: string | null
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_email?: string | null
          recipient_id?: string | null
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_email?: string | null
          recipient_id?: string | null
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          profile_image: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      work_cancellations: {
        Row: {
          cancellation_notes: string | null
          cancellation_reason: string
          cancelled_at: string
          created_at: string
          id: string
          professional_id: string
          proposal_id: string | null
          proposal_type: string
          referral_id: string | null
        }
        Insert: {
          cancellation_notes?: string | null
          cancellation_reason: string
          cancelled_at?: string
          created_at?: string
          id?: string
          professional_id: string
          proposal_id?: string | null
          proposal_type: string
          referral_id?: string | null
        }
        Update: {
          cancellation_notes?: string | null
          cancellation_reason?: string
          cancelled_at?: string
          created_at?: string
          id?: string
          professional_id?: string
          proposal_id?: string | null
          proposal_type?: string
          referral_id?: string | null
        }
        Relationships: []
      }
      work_completion_reminders: {
        Row: {
          completion_form_sent: boolean | null
          created_at: string
          id: string
          last_reminder_sent_at: string | null
          next_reminder_date: string | null
          proposal_id: string
          proposal_type: string
          reminder_sent: boolean | null
          reschedule_count: number | null
          scheduled_work_time: string
          updated_at: string
        }
        Insert: {
          completion_form_sent?: boolean | null
          created_at?: string
          id?: string
          last_reminder_sent_at?: string | null
          next_reminder_date?: string | null
          proposal_id: string
          proposal_type: string
          reminder_sent?: boolean | null
          reschedule_count?: number | null
          scheduled_work_time: string
          updated_at?: string
        }
        Update: {
          completion_form_sent?: boolean | null
          created_at?: string
          id?: string
          last_reminder_sent_at?: string | null
          next_reminder_date?: string | null
          proposal_id?: string
          proposal_type?: string
          reminder_sent?: boolean | null
          reschedule_count?: number | null
          scheduled_work_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      work_completions: {
        Row: {
          created_at: string
          final_amount: number | null
          id: string
          invoice_url: string | null
          notes: string | null
          ocr_detected_amount: number | null
          payment_method: string | null
          professional_id: string
          proposal_id: string | null
          proposal_type: string | null
          referral_id: string | null
          status: string
          updated_at: string
          user_corrected_amount: number | null
          work_title: string
        }
        Insert: {
          created_at?: string
          final_amount?: number | null
          id?: string
          invoice_url?: string | null
          notes?: string | null
          ocr_detected_amount?: number | null
          payment_method?: string | null
          professional_id: string
          proposal_id?: string | null
          proposal_type?: string | null
          referral_id?: string | null
          status: string
          updated_at?: string
          user_corrected_amount?: number | null
          work_title: string
        }
        Update: {
          created_at?: string
          final_amount?: number | null
          id?: string
          invoice_url?: string | null
          notes?: string | null
          ocr_detected_amount?: number | null
          payment_method?: string | null
          professional_id?: string
          proposal_id?: string | null
          proposal_type?: string | null
          referral_id?: string | null
          status?: string
          updated_at?: string
          user_corrected_amount?: number | null
          work_title?: string
        }
        Relationships: []
      }
    }
    Views: {
      professionals_public_view: {
        Row: {
          about: string | null
          areas: string | null
          certifications: string[] | null
          city: string | null
          company_name: string | null
          experience_range: string | null
          experience_years: string | null
          id: string | null
          image: string | null
          image_url: string | null
          is_verified: boolean | null
          location: string | null
          name: string | null
          profession: string | null
          rating: number | null
          review_count: number | null
          specialties: string[] | null
          status: string | null
        }
        Insert: {
          about?: string | null
          areas?: string | null
          certifications?: string[] | null
          city?: string | null
          company_name?: string | null
          experience_range?: string | null
          experience_years?: string | null
          id?: string | null
          image?: string | null
          image_url?: string | null
          is_verified?: boolean | null
          location?: string | null
          name?: string | null
          profession?: string | null
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          status?: string | null
        }
        Update: {
          about?: string | null
          areas?: string | null
          certifications?: string[] | null
          city?: string | null
          company_name?: string | null
          experience_range?: string | null
          experience_years?: string | null
          id?: string | null
          image?: string | null
          image_url?: string | null
          is_verified?: boolean | null
          location?: string | null
          name?: string | null
          profession?: string | null
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          status?: string | null
        }
        Relationships: []
      }
      requests_public_view: {
        Row: {
          category: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string | null
          location: string | null
          media_urls: string[] | null
          status: string | null
          timing: string | null
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string | null
          location?: string | null
          media_urls?: string[] | null
          status?: string | null
          timing?: string | null
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string | null
          location?: string | null
          media_urls?: string[] | null
          status?: string | null
          timing?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_internal_user: {
        Args: {
          make_super_admin?: boolean
          user_email: string
          user_name?: string
        }
        Returns: string
      }
      add_internal_user_by_email: {
        Args: {
          caller_email: string
          make_super_admin?: boolean
          new_user_email: string
          user_name?: string
        }
        Returns: Json
      }
      audit_customer_data_access: {
        Args: {
          access_type: string
          accessor_id: string
          record_id: string
          table_name: string
        }
        Returns: undefined
      }
      calculate_distance_km: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      calculate_profile_completion: {
        Args: { prof_id: string }
        Returns: number
      }
      check_admin_status: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      check_auth_token_for_professional: {
        Args: { professional_id_param: string }
        Returns: boolean
      }
      check_internal_email: {
        Args: { email_param: string }
        Returns: Json
      }
      check_is_admin_user: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      check_is_super_admin: {
        Args: Record<PropertyKey, never> | { user_id_param: string }
        Returns: boolean
      }
      check_is_super_admin_user: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      check_professional_exists_by_phone: {
        Args: { phone_param: string }
        Returns: boolean
      }
      check_professional_ownership: {
        Args: { professional_id_param: string; user_id_param: string }
        Returns: boolean
      }
      check_super_admin_status: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      check_user_is_admin: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      check_user_is_internal_super_admin: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      check_user_is_super_admin: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      cleanup_expired_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_first_internal_super_admin: {
        Args: { admin_email: string; admin_name?: string }
        Returns: string
      }
      create_first_super_admin: {
        Args: { admin_email: string }
        Returns: string
      }
      create_super_admin: {
        Args: { admin_email_param: string }
        Returns: string
      }
      fetch_active_leads: {
        Args: Record<PropertyKey, never>
        Returns: {
          budget: number | null
          category: string | null
          client_address: string | null
          client_name: string | null
          client_phone: string | null
          constraints: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          image_urls: string[] | null
          includes_vat: boolean
          latitude: number | null
          location: string
          longitude: number | null
          notes: string | null
          profession: string | null
          professional_id: string | null
          share_percentage: number
          status: string
          title: string
          work_date: string | null
          work_time: string | null
        }[]
      }
      get_active_leads: {
        Args: Record<PropertyKey, never>
        Returns: {
          budget: number | null
          category: string | null
          client_address: string | null
          client_name: string | null
          client_phone: string | null
          constraints: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          image_urls: string[] | null
          includes_vat: boolean
          latitude: number | null
          location: string
          longitude: number | null
          notes: string | null
          profession: string | null
          professional_id: string | null
          share_percentage: number
          status: string
          title: string
          work_date: string | null
          work_time: string | null
        }[]
      }
      get_client_details_for_proposal: {
        Args:
          | { proposal_id_param: string; proposal_type_param: string }
          | {
              proposal_id_param: string
              proposal_type_param: string
              token_param?: string
            }
        Returns: Json
      }
      get_clients_history_secure: {
        Args: { token_param?: string }
        Returns: {
          amount: number
          client_address: string
          client_email: string
          client_name: string
          client_phone: string
          payment_method: string
          status: string
          title: string
          transaction_date: string
          transaction_id: string
          transaction_type: string
        }[]
      }
      get_current_professional_id_secure: {
        Args: { token_param?: string }
        Returns: string
      }
      get_lead_customer_info_secure: {
        Args: { lead_id_param: string }
        Returns: {
          client_address: string
          client_name: string
          client_phone: string
        }[]
      }
      get_my_payments_secure: {
        Args: { token_param?: string }
        Returns: {
          commission_amount: number
          created_at: string
          final_amount: number
          id: string
          invoice_url: string
          lead_description: string
          lead_id: string
          lead_owner_commission: number
          lead_title: string
          net_professional_earnings: number
          notes: string
          ofair_commission: number
          payment_method: string
          payment_type: string
          professional_id: string
          proposal_id: string
          share_percentage: number
        }[]
      }
      get_my_professional_ratings: {
        Args: { token_param?: string }
        Returns: {
          created_at: string
          customer_initials: string
          customer_phone_masked: string
          id: string
          rating_cleanliness: number
          rating_communication: number
          rating_overall: number
          rating_quality: number
          rating_recommendation: number
          rating_timing: number
          rating_value: number
          recommendation: string
          weighted_average: number
        }[]
      }
      get_my_work_completions_secure: {
        Args: { token_param?: string }
        Returns: {
          created_at: string
          final_amount: number
          id: string
          invoice_url: string
          notes: string
          payment_method: string
          professional_id: string
          proposal_type: string
          status: string
        }[]
      }
      get_professional_by_identifier: {
        Args: { identifier_param: string; is_email_param: boolean }
        Returns: {
          about: string
          email: string
          id: string
          image: string
          location: string
          name: string
          phone_number: string
          profession: string
          specialties: string[]
          user_id: string
        }[]
      }
      get_professional_contact_info: {
        Args: { professional_id_param: string }
        Returns: {
          email: string
          id: string
          phone_number: string
          professional_name: string
        }[]
      }
      get_professional_contact_info_secure: {
        Args: { professional_id_param: string }
        Returns: {
          email: string
          id: string
          phone_number: string
          professional_name: string
        }[]
      }
      get_professional_phone_secure: {
        Args: { professional_id_param: string; user_name_param?: string }
        Returns: {
          message: string
          phone_number: string
          success: boolean
        }[]
      }
      get_professional_rating_stats: {
        Args: { professional_phone_param: string }
        Returns: {
          average_cleanliness: number
          average_communication: number
          average_overall: number
          average_quality: number
          average_recommendation: number
          average_timing: number
          average_value: number
          overall_weighted_average: number
          total_ratings: number
        }[]
      }
      get_professional_ratings_public: {
        Args: { professional_phone_param: string }
        Returns: {
          company_name: string
          created_at: string
          professional_name: string
          rating_cleanliness: number
          rating_communication: number
          rating_overall: number
          rating_quality: number
          rating_recommendation: number
          rating_timing: number
          rating_value: number
          recommendation: string
          weighted_average: number
        }[]
      }
      get_professional_ratings_public_safe: {
        Args: { professional_id_param: string }
        Returns: {
          average_rating: number
          rating_cleanliness: number
          rating_communication: number
          rating_overall: number
          rating_quality: number
          rating_timing: number
          rating_value: number
          total_reviews: number
        }[]
      }
      get_professionals_for_business: {
        Args: { search_term?: string }
        Returns: {
          has_contact_access: boolean
          id: string
          is_verified: boolean
          location: string
          name: string
          profession: string
          rating: number
        }[]
      }
      get_projects_for_professional: {
        Args: { professional_id_param: string }
        Returns: {
          client: string
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          location: string | null
          media_urls: Json | null
          price: number
          professional_id: string
          progress: number
          start_date: string
          status: string
          title: string
          updated_at: string | null
        }[]
      }
      get_proposals_secure: {
        Args:
          | { lead_id_param?: string; professional_id_param?: string }
          | { token_param?: string }
        Returns: {
          created_at: string
          description: string
          estimated_completion: string
          id: string
          lead_id: string
          price: number
          professional_id: string
          professional_location: string
          professional_name: string
          professional_profession: string
          professional_rating: number
          professional_verified: boolean
          status: string
        }[]
      }
      get_public_leads_secure: {
        Args: Record<PropertyKey, never>
        Returns: {
          budget: number
          constraints: string
          created_at: string
          description: string
          id: string
          image_url: string
          image_urls: string[]
          latitude: number
          location: string
          longitude: number
          notes: string
          profession: string
          share_percentage: number
          status: string
          title: string
          work_date: string
          work_time: string
        }[]
      }
      get_public_professional_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          about: string
          experience_range: string
          id: string
          image: string
          is_verified: boolean
          location: string
          name: string
          profession: string
          rating: number
          review_count: number
          specialties: string[]
        }[]
      }
      get_public_professionals_basic_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          about: string
          experience_range: string
          id: string
          image: string
          is_verified: boolean
          location: string
          name: string
          profession: string
          rating: number
          review_count: number
          specialties: string[]
          status: string
        }[]
      }
      get_public_professionals_secure: {
        Args: Record<PropertyKey, never>
        Returns: {
          about: string
          areas: string
          certifications: string[]
          city: string
          company_name: string
          experience_range: string
          experience_years: string
          id: string
          image: string
          image_url: string
          is_verified: boolean
          location: string
          name: string
          profession: string
          rating: number
          review_count: number
          specialties: string[]
          status: string
        }[]
      }
      get_quotes_secure: {
        Args: { token_param?: string }
        Returns: {
          created_at: string
          description: string
          estimated_time: string
          id: string
          price: string
          professional_id: string
          request_id: string
          request_status: string
          status: string
        }[]
      }
      get_security_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      insert_lead: {
        Args: {
          p_budget: number
          p_description: string
          p_location: string
          p_professional_id: string
          p_share_percentage: number
          p_title: string
        }
        Returns: string
      }
      insert_project: {
        Args: { project_data: Json }
        Returns: string
      }
      insert_proposal: {
        Args: {
          p_description: string
          p_estimated_completion: string
          p_lead_id: string
          p_price: number
          p_professional_id: string
        }
        Returns: string
      }
      is_admin_check: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_safe: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_internal_super_admin_check: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_internal_user_check: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin_check: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin_safe: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      sanitize_phone_number: {
        Args: { phone_input: string }
        Returns: string
      }
      submit_lead: {
        Args: {
          p_budget: number
          p_description: string
          p_location: string
          p_professional_id: string
          p_share_percentage: number
          p_title: string
        }
        Returns: boolean
      }
      submit_proposal: {
        Args: {
          p_description: string
          p_estimated_completion: string
          p_lead_id: string
          p_price: number
          p_professional_id: string
        }
        Returns: boolean
      }
      submit_proposal_secure: {
        Args: {
          p_description: string
          p_estimated_completion?: string
          p_lead_id: string
          p_lower_price_value?: number
          p_lower_price_willing?: boolean
          p_price: number
          p_sample_image_url?: string
          token_param?: string
        }
        Returns: string
      }
      update_professional_rating_secure: {
        Args: {
          new_rating: number
          new_review_count: number
          professional_id_param: string
        }
        Returns: undefined
      }
      update_project: {
        Args: { project_data: Json; project_id_param: string }
        Returns: boolean
      }
      update_referral_status_secure: {
        Args: {
          new_status: string
          referral_id_param: string
          token_param?: string
        }
        Returns: boolean
      }
      validate_input_length: {
        Args: { field_name: string; input_text: string; max_length: number }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

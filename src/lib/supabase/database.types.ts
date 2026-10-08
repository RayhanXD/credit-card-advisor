export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          financial: Json;
          goals: Json;
          id: string;
          issuer_relationships: Json;
          name: string;
          next_review_date: string | null;
          onboarding_complete: boolean;
          notification_prefs: Json;
          owned_cards: Json;
          spending: Json;
          travel: Json;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          financial?: Json;
          goals?: Json;
          id: string;
          issuer_relationships?: Json;
          name?: string;
          next_review_date?: string | null;
          notification_prefs?: Json;
          onboarding_complete?: boolean;
          owned_cards?: Json;
          spending?: Json;
          travel?: Json;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          financial?: Json;
          goals?: Json;
          id?: string;
          issuer_relationships?: Json;
          name?: string;
          next_review_date?: string | null;
          notification_prefs?: Json;
          onboarding_complete?: boolean;
          owned_cards?: Json;
          spending?: Json;
          travel?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      issuers: {
        Row: {
          accent_color: string;
          application_rules: Json;
          contact: Json;
          id: string;
          name: string;
        };
        Insert: {
          accent_color: string;
          application_rules?: Json;
          contact: Json;
          id: string;
          name: string;
        };
        Update: {
          accent_color?: string;
          application_rules?: Json;
          contact?: Json;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      transfer_partners: {
        Row: {
          id: string;
          name: string;
          transfers_from: Json;
          type: string;
        };
        Insert: {
          id: string;
          name: string;
          transfers_from?: Json;
          type: string;
        };
        Update: {
          id?: string;
          name?: string;
          transfers_from?: Json;
          type?: string;
        };
        Relationships: [];
      };
      cards: {
        Row: {
          annual_fee: number;
          id: string;
          issuer_id: string;
          name: string;
          product: Json;
        };
        Insert: {
          annual_fee: number;
          id: string;
          issuer_id: string;
          name: string;
          product: Json;
        };
        Update: {
          annual_fee?: number;
          id?: string;
          issuer_id?: string;
          name?: string;
          product?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      delete_own_account: { Args: Record<PropertyKey, never>; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          address: string | null
          category: string
          created_at: string
          description: string | null
          email: string | null
          has_home_service: boolean | null
          has_parking: boolean | null
          id: string
          location: string
          main_image_url: string | null
          name: string
          open_hours: string | null
          phone: string | null
          services: string[] | null
          social_media: Json | null
          specialties: string[] | null
          updated_at: string
          user_id: string | null
          views: number | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string
          description?: string | null
          email?: string | null
          has_home_service?: boolean | null
          has_parking?: boolean | null
          id?: string
          location: string
          main_image_url?: string | null
          name: string
          open_hours?: string | null
          phone?: string | null
          services?: string[] | null
          social_media?: Json | null
          specialties?: string[] | null
          updated_at?: string
          user_id?: string | null
          views?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string
          description?: string | null
          email?: string | null
          has_home_service?: boolean | null
          has_parking?: boolean | null
          id?: string
          location?: string
          main_image_url?: string | null
          name?: string
          open_hours?: string | null
          phone?: string | null
          services?: string[] | null
          social_media?: Json | null
          specialties?: string[] | null
          updated_at?: string
          user_id?: string | null
          views?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          cnpj: string | null
          company_name: string
          created_at: string
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          cnpj?: string | null
          company_name: string
          created_at?: string
          description?: string | null
          email?: string | null
          id: string
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          cnpj?: string | null
          company_name?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      organization_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          organization_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_images_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          action_area: string
          created_at: string
          description: string
          email: string
          id: string
          location: string
          main_image_url: string | null
          name: string
          social_media: Json | null
          type: string
          updated_at: string
          user_id: string
          views: number | null
          website: string | null
          whatsapp: string
        }
        Insert: {
          action_area: string
          created_at?: string
          description: string
          email: string
          id?: string
          location: string
          main_image_url?: string | null
          name: string
          social_media?: Json | null
          type: string
          updated_at?: string
          user_id: string
          views?: number | null
          website?: string | null
          whatsapp: string
        }
        Update: {
          action_area?: string
          created_at?: string
          description?: string
          email?: string
          id?: string
          location?: string
          main_image_url?: string | null
          name?: string
          social_media?: Json | null
          type?: string
          updated_at?: string
          user_id?: string
          views?: number | null
          website?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      pet_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          pet_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          pet_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          pet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_images_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          accepts_children: boolean | null
          accepts_other_animals: boolean | null
          age: string | null
          breed: string | null
          color: string | null
          contact_whatsapp: string | null
          created_at: string
          description: string | null
          gender: string | null
          id: string
          is_neutered: boolean | null
          is_vaccinated: boolean | null
          location: string
          main_image_url: string | null
          name: string
          size: string | null
          status: string
          temperament: string | null
          type: string
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          accepts_children?: boolean | null
          accepts_other_animals?: boolean | null
          age?: string | null
          breed?: string | null
          color?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          description?: string | null
          gender?: string | null
          id?: string
          is_neutered?: boolean | null
          is_vaccinated?: boolean | null
          location: string
          main_image_url?: string | null
          name: string
          size?: string | null
          status: string
          temperament?: string | null
          type: string
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          accepts_children?: boolean | null
          accepts_other_animals?: boolean | null
          age?: string | null
          breed?: string | null
          color?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          description?: string | null
          gender?: string | null
          id?: string
          is_neutered?: boolean | null
          is_vaccinated?: boolean | null
          location?: string
          main_image_url?: string | null
          name?: string
          size?: string | null
          status?: string
          temperament?: string | null
          type?: string
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          contact: string
          created_at: string
          description: string
          home_delivery: boolean | null
          id: string
          location: string
          main_image_url: string | null
          price: number
          social_media: Json | null
          title: string
          updated_at: string
          user_id: string
          views: number | null
          website: string | null
        }
        Insert: {
          category: string
          contact: string
          created_at?: string
          description: string
          home_delivery?: boolean | null
          id?: string
          location: string
          main_image_url?: string | null
          price: number
          social_media?: Json | null
          title: string
          updated_at?: string
          user_id: string
          views?: number | null
          website?: string | null
        }
        Update: {
          category?: string
          contact?: string
          created_at?: string
          description?: string
          home_delivery?: boolean | null
          id?: string
          location?: string
          main_image_url?: string | null
          price?: number
          social_media?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
          views?: number | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      veterinarians: {
        Row: {
          clinic_id: string
          created_at: string
          id: string
          name: string
          specialty: string
        }
        Insert: {
          clinic_id: string
          created_at?: string
          id?: string
          name: string
          specialty: string
        }
        Update: {
          clinic_id?: string
          created_at?: string
          id?: string
          name?: string
          specialty?: string
        }
        Relationships: [
          {
            foreignKeyName: "veterinarians_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

import { createClient } from "@/lib/supabase/client";

export interface SupplierCategory {
  id: string;
  name: string;
  display_order: number;
}

export interface ChecklistCategory {
  id: string;
  name: string;
  label: string;
  display_order: number;
}

export interface RsvpStatus {
  id: string;
  name: string;
  label: string;
  display_order: number;
}

/**
 * Fetch all supplier categories from the database
 */
export async function getSupplierCategories(): Promise<SupplierCategory[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("supplier_categories")
    .select("id, name, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching supplier categories:", error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch all checklist categories from the database
 */
export async function getChecklistCategories(): Promise<ChecklistCategory[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("checklist_categories")
    .select("id, name, label, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching checklist categories:", error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch all RSVP statuses from the database
 */
export async function getRsvpStatuses(): Promise<RsvpStatus[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("rsvp_statuses")
    .select("id, name, label, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching RSVP statuses:", error);
    throw error;
  }

  return data || [];
}

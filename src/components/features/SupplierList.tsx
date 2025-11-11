"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getSupplierCategories } from "@/lib/services/categoryService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Phone, Mail, MapPin, DollarSign, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/types/database.types";

type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];

export function SupplierList() {
  const { user } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  useEffect(() => {
    if (user) {
      fetchSuppliers();
      fetchCategories();
    }
  }, [user]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getSupplierCategories();
      setCategories(data.map(cat => cat.name));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addSupplier = async () => {
    if (formData.name && formData.contact_person && formData.category && user) {
      try {
        const { data, error } = await supabase
          .from("suppliers")
          .insert({
            user_id: user.id,
            name: formData.name,
            category: formData.category,
            contact_person: formData.contact_person,
            email: formData.email || "",
            phone: formData.phone || "",
            cost: formData.cost || 0,
            notes: formData.notes || "",
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setSuppliers([data, ...suppliers]);
          setFormData({});
          setIsDialogOpen(false);
        }
      } catch (error) {
        console.error("Error adding supplier:", error);
      }
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const totalCost = suppliers.reduce((sum, supplier) => sum + Number(supplier.cost), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Supplier List</h2>
          <p className="text-muted-foreground">
            Manage all your wedding vendors in one place
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Add a vendor to your wedding supplier list
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Perfect Flowers"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Person *</Label>
                <Input
                  id="contact"
                  placeholder="e.g., Jane Doe"
                  value={formData.contact_person || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_person: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@supplier.com"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="0.00"
                  value={formData.cost || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Any additional information..."
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
              <Button onClick={addSupplier} className="col-span-2">
                Add Supplier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Vendor Cost</CardTitle>
          <CardDescription>Combined cost of all suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">
            ${totalCost.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{supplier.name}</CardTitle>
                  <CardDescription>{supplier.category}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSupplier(supplier.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {supplier.contact_person && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{supplier.contact_person}</span>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${supplier.phone}`}
                    className="text-primary hover:underline"
                  >
                    {supplier.phone}
                  </a>
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${supplier.email}`}
                    className="text-primary hover:underline truncate"
                  >
                    {supplier.email}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-primary">
                  ${Number(supplier.cost).toLocaleString()}
                </span>
              </div>
              {supplier.notes && (
                <div className="mt-4 pt-3 border-t">
                  <p className="text-sm text-muted-foreground">{supplier.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {suppliers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No suppliers added yet. Click &ldquo;Add Supplier&rdquo; to get started!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

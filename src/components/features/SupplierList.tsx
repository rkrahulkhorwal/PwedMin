"use client";

import { useState } from "react";
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
import { Plus, Trash2, Phone, Mail, MapPin, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  cost: number;
  notes: string;
}

const defaultSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Grand Palace Hotel",
    category: "Venue",
    contact: "John Smith",
    email: "events@grandpalace.com",
    phone: "(555) 123-4567",
    cost: 15000,
    notes: "Main ceremony and reception venue",
  },
  {
    id: "2",
    name: "Delicious Catering Co.",
    category: "Catering",
    contact: "Sarah Johnson",
    email: "info@deliciouscatering.com",
    phone: "(555) 234-5678",
    cost: 12000,
    notes: "3-course meal for 150 guests",
  },
  {
    id: "3",
    name: "Perfect Moments Photography",
    category: "Photography",
    contact: "Mike Chen",
    email: "mike@perfectmoments.com",
    phone: "(555) 345-6789",
    cost: 5000,
    notes: "Full day coverage + album",
  },
];

export function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(defaultSuppliers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({
    category: "Venue",
  });

  const categories = [
    "Venue",
    "Catering",
    "Photography",
    "Videography",
    "Florist",
    "Music/DJ",
    "Decor",
    "Transportation",
    "Other",
  ];

  const addSupplier = () => {
    if (formData.name && formData.contact) {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category || "Other",
        contact: formData.contact,
        email: formData.email || "",
        phone: formData.phone || "",
        cost: formData.cost || 0,
        notes: formData.notes || "",
      };
      setSuppliers([...suppliers, newSupplier]);
      setFormData({ category: "Venue" });
      setIsDialogOpen(false);
    }
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  const totalCost = suppliers.reduce((sum, supplier) => sum + supplier.cost, 0);

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
                  value={formData.contact || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
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
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{supplier.contact}</span>
              </div>
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
                  ${supplier.cost.toLocaleString()}
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

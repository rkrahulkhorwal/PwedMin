"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getRsvpStatuses } from "@/lib/services/categoryService";
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
import { Plus, Trash2, Users, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Database } from "@/lib/types/database.types";

type Guest = Database["public"]["Tables"]["guests"]["Row"];

export function GuestList() {
  const { user } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvpStatuses, setRsvpStatuses] = useState<Array<{ name: string; label: string }>>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Guest>>({
    plus_one: false,
  });

  useEffect(() => {
    if (user) {
      fetchGuests();
      fetchRsvpStatuses();
    }
  }, [user]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error("Error fetching guests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRsvpStatuses = async () => {
    try {
      const data = await getRsvpStatuses();
      setRsvpStatuses(data.map(status => ({ name: status.name, label: status.label })));
      // Set default RSVP status to first status (pending)
      if (data.length > 0 && !formData.rsvp_status) {
        setFormData(prev => ({ ...prev, rsvp_status: data[0].name as "pending" | "accepted" | "declined" }));
      }
    } catch (error) {
      console.error("Error fetching RSVP statuses:", error);
    }
  };

  const totalGuests = guests.reduce(
    (sum, guest) => sum + (guest.plus_one ? 2 : 1),
    0
  );
  const acceptedGuests = guests
    .filter((g) => g.rsvp_status === "accepted")
    .reduce((sum, guest) => sum + (guest.plus_one ? 2 : 1), 0);
  const pendingGuests = guests.filter((g) => g.rsvp_status === "pending").length;
  const declinedGuests = guests.filter((g) => g.rsvp_status === "declined").length;

  const addGuest = async () => {
    if (formData.name && formData.email && formData.rsvp_status && user) {
      try {
        const { data, error } = await supabase
          .from("guests")
          .insert({
            user_id: user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone || "",
            rsvp_status: formData.rsvp_status,
            plus_one: formData.plus_one || false,
            table_number: formData.table_number,
            dietary_restrictions: formData.dietary_restrictions,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setGuests([data, ...guests]);
          // Reset form to default status (pending) if available
          const defaultStatus = rsvpStatuses.length > 0 ? rsvpStatuses[0].name as "pending" | "accepted" | "declined" : undefined;
          setFormData({ rsvp_status: defaultStatus, plus_one: false });
          setIsDialogOpen(false);
        }
      } catch (error) {
        console.error("Error adding guest:", error);
      }
    }
  };

  const deleteGuest = async (id: string) => {
    try {
      const { error } = await supabase.from("guests").delete().eq("id", id);

      if (error) throw error;
      setGuests(guests.filter((guest) => guest.id !== id));
    } catch (error) {
      console.error("Error deleting guest:", error);
    }
  };

  const updateRSVP = async (
    id: string,
    rsvp: "pending" | "accepted" | "declined"
  ) => {
    try {
      const { error } = await supabase
        .from("guests")
        .update({ rsvp_status: rsvp })
        .eq("id", id);

      if (error) throw error;

      setGuests(
        guests.map((guest) =>
          guest.id === id ? { ...guest, rsvp_status: rsvp } : guest
        )
      );
    } catch (error) {
      console.error("Error updating RSVP:", error);
    }
  };

  const getGuestsByRSVP = (status: string) => {
    if (status === "all") return guests;
    return guests.filter((guest) => guest.rsvp_status === status);
  };

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
          <h2 className="text-3xl font-bold tracking-tight">Guest List</h2>
          <p className="text-muted-foreground">
            Manage your wedding attendees and RSVPs
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
              <DialogDescription>
                Add a guest to your wedding list
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="guestName">Name *</Label>
                <Input
                  id="guestName"
                  placeholder="e.g., John Smith"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestEmail">Email *</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  placeholder="guest@email.com"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestPhone">Phone</Label>
                <Input
                  id="guestPhone"
                  placeholder="(555) 123-4567"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Table Number</Label>
                <Input
                  id="tableNumber"
                  type="number"
                  placeholder="1"
                  value={formData.table_number || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      table_number: parseInt(e.target.value) || undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rsvpStatus">RSVP Status</Label>
                <select
                  id="rsvpStatus"
                  value={formData.rsvp_status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rsvp_status: e.target.value as "pending" | "accepted" | "declined",
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {rsvpStatuses.map((status) => (
                    <option key={status.name} value={status.name}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="plusOne"
                  checked={formData.plus_one}
                  onChange={(e) =>
                    setFormData({ ...formData, plus_one: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="plusOne" className="cursor-pointer">
                  Plus One
                </Label>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="dietary">Dietary Restrictions</Label>
                <Input
                  id="dietary"
                  placeholder="e.g., Vegetarian, Gluten-free"
                  value={formData.dietary_restrictions || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dietary_restrictions: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={addGuest} className="col-span-2">
                Add Guest
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Guests</CardDescription>
            <CardTitle className="text-3xl">{totalGuests}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              Including plus ones
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Accepted</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {acceptedGuests}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Confirmed attendees
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {pendingGuests}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Awaiting response
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Declined</CardDescription>
            <CardTitle className="text-3xl text-destructive">
              {declinedGuests}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Unable to attend
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Guests</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
        </TabsList>

        {["all", "accepted", "pending", "declined"].map((status) => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {status.charAt(0).toUpperCase() + status.slice(1)} Guests
                </CardTitle>
                <CardDescription>
                  {getGuestsByRSVP(status).length} guest(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getGuestsByRSVP(status).map((guest) => (
                    <div
                      key={guest.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{guest.name}</span>
                          {guest.plus_one && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              +1
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {guest.email} {guest.phone && `• ${guest.phone}`}
                        </div>
                        {guest.table_number && (
                          <div className="text-xs text-muted-foreground">
                            Table {guest.table_number}
                          </div>
                        )}
                        {guest.dietary_restrictions && (
                          <div className="text-xs text-muted-foreground">
                            🥗 {guest.dietary_restrictions}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <Button
                            variant={guest.rsvp_status === "accepted" ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateRSVP(guest.id, "accepted")}
                          >
                            Accept
                          </Button>
                          <Button
                            variant={guest.rsvp_status === "declined" ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => updateRSVP(guest.id, "declined")}
                          >
                            Decline
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteGuest(guest.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {getGuestsByRSVP(status).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No guests in this category
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

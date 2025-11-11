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
import { Plus, Trash2, Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvp: "pending" | "accepted" | "declined";
  plusOne: boolean;
  tableNumber?: number;
  dietaryRestrictions?: string;
}

const defaultGuests: Guest[] = [
  {
    id: "1",
    name: "John & Mary Smith",
    email: "john.smith@email.com",
    phone: "(555) 111-2222",
    rsvp: "accepted",
    plusOne: true,
    tableNumber: 1,
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.j@email.com",
    phone: "(555) 222-3333",
    rsvp: "accepted",
    plusOne: false,
    tableNumber: 2,
    dietaryRestrictions: "Vegetarian",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "mbrown@email.com",
    phone: "(555) 333-4444",
    rsvp: "pending",
    plusOne: false,
  },
  {
    id: "4",
    name: "Sarah Davis",
    email: "sarah.d@email.com",
    phone: "(555) 444-5555",
    rsvp: "declined",
    plusOne: false,
  },
];

export function GuestList() {
  const [guests, setGuests] = useState<Guest[]>(defaultGuests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Guest>>({
    rsvp: "pending",
    plusOne: false,
  });

  const totalGuests = guests.reduce(
    (sum, guest) => sum + (guest.plusOne ? 2 : 1),
    0
  );
  const acceptedGuests = guests
    .filter((g) => g.rsvp === "accepted")
    .reduce((sum, guest) => sum + (guest.plusOne ? 2 : 1), 0);
  const pendingGuests = guests.filter((g) => g.rsvp === "pending").length;
  const declinedGuests = guests.filter((g) => g.rsvp === "declined").length;

  const addGuest = () => {
    if (formData.name && formData.email) {
      const newGuest: Guest = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        rsvp: formData.rsvp || "pending",
        plusOne: formData.plusOne || false,
        tableNumber: formData.tableNumber,
        dietaryRestrictions: formData.dietaryRestrictions,
      };
      setGuests([...guests, newGuest]);
      setFormData({ rsvp: "pending", plusOne: false });
      setIsDialogOpen(false);
    }
  };

  const deleteGuest = (id: string) => {
    setGuests(guests.filter((guest) => guest.id !== id));
  };

  const updateRSVP = (id: string, rsvp: "pending" | "accepted" | "declined") => {
    setGuests(
      guests.map((guest) => (guest.id === id ? { ...guest, rsvp } : guest))
    );
  };

  const getGuestsByRSVP = (status: string) => {
    if (status === "all") return guests;
    return guests.filter((guest) => guest.rsvp === status);
  };

  const getRSVPIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "declined":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

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
                  value={formData.tableNumber || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tableNumber: parseInt(e.target.value) || undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rsvpStatus">RSVP Status</Label>
                <select
                  id="rsvpStatus"
                  value={formData.rsvp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rsvp: e.target.value as "pending" | "accepted" | "declined",
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="plusOne"
                  checked={formData.plusOne}
                  onChange={(e) =>
                    setFormData({ ...formData, plusOne: e.target.checked })
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
                  value={formData.dietaryRestrictions || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dietaryRestrictions: e.target.value,
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
                          {guest.plusOne && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              +1
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {guest.email} {guest.phone && `• ${guest.phone}`}
                        </div>
                        {guest.tableNumber && (
                          <div className="text-xs text-muted-foreground">
                            Table {guest.tableNumber}
                          </div>
                        )}
                        {guest.dietaryRestrictions && (
                          <div className="text-xs text-muted-foreground">
                            🥗 {guest.dietaryRestrictions}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <Button
                            variant={guest.rsvp === "accepted" ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateRSVP(guest.id, "accepted")}
                          >
                            Accept
                          </Button>
                          <Button
                            variant={guest.rsvp === "declined" ? "destructive" : "outline"}
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

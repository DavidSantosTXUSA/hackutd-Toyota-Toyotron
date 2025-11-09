"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Car, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";

type Booking = {
  id: string;
  car_id: number;
  preferred_location: string;
  booking_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  vehicle_make?: string | null;
  vehicle_model?: string | null;
  vehicle_year?: number | null;
  vehicle_trim?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
};

function BookingCard({ booking }: { booking: Booking }) {
  const bookingDate = new Date(booking.booking_date);

  const getStatusBadge = () => {
    switch (booking.status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{booking.status}</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (booking.status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
      case "confirmed":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const vehicleName = booking.vehicle_make && booking.vehicle_model
    ? `${booking.vehicle_year || ""} ${booking.vehicle_make} ${booking.vehicle_model}${booking.vehicle_trim ? ` ${booking.vehicle_trim}` : ""}`.trim()
    : `Car ID: ${booking.car_id}`;

  return (
    <Card className="border-border/70 bg-card/90 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Car className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{vehicleName}</CardTitle>
              <CardDescription className="mt-1">
                {booking.contact_name || "Test Drive Booking"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                {format(bookingDate, "EEEE, MMMM d, yyyy")}
              </p>
              <p className="text-muted-foreground">
                {format(bookingDate, "h:mm a")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <p className="text-foreground">{booking.preferred_location}</p>
          </div>
          {booking.contact_email && (
            <div className="flex items-start gap-3 text-sm">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <p className="text-muted-foreground">
                Booked on {format(new Date(booking.created_at), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setError("Not authenticated");
          return;
        }

        const response = await fetch("/api/bookings", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const now = new Date();
  const activeBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.booking_date);
    return bookingDate >= now && (booking.status === "pending" || booking.status === "confirmed");
  });

  const historyBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.booking_date);
    return bookingDate < now || booking.status === "completed" || booking.status === "cancelled";
  });

  return (
    <RequireAuth allowWithoutPreferences>
      <div className="flex min-h-full flex-col bg-background text-foreground">
        <div className="flex-1">
          <div className="toyota-container flex h-full max-w-6xl flex-col py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary">My Profile</h1>
              <p className="mt-2 text-muted-foreground">
                View your test drive bookings and history
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="mt-4 text-sm text-muted-foreground">Loading bookings...</p>
                </div>
              </div>
            ) : error ? (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardHeader>
                  <CardTitle className="text-destructive">Error</CardTitle>
                  <CardDescription>{error}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="active">
                    Active Meetings ({activeBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    History ({historyBookings.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {activeBookings.length === 0 ? (
                    <Card className="border-border/70 bg-card/90">
                      <CardContent className="py-12 text-center">
                        <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold text-foreground">No active bookings</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          You don't have any upcoming test drive appointments.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {activeBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  {historyBookings.length === 0 ? (
                    <Card className="border-border/70 bg-card/90">
                      <CardContent className="py-12 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold text-foreground">No booking history</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Your past test drive bookings will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {historyBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}


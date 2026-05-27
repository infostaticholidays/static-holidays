import {
  useGetProperty,
  useGetPropertyReviews,
  useCreateBooking,
} from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Check,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function PropertyDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const propertyId = parseInt(id || "0", 10);

  const { data: property, isLoading } = useGetProperty(propertyId, {
    query: { enabled: !!propertyId },
  });

  const { data: reviews } = useGetPropertyReviews(propertyId, {
    query: { enabled: !!propertyId },
  });

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState(1);
  const [useInstalments, setUseInstalments] = useState(false);

  const createBookingMutation = useCreateBooking({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Booking created!" });
        setLocation(`/bookings/${data.id}`);
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      },
    },
  });

  const handleBook = () => {
    if (!user) return setLocation("/login");
    if (!date) return;

    const checkOut = new Date(date);
    checkOut.setDate(checkOut.getDate() + 3);

    createBookingMutation.mutate({
      data: {
        propertyId,
        checkIn: date.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        instalmentPlan: useInstalments,
      },
    });
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!property) return <div className="p-8">Property not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>

      <div className="flex items-center gap-4 text-sm mb-6">
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          {property.averageRating?.toFixed(1) || "New"}
        </span>
        <span>
          <MapPin className="inline h-4 w-4" /> {property.location}
        </span>
      </div>

      <img
        src={property.images?.[0] || "/images/cottage.png"}
        className="w-full h-[400px] object-cover rounded-xl mb-6"
      />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <p>{property.description}</p>

          <div className="grid grid-cols-2 gap-4">
            {property.amenities?.map((a: string) => (
              <div key={a} className="flex items-center gap-2">
                <Check className="h-4 w-4" /> {a}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="text-xl font-bold">
              £{property.pricePerNight} / night
            </div>

            <Button onClick={handleBook} className="w-full">
              Reserve
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

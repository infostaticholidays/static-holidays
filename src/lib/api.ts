// src/lib/api.ts
// MOCK API (Vercel safe - no external packages required)

// ================= PROPERTIES =================

export function useListProperties() {
  return {
    data: {
      total: 1,
      properties: [
        {
          id: 1,
          title: "Cornwall Beach Cottage",
          location: "Cornwall",
          county: "UK",
          pricePerNight: 120,
          averageRating: 4.8,
          reviewCount: 10,
          maxGuests: 4,
          bedrooms: 2,
          bathrooms: 1,
          hostName: "John",
          hostAvatarUrl: "",
          description: "Beautiful seaside cottage",
          amenities: ["wifi", "kitchen"],
          petFriendly: true,
          images: ["/images/cottage.png"],
        },
      ],
    },
    isLoading: false,
  };
}

export function useGetProperty(id: number) {
  return {
    data: {
      id,
      title: "Cornwall Beach Cottage",
      location: "Cornwall",
      county: "UK",
      pricePerNight: 120,
      averageRating: 4.8,
      reviewCount: 10,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      hostName: "John",
      hostAvatarUrl: "",
      description: "Beautiful seaside cottage",
      amenities: ["wifi", "kitchen"],
      petFriendly: true,
      images: ["/images/cottage.png"],
    },
    isLoading: false,
  };
}

export function useGetPropertyReviews() {
  return { data: [] };
}

// ================= EVENTS =================

export function useListEvents() {
  return {
    data: [
      {
        id: 1,
        title: "Cornwall Festival",
        category: "Festival",
        location: "Cornwall",
        county: "UK",
        date: new Date().toISOString(),
        endDate: new Date().toISOString(),
        organizer: "Council",
        price: 0,
        isFree: true,
        imageUrl: "",
      },
    ],
    isLoading: false,
  };
}

export function useGetEvent(id: number) {
  return {
    data: {
      id,
      title: "Sample Event",
      description: "Demo event",
      category: "Festival",
      location: "UK",
      county: "England",
      date: new Date().toISOString(),
      endDate: new Date().toISOString(),
      organizer: "Local",
      price: 10,
      isFree: false,
      imageUrl: "",
    },
    isLoading: false,
  };
}

// ================= BOOKINGS =================

export function useListBookings() {
  return { data: [], isLoading: false };
}

export function useGetBooking() {
  return { data: null, isLoading: false };
}

export function useGetPaymentPlan() {
  return { data: null };
}

export function usePayInstalment() {
  return { mutate: () => {}, isPending: false };
}

// ================= SHOP =================

export function useListProducts() {
  return {
    data: [
      {
        id: 1,
        name: "Holiday Candle",
        price: 25,
        category: "Gifts",
        imageUrl: "",
        stock: 10,
      },
    ],
    isLoading: false,
  };
}

export function useGetProduct(id: number) {
  return {
    data: {
      id,
      name: "Sample Product",
      price: 30,
      category: "Gifts",
      imageUrl: "",
      stock: 5,
      description: "Demo product",
    },
    isLoading: false,
  };
}

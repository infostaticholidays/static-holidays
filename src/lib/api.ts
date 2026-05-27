// =========================
// SAFE MOCK API (WORKS ON VERCEL)
// =========================

// -------- PROPERTIES --------

export const useListProperties = () => ({
  data: {
    total: 1,
    properties: [
      {
        id: 1,
        title: "Cornwall Cottage",
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
});

export const useGetProperty = () => ({
  data: {
    id: 1,
    title: "Cornwall Cottage",
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
});

export const useGetPropertyReviews = () => ({
  data: [],
  isLoading: false,
});

// -------- BOOKINGS --------

export const useCreateBooking = () => ({
  mutate: () => {},
  isPending: false,
});

// -------- EVENTS --------

export const useListEvents = () => ({
  data: [],
  isLoading: false,
});

export const useGetEvent = () => ({
  data: null,
  isLoading: false,
});

// -------- SHOP --------

export const useListProducts = () => ({
  data: [],
  isLoading: false,
});

export const useGetProduct = () => ({
  data: null,
  isLoading: false,
});

// -------- PROFILE --------

export const useGetGuestTrustScore = () => ({
  data: {
    score: 80,
    totalReviews: 5,
    averageRating: 4.5,
    badges: ["Trusted Guest"],
    memberSince: new Date().toISOString(),
    verifiedIdentity: true,
  },
  isLoading: false,
});

export const useGetGuestReviews = () => ({
  data: [],
  isLoading: false,
});

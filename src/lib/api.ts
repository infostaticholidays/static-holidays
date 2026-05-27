// 🔥 LOCAL MOCK API (Vercel SAFE)
// This replaces @workspace/api-client-react

// ================= PROPERTIES =================

export const useListProperties = () => ({
  data: {
    total: 2,
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
      }
    ]
  },
  isLoading: false
});

export const useGetProperty = (id: number) => ({
  data: {
    id,
    title: "Sample Property",
    location: "UK",
    county: "England",
    pricePerNight: 100,
    averageRating: 4.5,
    reviewCount: 5,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    hostName: "Host",
    hostAvatarUrl: "",
    description: "Demo property",
    amenities: ["wifi"],
    petFriendly: true,
    images: ["/images/cottage.png"],
  },
  isLoading: false
});

export const useGetPropertyReviews = () => ({
  data: []
});

// ================= EVENTS =================

export const useListEvents = () => ({
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
      imageUrl: ""
    }
  ],
  isLoading: false
});

export const useGetEvent = (id: number) => ({
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
    imageUrl: ""
  },
  isLoading: false
});

// ================= BOOKINGS =================

export const useListBookings = () => ({
  data: [],
  isLoading: false
});

export const useGetBooking = () => ({
  data: null,
  isLoading: false
});

export const useGetPaymentPlan = () => ({
  data: null
});

export const usePayInstalment = () => ({
  mutate: () => {},
  isPending: false
});

// ================= SHOP =================

export const useListProducts = () => ({
  data: [
    {
      id: 1,
      name: "Holiday Candle",
      price: 25,
      category: "Gifts",
      imageUrl: "",
      stock: 10
    }
  ],
  isLoading: false
});

export const useGetProduct = (id: number) => ({
  data: {
    id,
    name: "Sample Product",
    price: 30,
    category: "Gifts",
    imageUrl: "",
    stock: 5,
    description: "Demo product"
  },
  isLoading: false
});

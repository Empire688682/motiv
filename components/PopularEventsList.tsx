"use client";

import { usePopularEvents } from "@/lib/hooks/useEvents";
import { EventCard } from "./EventCard";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SearchModal } from "./modals/SearchModal";

// Utility function to calculate minimum price from ticket types
const getMinPrice = (event: any): string => {
  const ticketTypes = event.ticket_types || event.TicketTypes || [];
  
  if (!ticketTypes || ticketTypes.length === 0) {
    return "TBD";
  }
  
  // Check if event is free (has ticket type with price 0)
  const hasFreeTickets = ticketTypes.some((tt: any) => 
    (tt.price || tt.Price || 0) === 0
  );
  
  if (hasFreeTickets && ticketTypes.length === 1) {
    return "FREE";
  }
  
  // Find minimum non-zero price
  const prices = ticketTypes
    .map((tt: any) => tt.price || tt.Price || 0)
    .filter((p: number) => p > 0);
  
  if (prices.length === 0) {
    return "FREE";
  }
  
  const minPrice = Math.min(...prices);
  return `From ₦${minPrice.toLocaleString()}`;
};

export function PopularEventsList() {
  const [mounted, setMounted] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: events, isLoading, error, refetch } = usePopularEvents(6);

  const handleShowMore = async () => {
    // Invalidate the cache and force a fresh fetch
    await queryClient.invalidateQueries({ queryKey: ['events', 'popular'] });
    refetch();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading popular events...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading popular events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Failed to load popular events</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  // Debug logging
  console.log("Popular events data:", events);
  console.log("Number of events:", events?.length);
  
  // Log each event for debugging
  if (events) {
    events.forEach((event, index) => {
      console.log(`Event ${index + 1}:`, {
        id: event.id,
        title: event.title,
        location: event.location,
        startDate: event.start_date
      });
    });
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">No popular events found</p>
        <p className="text-sm text-gray-500">
          Check back later for exciting events!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
          console.log(`Rendering event ${index + 1}:`, event.id, event.title);
          try {
            const startDate = new Date(event.start_date);
            const month = startDate
              .toLocaleDateString("en-US", { month: "short" })
              .toUpperCase();
            const day = startDate.getDate().toString().padStart(2, "0");
            const tags = (event.tags && Array.isArray(event.tags)) ? event.tags : [];
            
            // Calculate minimum price from ticket types
            const minPrice = getMinPrice(event);

            return (
              <EventCard
                key={`popular-event-${event.id}-${index}`}
                id={event.id}
                image={
                  event.banner_image_url ||
                  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop&auto=format"
                }
                title={event.title}
                location={event.location}
                time={`${event.start_time} - ${event.end_time}`}
                month={month}
                day={day}
                tags={tags}
                showTags={true}
                price={minPrice}
              />
            );
          } catch (error) {
            console.error(`Error rendering event ${index + 1}:`, event.id, error);
            console.error("Event data that failed:", event);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return (
              <div key={`error-event-${event.id}-${index}`} className="p-4 border border-red-500 rounded">
                <p className="text-red-500">Error rendering event: {event.title}</p>
                <p className="text-xs text-gray-500">{errorMessage}</p>
              </div>
            );
          }
        })}
      </div>

      {/* Show More Button */}
      <div className="text-center">
        <Button
          onClick={() => setIsSearchModalOpen(true)}
          variant="outline"
          size="lg"
          className="border-[#D72638] text-[#D72638] hover:bg-[#D72638] hover:text-white"
        >
          Find more events
        </Button>
      </div>
    </div>
  );
}
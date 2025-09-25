"use client";

import { usePopularEvents } from "@/lib/hooks/useEvents";
import { EventCard } from "./EventCard";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SearchModal } from "./modals/SearchModal";

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
        id: event.id || event.ID,
        title: event.title || event.Title,
        location: event.location || event.Location,
        startDate: event.start_date || event.StartDate
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
          console.log(`Rendering event ${index + 1}:`, event.id || event.ID, event.title || event.Title);
          try {
            const startDate = new Date(event.start_date || event.StartDate);
            const month = startDate
              .toLocaleDateString("en-US", { month: "short" })
              .toUpperCase();
            const day = startDate.getDate().toString().padStart(2, "0");
            const tags =
              (event.tags && Array.isArray(event.tags)) ? event.tags : 
              (event.Tags && Array.isArray(event.Tags)) ? event.Tags : [];

            return (
              <EventCard
                key={`popular-event-${event.id || event.ID}-${index}`}
                id={event.id || event.ID}
                image={
                  event.banner_image_url || event.BannerImageURL ||
                  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop&auto=format"
                }
                title={event.title || event.Title}
                location={event.location || event.Location}
                time={`${event.start_time || event.StartTime} - ${event.end_time || event.EndTime}`}
                month={month}
                day={day}
                tags={tags}
                showTags={true}
                price="From ₦500"
              />
            );
          } catch (error) {
            console.error(`Error rendering event ${index + 1}:`, event.id || event.ID, error);
            console.error("Event data that failed:", event);
            return (
              <div key={`error-event-${event.id || event.ID}-${index}`} className="p-4 border border-red-500 rounded">
                <p className="text-red-500">Error rendering event: {event.title || event.Title}</p>
                <p className="text-xs text-gray-500">{error.message}</p>
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
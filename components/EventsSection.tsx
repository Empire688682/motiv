"use client";

import { useFilter } from "@/lib/contexts/FilterContext";
import { EventListWrapper as EventList } from "./EventListWrapper";
import { PopularEventsList } from "./PopularEventsList";

export function EventsSection() {
  const { getDateFilter } = useFilter();
  const filterParams = getDateFilter();
  
  // Check if any filters are active
  const hasActiveFilters = filterParams.dateFrom || filterParams.dateTo;
  
  // Show popular events when no filters are active, otherwise show filtered events
  return hasActiveFilters ? <EventList {...filterParams} /> : <PopularEventsList />;
}
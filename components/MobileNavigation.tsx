"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Heart,
  Calendar,
  Menu,
  X,
  User,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserProfileModal } from "./auth/UserProfileModal";
import { SearchModal } from "./modals/SearchModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetOverlay,
} from "@/components/ui/sheet";

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    name: "My Events",
    href: "/my-events",
    icon: Calendar,
  },
];

const menuItems = [
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
  },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { user, logout, updateProfile } = useAuth();

  // Don't show mobile nav on host pages
  if (pathname.startsWith("/hosts")) {
    return null;
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 z-50">
        <div className="grid grid-cols-4 h-16">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={
                  `flex flex-col items-center justify-center space-y-1 transition-colors touch-manipulation",
                  ${isActive ? "text-white" : "text-gray-400 hover:text-gray-300"}`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetOverlay className="z-[65]" />
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-gray-300 transition-colors touch-manipulation">
                <Menu className="w-5 h-5" />
                <span className="text-xs font-medium">Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-auto max-h-[50vh] rounded-t-2xl bg-[#1a1a1a] border-gray-700 [&>button]:text-white [&>button]:hover:text-gray-300 z-[70] flex flex-col"
            >
              <SheetHeader className="text-left mb-6 flex-shrink-0">
                <SheetTitle className="text-xl font-bold text-white">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-1 flex-1 overflow-y-auto pb-6">
                <button
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors touch-manipulation"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={() => {
                    setIsSearchModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors touch-manipulation"
                >
                  <Search className="w-5 h-5" />
                  <span className="font-medium">Search</span>
                </button>



                {/* Host Mode Toggle */}
                <div className="border-t border-gray-700 my-4"></div>

                <Link
                  href="/hosts/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[#D72638] to-[#B91E2F] text-white hover:from-[#B91E2F] hover:to-[#A01A2A] transition-all touch-manipulation"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-sm font-bold">H</span>
                  </div>
                  <span className="font-medium">Switch to Host Mode</span>
                </Link>

                {/* Logout */}
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors touch-manipulation mt-4">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for mobile navigation */}
      <div className="sm:hidden h-16"></div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {user && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          onLogout={logout}
          onUpdateProfile={updateProfile}
        />
      )}
    </>
  );
}

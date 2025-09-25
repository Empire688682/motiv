"use client";

import { useState } from "react";
import { MobileNavigation } from "@/components/MobileNavigation";

export default function TestSidebarOverlay() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-white mb-8">Test Sidebar Overlay</h1>
        
        <div className="space-y-4 text-white">
          <p>This page tests the mobile sidebar overlay functionality.</p>
          <p className="text-sm text-gray-400">
            <strong>Instructions:</strong>
          </p>
          <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
            <li>Open this page on mobile or resize your browser to mobile width</li>
            <li>Click the "Menu" button in the bottom navigation</li>
            <li>The sidebar should now cover the entire screen including the bottom navigation</li>
            <li>All menu options should be visible without being cut off</li>
          </ul>
          
          <div className="bg-gray-800 p-4 rounded-lg mt-8">
            <h3 className="font-bold text-white mb-2">Expected Behavior:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>✅ Sidebar covers full screen height (100vh)</li>
              <li>✅ Sidebar appears above bottom navigation (z-index: 70)</li>
              <li>✅ Backdrop overlay covers bottom navigation (z-index: 65)</li>
              <li>✅ All menu options are fully visible</li>
              <li>✅ Clicking outside closes the sidebar</li>
            </ul>
          </div>
        </div>

        {/* Add some content to make the page scrollable */}
        <div className="space-y-4 mt-16">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold">Content Block {i + 1}</h3>
              <p className="text-gray-400 text-sm">
                This is sample content to make the page longer and test scrolling behavior.
              </p>
            </div>
          ))}
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}
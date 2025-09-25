"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Calendar, Mail, TrendingUp, Activity } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";

interface PlatformStats {
  total_users: number;
  guest_users: number;
  host_users: number;
  admin_users: number;
  total_events: number;
  total_tickets: number;
  newsletter_subscribers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get<PlatformStats>("/admin/stats");
      setStats(response);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load platform statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D72638]"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#D72638]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total_users.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              {stats.guest_users} guests, {stats.host_users} hosts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total_events.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Events created on platform
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Tickets</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total_tickets.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              Tickets sold/reserved
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Newsletter Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.newsletter_subscribers.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              {stats.total_users > 0 ? Math.round((stats.newsletter_subscribers / stats.total_users) * 100) : 0}% of users subscribed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Guests</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{stats.guest_users.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">
                    {stats.total_users > 0 ? Math.round((stats.guest_users / stats.total_users) * 100) : 0}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Hosts</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{stats.host_users.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">
                    {stats.total_users > 0 ? Math.round((stats.host_users / stats.total_users) * 100) : 0}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#D72638] rounded-full"></div>
                  <span className="text-gray-300">Admins</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{stats.admin_users.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">
                    {stats.total_users > 0 ? Math.round((stats.admin_users / stats.total_users) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Platform Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Events per Host</span>
                <span className="text-white font-semibold">
                  {stats.host_users > 0 ? (stats.total_events / stats.host_users).toFixed(1) : "0"}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Tickets per Event</span>
                <span className="text-white font-semibold">
                  {stats.total_events > 0 ? (stats.total_tickets / stats.total_events).toFixed(1) : "0"}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Tickets per User</span>
                <span className="text-white font-semibold">
                  {stats.total_users > 0 ? (stats.total_tickets / stats.total_users).toFixed(1) : "0"}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Newsletter Rate</span>
                <span className="text-white font-semibold">
                  {stats.total_users > 0 ? Math.round((stats.newsletter_subscribers / stats.total_users) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Users className="h-5 w-5 text-[#D72638]" />
              <div>
                <div className="font-medium text-white">Manage Users</div>
                <div className="text-sm text-gray-400">View and edit user accounts</div>
              </div>
            </a>
            
            <a
              href="/admin/transactions"
              className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <CreditCard className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium text-white">View Transactions</div>
                <div className="text-sm text-gray-400">Monitor payment activity</div>
              </div>
            </a>
            
            <button
              onClick={fetchStats}
              className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium text-white">Refresh Stats</div>
                <div className="text-sm text-gray-400">Update dashboard data</div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
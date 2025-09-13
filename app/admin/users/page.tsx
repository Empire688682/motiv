"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  newsletter_subscribed: boolean;
  created_at: string;
}

interface UserDetails extends User {
  tickets: any[];
  events: any[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  const limit = 20;

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append("search", search);
      if (roleFilter && roleFilter !== "all") params.append("role", roleFilter);

      const response = await apiClient.get<{
        data: User[];
        total: number;
        hasMore: boolean;
      }>(`/admin/users?${params}`);
      
      setUsers(response.data);
      setTotal(response.total);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await apiClient.get<{
        user: UserDetails;
        tickets: any[];
        events: any[];
      }>(`/admin/users/${userId}`);
      
      setSelectedUser({
        ...response.user,
        tickets: response.tickets || [],
        events: response.events || [],
      });
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setUpdatingRole(true);
      await apiClient.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success("User role updated successfully");
      
      // Update the user in the list
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      // Update selected user if it's the same one
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value === "all" ? "" : value);
    setPage(1);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500";
      case "host": return "bg-green-500";
      case "superhost": return "bg-purple-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Users Management</h2>
          <p className="text-gray-400">Manage user accounts and roles</p>
        </div>
        <div className="text-sm text-gray-400">
          Total: {total.toLocaleString()} users
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name, email, or username..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <Select value={roleFilter || "all"} onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
                <SelectItem value="host">Host</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superhost">Superhost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D72638]"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No users found
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#D72638] rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-gray-400">@{user.username}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                        {user.role}
                      </Badge>
                      <div className="text-xs text-gray-400 mt-1">
                        {user.newsletter_subscribed ? "📧 Subscribed" : ""}
                      </div>
                      <div className="text-xs text-gray-400">
                        {(() => {
                          try {
                            return user.created_at ? `Joined ${format(new Date(user.created_at), "MMM yyyy")}` : "Join date unknown";
                          } catch {
                            return "Join date invalid";
                          }
                        })()}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUserDetails(user.id)}
                      className="border-gray-600 text-gray-400 bg-transparent hover:bg-transparent hover:text-[#D72638]"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-400">
                  Page {page} of {Math.ceil(total / limit)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={!hasMore}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-2xl bg-[#1a1a1a] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <div className="text-white">{selectedUser.name}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Username</label>
                  <div className="text-white">@{selectedUser.username}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <div className="text-white">{selectedUser.email}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Role</label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedUser.role || "guest"}
                      onValueChange={(value) => updateUserRole(selectedUser.id, value)}
                      disabled={updatingRole}
                    >
                      <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guest">Guest</SelectItem>
                        <SelectItem value="host">Host</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="superhost">Superhost</SelectItem>
                      </SelectContent>
                    </Select>
                    {updatingRole && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D72638]"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">{selectedUser.tickets.length}</div>
                  <div className="text-sm text-gray-400">Tickets</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">{selectedUser.events.length}</div>
                  <div className="text-sm text-gray-400">Events</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {selectedUser.newsletter_subscribed ? "✓" : "✗"}
                  </div>
                  <div className="text-sm text-gray-400">Newsletter</div>
                </div>
              </div>

              {/* Joined Date */}
              <div>
                <label className="text-sm text-gray-400">Member Since</label>
                <div className="text-white">
                  {(() => {
                    try {
                      return selectedUser.created_at 
                        ? format(new Date(selectedUser.created_at), "MMMM do, yyyy 'at' h:mm a")
                        : "Unknown";
                    } catch {
                      return "Date invalid";
                    }
                  })()}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
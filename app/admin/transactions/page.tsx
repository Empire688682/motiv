"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, CreditCard, Wallet } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  created_at: string;
  processed_at?: string;
  failure_reason?: string;
  event?: {
    id: string;
    title: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const limit = 20;

  useEffect(() => {
    fetchTransactions();
  }, [page, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);

      const response = await apiClient.get<{
        data: Transaction[];
        total: number;
        hasMore: boolean;
      }>(`/admin/transactions?${params}`);
      
      setTransactions(response.data);
      setTotal(response.total);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value === "all" ? "" : value);
    setPage(1);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "failed": return "bg-red-500";
      case "cancelled": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "card":
      case "paystack":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  const totalAmount = transactions.reduce((sum, transaction) => {
    return transaction.status === "completed" ? sum + transaction.amount : sum;
  }, 0);

  return (
    <div className="space-y-6 p-4 md:p-8 bg-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Transactions</h2>
          <p className="text-gray-400">Monitor payment activity and revenue</p>
        </div>
        <div className="text-sm text-gray-400">
          Total: {total.toLocaleString()} transactions
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Revenue (Page)</p>
                <p className="text-2xl font-bold text-white">
                  ₦{totalAmount.toLocaleString()}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed Transactions</p>
                <p className="text-2xl font-bold text-white">
                  {transactions.filter(t => t.status === "completed").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Failed Transactions</p>
                <p className="text-2xl font-bold text-white">
                  {transactions.filter(t => t.status === "failed").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✗</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={statusFilter || "all"} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-900 border-gray-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D72638]"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No transactions found
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-900 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      {getMethodIcon(transaction.method)}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {transaction.event?.title || "Unknown Event"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {transaction.user?.name} ({transaction.user?.email})
                      </div>
                      <div className="text-xs text-gray-500">
                        Ref: {transaction.reference}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <div className="font-semibold text-white">
                      ₦{transaction.amount.toLocaleString()}
                    </div>
                    <Badge className={`${getStatusBadgeColor(transaction.status)} text-white mb-1`}>
                      {transaction.status}
                    </Badge>
                    <div className="text-xs text-gray-400">
                      {(() => {
                        try {
                          return transaction.created_at 
                            ? format(new Date(transaction.created_at), "MMM dd, yyyy")
                            : "Date unknown";
                        } catch {
                          return "Date invalid";
                        }
                      })()}
                    </div>
                    {transaction.processed_at && (
                      <div className="text-xs text-gray-500">
                        Processed: {(() => {
                          try {
                            return format(new Date(transaction.processed_at), "MMM dd, HH:mm");
                          } catch {
                            return "Date invalid";
                          }
                        })()}
                      </div>
                    )}
                    {transaction.failure_reason && (
                      <div className="text-xs text-red-400 max-w-32 truncate">
                        {transaction.failure_reason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} transactions
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
                  className="border-gray-600 text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-400"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
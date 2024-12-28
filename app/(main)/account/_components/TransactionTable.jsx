"use client";
import { bulkDeleteTransactions } from "@/actions/accounts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categoryColors } from "@/data/categories";
import { useFetch } from "@/hooks/useFetch";
import { format } from "date-fns";
import {
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

const Recurring_INTERVAL = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurrinngFilter, setRecurringFilter] = useState("");

  const [sortedconfig, setSortedConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const handleSort = (field) => {
    setSortedConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (search) {
      const searchlower = search.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchlower)
      );
    }

    if (recurrinngFilter) {
      result = result.filter(
        (transaction) =>
          transaction.isRecurring === (recurrinngFilter === "recurring")
      );
    }
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    //apply sorting

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortedconfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;

        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortedconfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, search, typeFilter, recurrinngFilter, sortedconfig]);

  const handleClearFilter = () => {
    setSearch("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  };
  const {
    loading: deleteloading,
    fn: deleteFn,
    data: deleted,
    error,
  } = useFetch(bulkDeleteTransactions);

  const [selectedIds, setSelectedIds] = useState([]);
  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} these transactions?`
      )
    ) {
      return;
    }
    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteloading) {
      toast.error("Transactions Deleted Successfully");
      setSelectedIds([]);
    }
  }, [deleted, deleteloading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current?.filter((item) => item != id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current?.length === filteredAndSortedTransactions?.length
        ? []
        : filteredAndSortedTransactions?.map((transaction) => transaction.id)
    );
  };
  console.log(selectedIds);

  const router = useRouter();
  return (
    <div className="space-y-4">
      {deleteloading && (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}
      <div className="flex flex-col sm:flex-row gap-4  ">
        <div className="relative flex-1 ">
          <Search className=" absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 "
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="INCOME"> Income </SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={recurrinngFilter}
            onValueChange={(value) => setRecurringFilter(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="recurring">Recurring Only </SelectItem>
              <SelectItem value="nonrecurring">Non recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                {" "}
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected({selectedIds.length})
              </Button>
            </div>
          )}

          {(search || typeFilter || recurrinngFilter) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilter}
              title="Clear Filters"
              className="px-1"
            >
              <X className="h-4 w-4 " />
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds?.length ===
                      filteredAndSortedTransactions?.length &&
                    filteredAndSortedTransactions?.length > 0
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center"> Date</div>
              </TableHead>
              <TableHead>Description</TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center"> Category</div>
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">Amount </div>
              </TableHead>

              <TableHead>Recurring</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No Transactions Found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>

                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className=" font-medium"
                    style={{
                      color:
                        transaction.type === "INCOME" ? "#10B981" : "#EF4444",
                    }}
                  >
                    <span className="hidden sm:inline">
                      {transaction.type === "INCOME" ? "+" : "-"}{" "}
                    </span>
                    ₹{transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="gap-1 text-purple-700 hover:bg-purple-200"
                            >
                              <RefreshCw className="h-3 w-3" />
                              {
                                Recurring_INTERVAL[
                                  transaction.recurringInterval
                                ]
                              }
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {format(
                                  new Date(transaction.nextRecurringDate),
                                  "PP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4 p-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;

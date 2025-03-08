"use client";

import { use, useEffect, useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import getRequest from "../utils/getRequest.js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Loader from "../../components/others/Loader.jsx";
import postRequest from "../utils/postRequest.js";
import { io } from "socket.io-client";
const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Demo data for the table
const data = [
  [1, "John Doe", "john@example.com", "Admin", "Active", "2023-03-15"],
  [2, "Jane Smith", "jane@example.com", "User", "Active", "2023-03-14"],
  [
    3,
    "Robert Johnson",
    "robert@example.com",
    "Editor",
    "Inactive",
    "2023-02-28",
  ],
  [4, "Emily Davis", "emily@example.com", "User", "Active", "2023-03-12"],
  [5, "Michael Wilson", "michael@example.com", "Admin", "Active", "2023-03-10"],
];

export default function Dashboard() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("text");
  const [dynamicColumnHeader, setDynamicColumnHeader] = useState([]);
  const [dynamicColumnData, setDynamicColumnData] = useState([]);
  const [openConfigure, setOpenConfigure] = useState(false);
  const [columnCount, setColumnCount] = useState(0);
  const [columns, setColumns] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [isSavePending, setIsSavePending] = useState(false);
  const [isSaveColumnPending, setIsSaveColumnPending] = useState(false);

  // handle column count change
  const handleColumnCountChange = (e) => {
    const count = Number.parseInt(e.target.value) || 0;
    setColumnCount(count);

    // Update columns array based on new count
    if (count > columns.length) {
      // Add new columns
      const newColumns = [...columns];
      for (let i = columns.length; i < count; i++) {
        newColumns.push({ name: "", type: "text" });
      }
      setColumns(newColumns);
    } else if (count < columns.length) {
      // Remove excess columns
      setColumns(columns.slice(0, count));
    }
  };

  // handle name change in configure dialog
  const handleNameChange = (index, value) => {
    const newColumns = [...columns];
    newColumns[index].name = value;
    setColumns(newColumns);
  };

  //handle type change in configure dialog
  const handleTypeChange = (index, value) => {
    const newColumns = [...columns];
    newColumns[index].type = value;
    setColumns(newColumns);
  };

  //handle configure dialog submit
  const handleSubmit = async () => {
    try {
      setIsSavePending(true);
      const result = await postRequest(`${apiUrl}/update-selected-columns`, {
        selectedColumns: columns,
      });

      if (result.suceess === true) {
        toast("Success", {
          description: "Column is updated!",
        });
      } else {
        if (result.status === 401) {
          router.push("/login");
        }
        toast("Error", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("column update error:", error);
    } finally {
      setIsSavePending(false);
      setOpenConfigure(false);
    }
  };

  // Add a new column to the table
  const addColumn = () => {
    if (!newColumnName) {
      toast("Error", {
        description: "Name is required!",
      });
      return;
    }

    setDynamicColumnHeader((prev) => [
      ...prev,
      { name: newColumnName, type: newColumnType },
    ]);

    setDynamicColumnData((prev) => {
      const newData = [...prev];

      for (let i = 0; i < tableData.length; i++) {
        if (Array.isArray(newData[i])) {
          newData[i] = [...newData[i], ""];
        } else {
          newData[i] = [""];
        }
      }

      return newData;
    });

    setNewColumnName("");
  };

  //handle input change for dynamic columns
  const handleInputChange = (rowIndex, colIndex, value) => {
    setDynamicColumnData((prevData) => {
      const newData = prevData.map((row, i) =>
        i === rowIndex
          ? row.map((cell, j) => (j === colIndex ? value : cell))
          : row
      );
      return newData;
    });
  };

  //handle column for dynamic columns
  const handleColumnSave = async () => {
    try {
      setIsSaveColumnPending(true);
      const result = await postRequest(`${apiUrl}/update-column`, {
        header: dynamicColumnHeader,
        data: dynamicColumnData,
      });

      if (result.suceess === true) {
        toast("Success", {
          description: "Column is updated!",
        });
      } else {
        if (result.status === 401) {
          router.push("/login");
        }
        toast("Error", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("column update error:", error);
    } finally {
      setIsSaveColumnPending(false);
    }
  };

  useEffect(() => {
    (async () => {
      setIsPending(true);
      const result = await Promise.all([
        getRequest(`${apiUrl}/sheet-data`),
        getRequest(`${apiUrl}/get-column`),
      ]);

      setIsPending(false);
      if (result[0].suceess === true) {
        setTableData(result[0].data?.data);
        console.log(result[0].data.data);
        setColumns(result[0].data?.user?.selectedColumns);
        setColumnCount(result[0].data?.user?.selectedColumns.length);
        if (!result[1].data) {
          setDynamicColumnHeader([]);
          setDynamicColumnData([]);
        } else {
          setDynamicColumnHeader(result[1].data?.column?.header);
          setDynamicColumnData(result[1].data?.column?.data);
        }
      } else {
        if (result[0].status === 401) {
          router.push("/login");
        }
        toast.error(result[0].message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    })();
  }, []);

  //sockets
  useEffect(() => {
    socket.on("googleSheetsUpdate", (data) => {
      setTableData(data);
    });

    return () => socket.off("googleSheetsUpdate");
  }, []);

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-6">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center py-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* dialog for creating initail column */}
              <Dialog open={openConfigure} onOpenChange={setOpenConfigure}>
                <DialogTrigger asChild>
                  <Button variant="outline">Configure Columns</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Column Configuration</DialogTitle>
                    <DialogDescription>
                      Specify the number of columns and configure each one.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="columnCount" className="text-right">
                        No. of columns:
                      </Label>
                      <Input
                        id="columnCount"
                        type="number"
                        min="0"
                        value={columnCount}
                        onChange={handleColumnCountChange}
                        className="col-span-3"
                      />
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {columns.map((column, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-4 items-center gap-4 border p-3 rounded-md"
                        >
                          <Label className="text-right">
                            Column {index + 1}
                          </Label>
                          <div className="col-span-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`name-${index}`} className="w-12">
                                Name:
                              </Label>
                              <Input
                                id={`name-${index}`}
                                value={column.name}
                                onChange={(e) =>
                                  handleNameChange(index, e.target.value)
                                }
                                placeholder="Enter column name"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`type-${index}`} className="w-12">
                                Type:
                              </Label>
                              <Select
                                value={column.type}
                                onValueChange={(value) =>
                                  handleTypeChange(index, value)
                                }
                              >
                                <SelectTrigger id={`type-${index}`}>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                      {isSavePending ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* ------------------------------------------------------- */}

              {/* Dialog for adding dynamic column */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Column
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Column</DialogTitle>
                    <DialogDescription>
                      Create a new column for your table. Enter the column name
                      and select its type.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="column-name">Column Name</Label>
                      <Input
                        id="column-name"
                        placeholder="Enter column name"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="column-type">Column Type</Label>
                      <Select
                        value={newColumnType}
                        onValueChange={setNewColumnType}
                      >
                        <SelectTrigger id="column-type">
                          <SelectValue placeholder="Select column type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>

                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addColumn}>Add Column</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((item, index) => {
                      return (
                        <TableHead key={index} className="whitespace-nowrap">
                          {item.name}
                        </TableHead>
                      );
                    })}
                    {dynamicColumnHeader.map((item, index) => {
                      return (
                        <TableHead key={index} className="whitespace-nowrap">
                          {item.name}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.length > 0 ? (
                    tableData.map((row, index) => (
                      <TableRow key={index}>
                        {row.slice(0, columnCount).map((item, i) => (
                          <TableCell key={`${i}-${item}`}>{item}</TableCell>
                        ))}
                        {row.length < columnCount &&
                          Array.from(
                            { length: columnCount - row.length },
                            (_, i) => <TableCell key={i}>-</TableCell>
                          )}
                        {dynamicColumnData[index] &&
                          dynamicColumnData[index].map((item, i) => (
                            <TableCell key={`${index}-${i}`}>
                              <input
                                type={
                                  dynamicColumnHeader[i]?.type === "text"
                                    ? "text"
                                    : "date"
                                }
                                value={item}
                                onChange={(e) =>
                                  handleInputChange(index, i, e.target.value)
                                }
                              />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columnCount}
                        className="h-24 text-center"
                      >
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {dynamicColumnHeader.length > 0 && (
            <div className="mt-4 flex items-center justify-end space-x-2 py-4">
              <Button
                className="bg-black text-white hover:bg-gray-800"
                size="sm"
                onClick={handleColumnSave}
              >
                {isSaveColumnPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

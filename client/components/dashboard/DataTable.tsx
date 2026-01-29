"use client";
import React, { useEffect, useMemo, useState } from "react";

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/* ---------- TYPE ---------- */
type Accident = {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
  severity: string;
  severityInPercentage: number;
  date: string;
};

/* ---------- COMPONENT ---------- */
export default function DataTable() {
  const [data, setData] = useState<Accident[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH REAL DATA ---------- */
  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/v1/accident/all")
      .then((res) => res.json())
      .then((res) => {
        setData(res.datas || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch accident data", err);
        setLoading(false);
      });
  }, []);

  /* ---------- COLUMNS ---------- */
  const columns = useMemo<ColumnDef<Accident>[]>(() => [
    {
      accessorKey: "city",
      header: "City",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "latitude",
      header: "Latitude",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "longitude",
      header: "Longitude",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "severityInPercentage",
      header: "Severity (%)",
      cell: (info) => `${info.getValue()}%`,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: (info) => {
        const value = info.getValue() as string;
        const color =
          value === "High"
            ? "bg-red-500"
            : value === "Medium"
            ? "bg-orange-500"
            : "bg-green-500";

        return (
          <span
            className={`px-3 py-1 rounded text-white text-sm font-semibold ${color}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      id: "details",
      header: "View Details",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/accident/${row.original.id}`}
          className="flex items-center space-x-1 text-orange-600 font-bold underline"
        >
          <span>View</span>
          <ArrowUpRight width={18} height={18} />
        </Link>
      ),
    },
  ], []);

  /* ---------- TABLE ---------- */
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return <p className="text-center py-10">Loading accident data...</p>;
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl pb-5 font-bold">Accident Datas</h2>

      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto bg-white border-collapse">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border px-4 py-3 text-left"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-4 py-2">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---------- PAGINATION ---------- */}
        <div className="pt-4 flex flex-wrap gap-4 items-center">
          <div className="space-x-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="border px-4 py-2 rounded"
            >
              First
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border px-4 py-2 rounded"
            >
              {"<"}
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border px-4 py-2 rounded"
            >
              {">"}
            </button>
            <button
              onClick={() =>
                table.setPageIndex(table.getPageCount() - 1)
              }
              disabled={!table.getCanNextPage()}
              className="border px-4 py-2 rounded"
            >
              Last
            </button>
          </div>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border px-4 py-2 rounded"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>

          <div className="font-semibold">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        </div>
      </div>
    </div>
  );
}

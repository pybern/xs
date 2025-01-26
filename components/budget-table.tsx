"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useMemo, useEffect, useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface DataTableProps {
  data: Record<string, any>[]
  tableName: string
}

export function DataTable({ data: initialData, tableName }: DataTableProps) {
  const [data, setData] = useState(initialData)
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    let channel: RealtimeChannel

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel(`${tableName}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName,
          },
          (payload) => {
            if (payload.eventType === 'UPDATE') {
              setData((currentData) =>
                currentData.map((row) =>
                  row.id === payload.new.id ? { ...row, ...payload.new } : row
                )
              )
            }
          }
        )
        .subscribe()
    }

    setupRealtimeSubscription()
    return () => {
      channel?.unsubscribe()
    }
  }, [tableName, supabase])

  const handleCellEdit = async (rowIndex: number, key: string, value: string) => {
    const row = data[rowIndex]
    
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ [key]: value })
        .eq('id', row.id)

      if (error) {
        console.error('Error updating:', error)
      }
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  // Dynamically generate columns based on the first data item
  const columns = useMemo(() => {
    if (!data.length) return []
    
    return Object.keys(data[0]).map((key): ColumnDef<any> => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      cell: ({ row }) => {
        const value = row.getValue(key)
        
        // Format different types of values
        if (typeof value === 'number') {
          // Check if it might be a currency amount
          if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('price')) {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(value)
          }
          return value.toLocaleString()
        }
        
        // Format dates
        if (key.includes('_at') || key.includes('date')) {
          if (typeof value === 'string' || typeof value === 'number') {
            try {
              return new Date(value).toLocaleDateString()
            } catch {
              return value
            }
          }
          return value
        }
        
        // Default display
        return value
      }
    }))
  }, [data])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (!data.length) {
    return <div className="text-center py-4">No data available</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <input
                      type="text"
                      value={formatValue(cell.column.id, cell.getValue())}
                      onChange={(e) => handleCellEdit(row.index, cell.column.id, e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function formatValue(key: string, value: unknown): string {
  if (key.includes('_at') || key.includes('date')) {
    if (typeof value === 'string' || typeof value === 'number') {
      try {
        return new Date(value).toLocaleDateString()
      } catch {
        return String(value)
      }
    }
  }
  return String(value)
} 
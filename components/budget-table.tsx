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
import { useMemo, useEffect, useState, useCallback } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { RealtimeChannel } from '@supabase/supabase-js'
import debounce from 'lodash/debounce'

interface DataTableProps {
  data: Record<string, any>[]
  tableName: string
}

export function DataTable({ data: initialData, tableName }: DataTableProps) {
  const [data, setData] = useState(initialData)
  const supabase = createClientComponentClient()
  
  // Create a debounced update function
  const debouncedUpdate = useCallback(
    debounce(async (row: any, key: string, value: string) => {
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
    }, 500), // 500ms delay
    [supabase, tableName]
  )

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
            } else if (payload.eventType === 'INSERT') {
              setData((currentData) => [...currentData, payload.new])
            } else if (payload.eventType === 'DELETE') {
              setData((currentData) => 
                currentData.filter(row => row.id !== payload.old.id)
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

  const handleCellEdit = (rowIndex: number, key: string, value: string) => {
    const row = data[rowIndex]
    
    // Update local state immediately
    setData(currentData => 
      currentData.map((item, index) => 
        index === rowIndex ? { ...item, [key]: value } : item
      )
    )

    // Debounced update to database
    debouncedUpdate(row, key, value)
  }

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel()
    }
  }, [debouncedUpdate])

  // Dynamically generate columns based on the first data item
  const columns = useMemo(() => {
    if (!data.length) return []
    
    const visibleColumns = ['category', 'sub_category', 'amount', 'check']
    
    return Object.keys(data[0])
      .filter(key => visibleColumns.includes(key))
      .map((key): ColumnDef<any> => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        cell: ({ row }) => {
          const value = row.getValue(key)
          
          // Format different types of values
          if (key === 'amount') {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(value))
          }
          
          // Handle checkbox
          if (key === 'check') {
            return (
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => handleCheckChange(row.original, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            )
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

  const handleAddRow = async () => {
    const newRow = {
      type: '',
      category: '',
      sub_category: '',
      country: '',
      amount: 0,
      notes: '',
      // created_date will be set by default in database
    }

    try {
      const { error } = await supabase
        .from('budget')
        .insert([newRow])

      if (error) throw error
    } catch (error) {
      console.error('Error adding row:', error)
    }
  }

  const handleDeleteRow = async (rowData: any) => {
    try {
      const { error } = await supabase
        .from('budget')
        .delete()
        .eq('id', rowData.id)

      if (error) throw error
      console.log('Deleting row with id:', rowData.id)

      // Update local state after successful deletion
      setData((currentData) => currentData.filter(row => row.id !== rowData.id))
    } catch (error) {
      console.error('Error deleting row:', error)
    }
  }

  const handleCheckChange = async (rowData: any, value: boolean) => {

    if (!rowData?.id) {
      console.error('Invalid row ID')
      return
    }

    try {
      const { error } = await supabase
        .from('budget')
        .update({ check: value })
        .eq('id', rowData.id)

      if (error) {
        console.error('Error updating check:', error)
        return
      }

      setData(currentData => 
        currentData.map((item) => 
          item.id === rowData.id ? { ...item, check: value } : item
        )
      )
    } catch (error) {
      console.error('Error updating check:', error)
    }
  }

  if (!data.length) {
    return <div className="text-center py-4">No data available</div>
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddRow}
        className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Add Row
      </button>
      
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
                      {cell.column.id === 'check' ? (
                        <input
                          type="checkbox"
                          checked={Boolean(cell.getValue())}
                          onChange={(e) => handleCheckChange(row.original, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formatValue(cell.column.id, cell.getValue())}
                          onChange={(e) => handleCellEdit(row.index, cell.column.id, e.target.value)}
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2"
                        />
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <button
                      onClick={() => handleDeleteRow(row.original)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </TableCell>
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
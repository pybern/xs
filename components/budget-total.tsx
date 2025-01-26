"use client"

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function BudgetTotal({ initialTotal, tableName }: { initialTotal: number, tableName: string }) {
  const [total, setTotal] = useState(initialTotal)
  const supabase = createClientComponentClient()

  useEffect(() => {
    let channel: RealtimeChannel

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel(`${tableName}_total`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName,
          },
          async () => {
            // Recalculate total on any change
            const { data, error } = await supabase
              .from(tableName)
              .select('amount')

            if (!error && data) {
              const newTotal = data.reduce((sum, row) => sum + (row.amount || 0), 0)
              setTotal(newTotal)
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
      <p className="text-3xl font-bold mt-2">
        ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  )
} 
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Vehicle } from '@/components/vehicle-list'

interface VehicleContextType {
  vehicles: Vehicle[]
  addVehicle: (vehicle: Vehicle) => void
  deleteVehicle: (id: string) => void
  clearVehicles: () => void
  completedSteps: number[]
  setCompletedStep: (step: number) => void
  removeCompletedStep: (step: number) => void
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    const storedVehicles = localStorage.getItem('vehicles')
    const storedCompletedSteps = localStorage.getItem('completedSteps')
    if (storedVehicles) {
      setVehicles(JSON.parse(storedVehicles))
    }
    if (storedCompletedSteps) {
      setCompletedSteps(JSON.parse(storedCompletedSteps))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('vehicles', JSON.stringify(vehicles))
    localStorage.setItem('completedSteps', JSON.stringify(completedSteps))
  }, [vehicles, completedSteps])

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles(prev => [...prev, vehicle])
  }

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id))
  }

  const clearVehicles = () => {
    setVehicles([])
  }

  const setCompletedStep = (step: number) => {
    setCompletedSteps(prev => {
      if (!prev.includes(step)) {
        return [...prev, step].sort((a, b) => a - b)
      }
      return prev
    })
  }

  const removeCompletedStep = (step: number) => {
    setCompletedSteps(prev => prev.filter(s => s !== step))
  }

  return (
    <VehicleContext.Provider value={{ 
      vehicles, 
      addVehicle, 
      deleteVehicle, 
      clearVehicles, 
      completedSteps, 
      setCompletedStep, 
      removeCompletedStep 
    }}>
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicles() {
  const context = useContext(VehicleContext)
  if (context === undefined) {
    throw new Error('useVehicles must be used within a VehicleProvider')
  }
  return context
}


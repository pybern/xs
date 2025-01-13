"use client"

import { useEffect } from 'react'
import { MapPin, MessageSquare, Car, FileText, DollarSign } from 'lucide-react'
import { ProgressSteps } from "@/components/progress-steps"
import { VehicleForm } from "@/components/vehicle-form"
import { VehicleList } from "@/components/vehicle-list"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { VehicleProvider, useVehicles } from "@/contexts/VehicleContext"

const steps = [
  {
    title: "Dealer/Customer Details",
    subtitle: "Setup Account Details",
    icon: <FileText className="h-5 w-5" />,
    href: "/new-booking",
  },
  {
    title: "Vehicle Info",
    subtitle: "Add Vehicle Info",
    icon: <Car className="h-5 w-5" />,
    href: "/new-booking/vehicle",
  },
  {
    title: "Origin Info",
    subtitle: "Add Address",
    icon: <MapPin className="h-5 w-5" />,
    href: "/new-booking/origin",
  },
  {
    title: "Destination Info",
    subtitle: "Add Address",
    icon: <MapPin className="h-5 w-5" />,
    href: "/new-booking/destination",
  },
  {
    title: "Comments",
    subtitle: "Add Comments",
    icon: <MessageSquare className="h-5 w-5" />,
    href: "/new-booking/comments",
  },
  {
    title: "Pricing & Status",
    subtitle: "Add Pricing",
    icon: <DollarSign className="h-5 w-5" />,
    href: "/new-booking/pricing",
  },
]

function VehicleInfoContent() {
  const router = useRouter()
  const { vehicles, completedSteps, setCompletedStep, removeCompletedStep } = useVehicles()

  useEffect(() => {
    const isComplete = vehicles.length > 0
    if (isComplete && !completedSteps.includes(1)) {
      setCompletedStep(1)
    } else if (!isComplete && completedSteps.includes(1)) {
      removeCompletedStep(1)
    }
  }, [vehicles, completedSteps, setCompletedStep, removeCompletedStep])

  const handleNext = () => {
    if (vehicles.length > 0) {
      router.push("/new-booking/origin")
    } else {
      alert("Please add at least one vehicle before proceeding.")
    }
  }

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold">New Booking</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <span>Home</span>
          <span>/</span>
          <span>New Shipping Booking</span>
        </div>
      </div>
      <div className="mb-8 sm:mb-10">
        <ProgressSteps currentStep={1} steps={steps} completedSteps={completedSteps} />
      </div>
      <div className="mx-auto max-w-3xl rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-medium">Vehicle Information</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter vehicle details
          </p>
        </div>
        <VehicleForm />
        <div className="mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Added Vehicles</h3>
          <VehicleList />
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={() => router.push("/new-booking")}>Previous</Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </div>
    </div>
  )
}

export default function VehicleInfoPage() {
  return (
    <VehicleProvider>
      <VehicleInfoContent />
    </VehicleProvider>
  )
}


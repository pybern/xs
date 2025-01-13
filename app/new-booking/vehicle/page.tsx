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
    <VehicleForm />
  )
}

export default function VehicleInfoPage() {
  return (
    <VehicleProvider>
      <VehicleInfoContent />
    </VehicleProvider>
  )
}


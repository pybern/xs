"use client"

import { useEffect } from 'react'
import { MapPin, MessageSquare, Car, FileText, DollarSign } from 'lucide-react'
import { ProgressSteps } from "@/components/progress-steps"
import { DealerForm } from "@/components/dealer-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


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

export default function NewBookingPage() {


    return (
        <DealerForm />
    )
}
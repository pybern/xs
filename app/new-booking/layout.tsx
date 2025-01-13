import { MapPin, MessageSquare, Car, FileText, DollarSign } from 'lucide-react'
import { ProgressSteps } from "@/components/progress-steps"

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
            <div className="container mx-auto py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold">New Booking</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Home</span>
                        <span>/</span>
                        <span>New Shipping Booking</span>
                    </div>
                </div>
                <div className="mb-10">
                    <ProgressSteps currentStep={0} steps={steps} completedSteps={[]} />
                </div>
                <div className="mx-auto max-w-3xl rounded-lg border bg-card p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-medium">Dealer/Customer</h2>
                        <p className="text-sm text-muted-foreground">
                            Enter Dealer/Customer Details
                        </p>
                    </div>
                    {children}
                </div>
            </div>

  )
}


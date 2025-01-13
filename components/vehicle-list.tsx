import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2 } from 'lucide-react'
import { useVehicles } from "@/contexts/VehicleContext"

export interface Vehicle {
  id: string
  make: string
  model: string
  year: string
  vin: string
  registration: string
  color: string
  vehicleType: string
}

export function VehicleList() {
  const { vehicles, deleteVehicle } = useVehicles()

  if (vehicles.length === 0) {
    return <p className="text-center text-muted-foreground">No vehicles added yet.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Make</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>VIN</TableHead>
          <TableHead>Registration</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell>{vehicle.make}</TableCell>
            <TableCell>{vehicle.model}</TableCell>
            <TableCell>{vehicle.year}</TableCell>
            <TableCell>{vehicle.vin}</TableCell>
            <TableCell>{vehicle.registration}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteVehicle(vehicle.id)}
                aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


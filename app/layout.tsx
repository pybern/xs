import './globals.css'
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SidebarTrigger />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}


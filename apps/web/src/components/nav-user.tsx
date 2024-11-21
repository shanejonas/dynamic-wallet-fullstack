"use client"

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { DynamicWidget } from "@dynamic-labs/sdk-react-core"

export function NavUser() {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DynamicWidget variant="modal" />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

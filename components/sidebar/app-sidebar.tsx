import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import options from "@/utils/sidebar-options";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import Link from "next/link";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex justify-center items-center">
        <Image
          alt="Logo con texto 'La Patrona'"
          src={Logo.src}
          width={120}
          height={120}
        />
      </SidebarHeader>

      <SidebarContent>
        {options.map((option) => (
          <SidebarGroup key={option.id} className="items-center">
            {option.isClickable ? (
              <SidebarMenuItem className="list-none">
                <SidebarMenuButton asChild title={option.name}>
                  <Link href={option.href || ""}>
                    {option.icon ? option.icon : ""}
                    {option.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarGroupLabel>{option.name}</SidebarGroupLabel>
            )}

            <SidebarGroupContent>
              <SidebarMenu className="items-center">
                {option.submenu?.map((menuOption) => (
                  <SidebarMenuItem key={menuOption.id}>
                    <SidebarMenuButton asChild>
                      <Link href={menuOption.href}>
                        <menuOption.icon />
                        {menuOption.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}

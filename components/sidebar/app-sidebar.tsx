import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import options from "@/utils/sidebar-options";
import Image from "next/image";
import Logo from "@/public/logo.jpg";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex justify-center items-center">
        <Image
          alt="Logo con texto 'La Patrona'"
          src={Logo.src}
          width={100}
          height={100}
          className="rounded-full"
        />
      </SidebarHeader>

      <SidebarContent>
        {options.map((option) => (
          <SidebarGroup key={option.id}>
            {option.isClickable ? (
              <SidebarMenuItem className="list-none">
                <SidebarMenuButton asChild title={option.name}>
                  <a href={option.href || ""}>
                    {option.icon ? <option.icon /> : ""}
                    {option.name}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarGroupLabel>{option.name}</SidebarGroupLabel>
            )}

            <SidebarGroupContent>
              <SidebarMenu>
                {option.submenu?.map((menuOption) => (
                  <SidebarMenuItem key={menuOption.id}>
                    <SidebarMenuButton asChild>
                      <a href={menuOption.href}>
                        <menuOption.icon />
                        {menuOption.name}
                      </a>
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

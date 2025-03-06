import RootLayout from "@/components/layout"
import PageSection from "@/components/page-section"
import Image from "next/image"
import DashboardImg from "@/public/dashboard.png"
 
export default function Dashboard() {
  return (
    <RootLayout>
      <PageSection title="Dashboard">
        <Image alt="dashboard image" src={DashboardImg.src} width={DashboardImg.width} height={DashboardImg.height} className="w-full"/>
      </PageSection>
    </RootLayout>
  )
}
import PageSection from "@/components/page-section"
import Image from "next/image"
import Logo from "@/public/logo.svg"
 
export default function Dashboard() {
  return (
      <PageSection title="Dashboard">
        <Image alt="dashboard image" src={Logo.src} width={300} height={150} className="m-auto"/>
        <h1 className="m-auto text-center mt-5 text-xl font-bold">Sistema de Gestión y Contabilidad</h1>
        <p className="m-auto text-center">v1.0.0 - Creado por <a href="#" className="text-orange-500 hover:underline" target="_blank">@andyechc</a> & <a href="#" className="text-blue-500 hover:underline" target="_blank">@reboot-brothers</a> Developer Team</p>
         <p className="m-auto text-center">{Date().split(" ")[3]}</p>
      </PageSection>
  )
}
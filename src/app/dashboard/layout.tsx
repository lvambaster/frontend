import { Header } from "./components/header"
import Payments from "./components/payments"


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        
        <Header/>
        
        
        {children}
        </>
    )
}   
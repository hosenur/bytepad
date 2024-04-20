import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function AuthenticatedLayout() {
    const { userId, isLoaded } = useAuth()
    const navigate = useNavigate()


    useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/login")
        }
    }, [isLoaded])

    if (!isLoaded) return "Loading..."

    return (
        <Outlet />
    )
}
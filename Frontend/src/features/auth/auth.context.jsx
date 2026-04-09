import { useEffect, useState } from "react";
import { AuthContext } from "./auth.context.js";
import { getMe } from "./services/auth.api";


export const AuthProvider = ({ children }) => { 

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                // Check if token exists in localStorage
                const token = localStorage.getItem("token")
                if (!token) {
                    setUser(null)
                    setLoading(false)
                    return
                }

                const data = await getMe()
                setUser(data?.user ?? null)
            } catch (err) {
                setUser(null)
                // Clear invalid token
                localStorage.removeItem("token")
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()
    }, [])


    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}} >
            {children}
        </AuthContext.Provider>
    )

    
}
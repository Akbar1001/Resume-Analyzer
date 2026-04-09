import { useContext } from "react";
import { AuthContext } from "../auth.context.js";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            const user = data?.user ?? null
            const token = data?.token ?? null
            
            // Store token in localStorage
            if (token) {
                localStorage.setItem("token", token)
            }
            
            setUser(user)
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            const user = data?.user ?? null
            const token = data?.token ?? null
            
            // Store token in localStorage
            if (token) {
                localStorage.setItem("token", token)
            }
            
            setUser(user)
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
            // Remove token from localStorage
            localStorage.removeItem("token")
        } catch (err) {
            console.log(err);
            localStorage.removeItem("token")
        } finally {
            setLoading(false)
        }
    }

    const refreshUser = async () => {
        try {
            const data = await getMe()
            const currentUser = data?.user ?? null
            setUser(currentUser)
            return currentUser
        } catch (err) {
            setUser(null)
            return null
        }
    }

    return { user, loading, handleRegister, handleLogin, handleLogout, refreshUser }
}
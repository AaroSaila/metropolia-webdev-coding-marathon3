import { useState } from "react"
import { AuthContext } from "./AuthContext"

const AuthContextProvider = ({ children }) => {
    const user = localStorage.getItem("user")
    const bool = user ? true : false
    const [isAuthenticated, setIsAuthenticated] = useState(bool);

    const logout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem("user")
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider

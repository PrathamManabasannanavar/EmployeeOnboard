import { useCallback, useEffect, useRef, useState } from "react"
import { AuthContext } from "./authContext"
import { API_BASE } from "./api"

export function AuthProvider({ children }) {
  const [session, setSession] = useState({ loading: true, loggedIn: false, user: "" })
  const sessionRequest = useRef(0)

  const refreshSession = useCallback(async () => {
    const requestId = ++sessionRequest.current
    try {
      const response = await fetch(`${API_BASE}/user/session`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (requestId === sessionRequest.current) {
        setSession({ loading: false, loggedIn: data.loggedIn === true, user: data.user || "" })
      }
      return data
    } catch {
      if (requestId === sessionRequest.current) {
        setSession({ loading: false, loggedIn: false, user: "" })
      }
      return { loggedIn: false }
    }
  }, [])

  const markAuthenticated = useCallback((username) => {
    setSession({ loading: false, loggedIn: true, user: username })
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  return <AuthContext.Provider value={{ ...session, refreshSession, markAuthenticated }}>{children}</AuthContext.Provider>
}

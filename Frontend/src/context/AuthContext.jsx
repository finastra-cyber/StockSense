import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify user on mount by checking cookie via backend
  useEffect(() => {
    async function verifyUser() {
      try {
        const res = await fetch("/api/auth/verify", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        // Backend not available in mock mode — treat as unauthenticated
      } finally {
        setLoading(false);
      }
    }
    verifyUser();
  }, []);

  // Listen for 401 events from the axios interceptor
  useEffect(() => {
    function handle401() {
      setUser(null);
      // Use a custom event so the toast fires from the Toaster context in main
      window.dispatchEvent(new CustomEvent("finAstra:showToast", {
        detail: { type: "error", message: "Session expired, please log in again" }
      }));
    }
    window.addEventListener("finAstra:401", handle401);
    return () => window.removeEventListener("finAstra:401", handle401);
  }, []);

  function login(userData) {
    setUser(userData);
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
    }
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}

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
        console.error("Auth verification failed:", err);
      } finally {
        setLoading(false);
      }
    }
    verifyUser();
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

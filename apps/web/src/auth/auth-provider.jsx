import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api.js";
import { AuthContext } from "./auth-context.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError("");

    try {
      const result = await apiRequest("/api/user");
      const account = result.user ?? result;
      setUser(account);
      setStatus("authenticated");
      return account;
    } catch (requestError) {
      if (requestError.status === 401) {
        setUser(null);
        setStatus("unauthenticated");
        return null;
      }

      setError(requestError.message);
      setStatus("error");
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest("/api/user")
      .then((result) => {
        if (!active) return;
        setUser(result.user ?? result);
        setStatus("authenticated");
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.status === 401) {
          setUser(null);
          setStatus("unauthenticated");
          return;
        }

        setError(requestError.message);
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await apiRequest("/api/login", {
      method: "POST",
      body: credentials,
    });
    setUser(result.user);
    setError("");
    setStatus("authenticated");
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    await apiRequest("/api/logout", { method: "POST" });
    setUser(null);
    setError("");
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ user, status, error, login, logout, refresh }),
    [user, status, error, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import { createContext, useContext, useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("agroai_token") ?? null);
    const [loading, setLoading] = useState(true); // verifying token on mount

    // On mount: if token exists, verify it with /me
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        fetch(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((u) => {
                setUser(u);
                setLoading(false);
            })
            .catch(() => {
                logout();
                setLoading(false);
            });
    }, []); // eslint-disable-line

    const login = async (email, password) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "Login failed");
        localStorage.setItem("agroai_token", data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async (fields) => {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "Registration failed");
        localStorage.setItem("agroai_token", data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem("agroai_token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
};

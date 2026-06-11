import { useState } from "react";
import { Leaf, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";

export default function LoginPage({ onSwitchToRegister }) {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message ?? "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={STYLES.page}>
            {/* Ambient blobs */}
            <div
                style={{
                    ...STYLES.blob,
                    top: -120,
                    left: -120,
                    background: "rgba(74,222,128,0.07)",
                }}
            />
            <div
                style={{
                    ...STYLES.blob,
                    bottom: -80,
                    right: -80,
                    background: "rgba(56,189,248,0.05)",
                }}
            />

            <div style={STYLES.card}>
                {/* Logo */}
                <div style={STYLES.logo}>
                    <div style={STYLES.logoIcon}>
                        <Leaf size={22} color="#4ADE80" />
                    </div>
                    <div>
                        <div style={STYLES.logoTitle}>AgroAI</div>
                        <div style={STYLES.logoSub}>Field Intelligence Platform</div>
                    </div>
                </div>

                <div style={STYLES.heading}>Welcome back</div>
                <div style={STYLES.subheading}>Sign in to your field representative account</div>

                <form onSubmit={handleSubmit} style={STYLES.form}>
                    {error && (
                        <div style={STYLES.errorBox}>
                            <AlertCircle size={15} /> {error}
                        </div>
                    )}

                    <Field label="Email Address">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="amit.sharma@agroai.com"
                            autoComplete="email"
                            style={STYLES.input}
                            autoFocus
                        />
                    </Field>

                    <Field label="Password">
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPw ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                style={{ ...STYLES.input, paddingRight: 44 }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((v) => !v)}
                                style={STYLES.eyeBtn}
                            >
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </Field>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8 }}>
                        <span style={{ fontSize: 12, color: "#4ADE80", cursor: "pointer" }}>
                            Forgot password?
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...STYLES.btn,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? (
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    justifyContent: "center",
                                }}
                            >
                                <span style={STYLES.spinner} /> Signing in…
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div style={STYLES.divider}>
                    <span style={STYLES.dividerText}>or</span>
                </div>

                <p style={STYLES.switchText}>
                    Don't have an account?{" "}
                    <span onClick={onSwitchToRegister} style={STYLES.switchLink}>
                        Create account
                    </span>
                </p>

                {/* Demo hint */}
                <div style={STYLES.demoBox}>
                    <div
                        style={{ fontSize: 11, color: "#4ADE80", fontWeight: 700, marginBottom: 4 }}
                    >
                        🚀 Demo Credentials
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.7 }}>
                        Email: <span style={{ color: "#CBD5E1" }}>amit@agroai.com</span>
                        <br />
                        Password: <span style={{ color: "#CBD5E1" }}>password123</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Field = ({ label, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label
            style={{
                fontSize: 11,
                color: "#64748B",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
            }}
        >
            {label}
        </label>
        {children}
    </div>
);

const STYLES = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(160deg,#0A1A0F 0%,#0D1F12 50%,#080F10 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans',sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: 16,
    },
    blob: {
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none",
    },
    card: {
        width: "100%",
        maxWidth: 440,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 20,
        padding: "40px 36px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        position: "relative",
        zIndex: 1,
    },
    logo: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28 },
    logoIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        background: "rgba(74,222,128,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(74,222,128,0.25)",
    },
    logoTitle: {
        fontSize: 18,
        fontWeight: 800,
        color: "#4ADE80",
        fontFamily: "'Space Grotesk',sans-serif",
        lineHeight: 1,
    },
    logoSub: { fontSize: 10, color: "#475569", marginTop: 3 },
    heading: {
        fontSize: 24,
        fontWeight: 800,
        color: "#F8FAFC",
        fontFamily: "'Space Grotesk',sans-serif",
        marginBottom: 6,
    },
    subheading: { fontSize: 13, color: "#64748B", marginBottom: 24 },
    form: { display: "flex", flexDirection: "column", gap: 18 },
    input: {
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 10,
        padding: "11px 14px",
        color: "#F8FAFC",
        fontSize: 13,
        outline: "none",
        fontFamily: "'DM Sans',sans-serif",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
    },
    eyeBtn: {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        color: "#64748B",
        cursor: "pointer",
        display: "flex",
        padding: 4,
    },
    errorBox: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.25)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13,
        color: "#EF4444",
        fontWeight: 500,
    },
    btn: {
        width: "100%",
        background: "#16A34A",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: "13px",
        fontSize: 14,
        fontWeight: 700,
        transition: "background 0.2s",
        fontFamily: "'DM Sans',sans-serif",
        marginTop: 4,
    },
    spinner: {
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
    },
    divider: {
        position: "relative",
        textAlign: "center",
        margin: "20px 0",
        borderTop: "1px solid rgba(255,255,255,0.07)",
    },
    dividerText: {
        position: "absolute",
        top: -9,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0D1A10",
        padding: "0 12px",
        fontSize: 12,
        color: "#475569",
    },
    switchText: { textAlign: "center", fontSize: 13, color: "#64748B", margin: 0 },
    switchLink: { color: "#4ADE80", cursor: "pointer", fontWeight: 700 },
    demoBox: {
        marginTop: 20,
        background: "rgba(74,222,128,0.05)",
        border: "1px solid rgba(74,222,128,0.12)",
        borderRadius: 10,
        padding: "12px 14px",
    },
};

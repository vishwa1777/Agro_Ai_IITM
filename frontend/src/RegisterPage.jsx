import { useState } from "react";
import { Leaf, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { useAuth } from "./AuthContext";

const ROLES = ["field_agent", "Regional Manager", "Agronomist", "Sales Executive"];
const REGIONS = ["Jhansi Region", "Patna Region", "Agra Region", "Kanpur Region", "Lucknow Region"];

export default function RegisterPage({ onSwitchToLogin }) {
    const { register } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ROLES[0],
        region: REGIONS[0],
    });
    const [showPw, setShowPw] = useState(false);
    const [showCp, setShowCp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.name || !form.email || !form.password) {
            setError("Please fill in all required fields.");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
                region: form.region,
            });
        } catch (err) {
            setError(err.message ?? "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const pwStrength = (pw) => {
        if (!pw) return null;
        if (pw.length < 6) return { label: "Weak", color: "#EF4444", pct: 33 };
        if (pw.length < 10) return { label: "Medium", color: "#EAB308", pct: 66 };
        return { label: "Strong", color: "#4ADE80", pct: 100 };
    };
    const strength = pwStrength(form.password);

    return (
        <div style={STYLES.page}>
            <div
                style={{
                    ...STYLES.blob,
                    top: -120,
                    right: -120,
                    background: "rgba(74,222,128,0.07)",
                }}
            />
            <div
                style={{
                    ...STYLES.blob,
                    bottom: -80,
                    left: -80,
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

                <div style={STYLES.heading}>Create your account</div>
                <div style={STYLES.subheading}>Join the AgroAI field intelligence network</div>

                <form onSubmit={handleSubmit} style={STYLES.form}>
                    {error && (
                        <div style={STYLES.errorBox}>
                            <AlertCircle size={15} /> {error}
                        </div>
                    )}

                    {/* Row 1 */}
                    <div style={{ display: "flex", gap: 14 }}>
                        <Field label="Full Name *">
                            <input
                                type="text"
                                value={form.name}
                                onChange={set("name")}
                                placeholder="Amit Sharma"
                                autoComplete="name"
                                style={STYLES.input}
                                autoFocus
                            />
                        </Field>
                        <Field label="Email Address *">
                            <input
                                type="email"
                                value={form.email}
                                onChange={set("email")}
                                placeholder="amit@agroai.com"
                                autoComplete="email"
                                style={STYLES.input}
                            />
                        </Field>
                    </div>

                    {/* Row 2 */}
                    <div style={{ display: "flex", gap: 14 }}>
                        <Field label="Role">
                            <select
                                value={form.role}
                                onChange={set("role")}
                                style={{ ...STYLES.input, cursor: "pointer" }}
                            >
                                {ROLES.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Region">
                            <select
                                value={form.region}
                                onChange={set("region")}
                                style={{ ...STYLES.input, cursor: "pointer" }}
                            >
                                {REGIONS.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    {/* Password */}
                    <Field label="Password *">
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPw ? "text" : "password"}
                                value={form.password}
                                onChange={set("password")}
                                placeholder="At least 6 characters"
                                autoComplete="new-password"
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
                        {strength && (
                            <div style={{ marginTop: 6 }}>
                                <div
                                    style={{
                                        height: 4,
                                        background: "rgba(255,255,255,0.08)",
                                        borderRadius: 2,
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "100%",
                                            width: `${strength.pct}%`,
                                            background: strength.color,
                                            borderRadius: 2,
                                            transition: "width 0.3s",
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        fontSize: 10,
                                        color: strength.color,
                                        marginTop: 3,
                                        fontWeight: 600,
                                    }}
                                >
                                    {strength.label} password
                                </div>
                            </div>
                        )}
                    </Field>

                    {/* Confirm Password */}
                    <Field label="Confirm Password *">
                        <div style={{ position: "relative" }}>
                            <input
                                type={showCp ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={set("confirmPassword")}
                                placeholder="Repeat your password"
                                autoComplete="new-password"
                                style={{
                                    ...STYLES.input,
                                    paddingRight: 44,
                                    borderColor:
                                        form.confirmPassword &&
                                        form.password !== form.confirmPassword
                                            ? "rgba(239,68,68,0.6)"
                                            : undefined,
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCp((v) => !v)}
                                style={STYLES.eyeBtn}
                            >
                                {showCp ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            {form.confirmPassword && form.password === form.confirmPassword && (
                                <div
                                    style={{
                                        position: "absolute",
                                        right: 12,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#4ADE80",
                                    }}
                                >
                                    <Check size={16} />
                                </div>
                            )}
                        </div>
                    </Field>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...STYLES.btn,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                            marginTop: 4,
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
                                <span style={STYLES.spinner} /> Creating account…
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div style={STYLES.divider}>
                    <span style={STYLES.dividerText}>or</span>
                </div>

                <p style={STYLES.switchText}>
                    Already have an account?{" "}
                    <span onClick={onSwitchToLogin} style={STYLES.switchLink}>
                        Sign in
                    </span>
                </p>
            </div>
        </div>
    );
}

const Field = ({ label, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
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
        maxWidth: 520,
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
        appearance: "none",
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
};

import React, { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

let idCounter = 0;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((type, message, timeout = 4000) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, timeout);
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div style={{ position: "fixed", top: 14, right: 14, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ marginBottom: 10, minWidth: 260 }}>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                color: "#fff",
                background: t.type === "success" ? "#10b981" : t.type === "warning" ? "#f59e0b" : "#ef4444",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              }}
              role="alert"
            >
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{t.type?.toUpperCase()}</div>
              <div style={{ fontSize: 14 }}>{t.message}</div>
              <div style={{ position: "absolute", right: 8, top: 8, cursor: "pointer" }} onClick={() => remove(t.id)}>
                ×
              </div>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotify = () => useContext(NotificationContext);
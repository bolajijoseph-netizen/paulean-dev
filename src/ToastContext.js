import { createContext, useContext, useState, useCallback } from "react"
import Toast from "./Toast"

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const show = useCallback((t) => {
    const id = crypto.randomUUID()

    setToast({
      id,
      ...t,
    })

    // Auto-dismiss after 60 seconds
    setTimeout(() => {
      setToast((current) => {
        if (current?.id === id) return null
        return current
      })
    }, 30000)
  }, [])

  const hide = useCallback(() => {
    setToast(null)
  }, [])

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}

      {toast && (
        <Toast
          key={toast.id}
          {...toast}
          onClose={hide}
        />
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>")
  }
  return ctx
}
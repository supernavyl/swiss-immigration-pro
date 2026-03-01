import { ToastProvider } from '@/components/providers/ToastProvider'

export default function LPLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}

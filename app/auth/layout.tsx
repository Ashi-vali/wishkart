import type { ReactNode } from "react"
import Link from "next/link"
import { Gift } from "lucide-react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="mobile-container py-6">
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">WishKart</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md px-4">{children}</div>
      </main>

      {/* Footer */}
      <footer className="mobile-container py-4 text-center text-gray-600 text-sm">
        <p>&copy; 2024 WishKart. Made with ❤️ for Indian celebrations.</p>
      </footer>
    </div>
  )
}

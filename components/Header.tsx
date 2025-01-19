import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

export function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          TechStore
        </Link>
        {/* <div className="flex items-center gap-4">
          <Link href="/about">About</Link>
          <Link href="/products">Products</Link>
          <Link href="/contact">Contact</Link>
        </div> */}
      </nav>
    </header>
  )
}
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { BookOpen, Menu } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="BFFP Logo" width={200} height={65} className="h-14 w-auto" priority />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#mission" className="text-sm font-medium text-muted-foreground hover:text-brand-600 transition-colors">Mission</Link>
          <Link href="#programs" className="text-sm font-medium text-muted-foreground hover:text-brand-600 transition-colors">Programs</Link>
          <Link href="#impact" className="text-sm font-medium text-muted-foreground hover:text-brand-600 transition-colors">Impact</Link>
          <div className="w-px h-5 bg-border mx-2"></div>
          <Link href="/login">
            <Button>Teacher Login</Button>
          </Link>
        </nav>

        <button className="md:hidden p-2 text-muted-foreground">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  )
}

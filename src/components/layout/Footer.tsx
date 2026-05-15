import Link from "next/link"
import Image from "next/image"
import { BookOpen } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center mb-6 bg-white/10 p-2 rounded-xl w-fit">
            <Image src="/logo.png" alt="BFFP Logo" width={240} height={80} className="h-16 w-auto" />
          </Link>
          <p className="text-sm text-slate-400 max-w-sm">
            Empowering Teachers for a Better Future for Pakistan. A premium educational platform dedicated to improving teacher training and educational quality.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#mission" className="hover:text-brand-400 transition-colors">Our Mission</Link></li>
            <li><Link href="#programs" className="hover:text-brand-400 transition-colors">Programs</Link></li>
            <li><Link href="#impact" className="hover:text-brand-400 transition-colors">Impact</Link></li>
            <li><Link href="/login" className="hover:text-brand-400 transition-colors">Teacher Portal</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>support@betterfuture.pk</li>
            <li>+92 (800) 123-4567</li>
            <li>Islamabad, Pakistan</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Better Future for Pakistan. All rights reserved.</p>
        <div className="space-x-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}

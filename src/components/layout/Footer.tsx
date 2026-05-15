import Link from "next/link"
import Image from "next/image"

const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
)

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center mb-6 bg-white/10 p-2 rounded-xl w-fit">
            <Image src="/logo.png" alt="BFFP Logo" width={240} height={80} className="h-16 w-auto" />
          </Link>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            Empowering Teachers for a Better Future for Pakistan. A premium educational platform dedicated to improving teacher training and educational quality.
          </p>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/BFFPakistan/?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-400 transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/betterfutureforpakistan/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-400 transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/@BFF-Pakistan" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-400 transition-colors">
              <span className="sr-only">YouTube</span>
              <Youtube className="w-5 h-5" />
            </a>
          </div>
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
            <li><a href="mailto:info@bffp.org.pk" className="hover:text-brand-400 transition-colors">info@bffp.org.pk</a></li>
            <li><a href="tel:+923012973329" className="hover:text-brand-400 transition-colors">+92 301 2973329</a></li>
            <li>Baloch Mujahid Community Center, Korangi Creek, Karachi</li>
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

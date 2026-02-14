import Link from "next/link"
import { FileText, Twitter, Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-slate-800 bg-slate-950 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                FolioSpace
              </span>
            </Link>
            <p className="text-base text-slate-400 leading-relaxed max-w-sm">
              Build professional, ATS-optimized resumes that help you land your dream job. Simple, fast, and effective.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all hover:scale-110"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 flex items-center justify-center text-slate-400 hover:text-purple-400 transition-all hover:scale-110"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all hover:scale-110"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:support@foliospace.com"
                className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-green-500/50 flex items-center justify-center text-slate-400 hover:text-green-400 transition-all hover:scale-110"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-5">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Features</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Pricing</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Templates</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold uppercase tracking-wide shadow-lg">
                    Soon
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Portfolio</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold uppercase tracking-wide shadow-lg">
                    Soon
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-5">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Contact</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Blog</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold uppercase tracking-wide shadow-lg">
                    Soon
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Careers</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold uppercase tracking-wide shadow-lg">
                    Soon
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-5">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/changelog"
                  className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Changelog</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} <span className="text-slate-400 font-semibold">FolioSpace</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/sitemap" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                Sitemap
              </Link>
              <Link href="/cookies" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
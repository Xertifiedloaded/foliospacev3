import { AuthForm } from "@/components/auth-form"
import Image from "next/image"

export const metadata = {
  title: "Sign Up - FolioSpace",
  description: "Create a new FolioSpace account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 py-8 ">
 <AuthForm mode="signup" />
      </div>

      <div className="hidden lg:flex lg:flex-1 relative bg-linear-to-br from-primary/10 via-primary/5 to-secondary/10">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center space-y-6">
            <div className="w-full aspect-square rounded-2xl bg-linear-to-br from-primary to-primary/50 flex items-center justify-center shadow-2xl">
              <div className="text-white space-y-4 p-8">
                <svg
                  className="w-24 h-24 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-2xl font-bold">Build Your Future</h2>
                <p className="text-white/90">
                  Create stunning portfolios and professional CVs that stand out
                </p>
              </div>
            </div>
            
            {/* Features */}
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Professional Templates</h3>
                  <p className="text-sm text-muted-foreground">Choose from beautiful, customizable designs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Export to PDF</h3>
                  <p className="text-sm text-muted-foreground">Download your CV in professional PDF format</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Easy to Use</h3>
                  <p className="text-sm text-muted-foreground">Intuitive interface for quick portfolio creation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
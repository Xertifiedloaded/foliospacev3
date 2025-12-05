import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
              <p className="text-base text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  By accessing and using FolioSpace, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Use License</h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  Permission is granted to use FolioSpace for personal, non-commercial purposes. This license shall automatically terminate if you violate any of these restrictions.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  You may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground ml-4">
                  <li>Use the service for any illegal purpose</li>
                  <li>Attempt to gain unauthorized access to the service</li>
                  <li>Interfere with or disrupt the service</li>
                  <li>Use automated systems to access the service</li>
                  <li>Reproduce, duplicate, or copy material without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  When you create an account, you are responsible for maintaining the security of your account and password. You are fully responsible for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Content Ownership</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  You retain all rights to the content you create using FolioSpace, including your resumes, cover letters, and any other materials. We do not claim ownership of your content. However, you grant us a license to store and display your content for the purpose of providing the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Service Availability</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  We strive to maintain high availability of our service, but we do not guarantee uninterrupted access. We reserve the right to modify or discontinue the service at any time, with or without notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  FolioSpace and its suppliers shall not be liable for any damages arising out of the use or inability to use the service, even if we have been notified of the possibility of such damages. This includes but is not limited to direct, indirect, incidental, or consequential damages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Indemnification</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  You agree to indemnify and hold harmless FolioSpace from any claims, damages, or expenses arising from your use of the service or violation of these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes. Your continued use of the service after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  These terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at foliospace@gmail.com
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
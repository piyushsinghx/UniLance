const PrivacyPolicy = () => {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-bg-primary to-bg-primary"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight mb-4">Privacy Policy</h1>
          <p className="text-text-secondary">Last updated: April 1, 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none space-y-10">
            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">1. Introduction</h2>
              <p className="text-sm text-text-secondary leading-relaxed">At UniLance ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform.</p>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">2. Information We Collect</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>We collect several types of information from and about users of our Platform, including:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Personal Data:</strong> Name, email address (including academic emails), university affiliation, and profile photo.</li>
                  <li><strong>Verification Data:</strong> College ID cards (if uploaded for manual verification). These are reviewed and securely deleted after verification.</li>
                  <li><strong>Profile Data:</strong> Skills, bio, portfolio items, and reviews.</li>
                  <li><strong>Transaction Data:</strong> Payment details (processed securely by Razorpay), order history, and earnings.</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our platform, such as search history (used for AI recommendations), page views, and timestamps.</li>
                  <li><strong>Communication Data:</strong> Messages exchanged between buyers and sellers on the platform.</li>
                </ul>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">3. How We Use Your Information</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>We use the information we collect for various purposes, including:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To provide, maintain, and improve our platform.</li>
                  <li>To verify your student status and maintain the integrity of our student-only network.</li>
                  <li>To facilitate transactions and communications between buyers and sellers.</li>
                  <li>To personalize your experience, including providing AI-powered gig recommendations.</li>
                  <li>To process payments and payouts securely.</li>
                  <li>To send administrative notices, updates, and promotional communications (you can opt-out at any time).</li>
                  <li>To detect, prevent, and address technical issues, fraud, and violations of our Terms of Service.</li>
                </ul>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">4. Information Sharing and Disclosure</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>We do not sell or rent your personal data to third parties. We may share your information in the following situations:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>With Other Users:</strong> Your public profile (name, university, skills, bio, gigs, and reviews) is visible to other users. Buyers and sellers involved in an order can see relevant details to fulfill the transaction.</li>
                  <li><strong>With Service Providers:</strong> We share necessary data with trusted third-party service providers who assist us in operating our platform, conducting our business, or serving our users (e.g., Razorpay for payments, cloud hosting providers).</li>
                  <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
                  <li><strong>Business Transfers:</strong> If UniLance is involved in a merger, acquisition, or asset sale, your personal data may be transferred.</li>
                </ul>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">5. Data Security</h2>
              <p className="text-sm text-text-secondary leading-relaxed">We implement appropriate technical and organizational security measures to protect your personal data from accidental loss, unauthorized access, use, alteration, and disclosure. These measures include encryption (e.g., HTTPS), bcrypt password hashing, secure JWT-based authentication, and restricted access to databases. However, no method of transmission over the internet or electronic storage is 100% secure.</p>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">6. Your Data Rights</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>You have certain rights regarding your personal data:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Access & Update:</strong> You can review and change your personal data by logging into the platform and visiting your account profile page.</li>
                  <li><strong>Deletion:</strong> You can request the deletion of your account and personal data by contacting us at privacy@unilance.in. Note that we may retain certain data as required by law or for legitimate business purposes (e.g., transaction records).</li>
                  <li><strong>Opt-Out:</strong> You can opt-out of receiving promotional emails by following the unsubscribe instructions included in those emails.</li>
                </ul>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">7. Contact Us</h2>
              <p className="text-sm text-text-secondary leading-relaxed">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at privacy@unilance.in.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

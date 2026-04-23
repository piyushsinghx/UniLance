const TermsOfService = () => {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-bg-primary to-bg-primary"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight mb-4">Terms of Service</h1>
          <p className="text-text-secondary">Last updated: April 1, 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none space-y-10">
            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">1. Acceptance of Terms</h2>
              <p className="text-sm text-text-secondary leading-relaxed">By accessing or using UniLance ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, you must not use the Platform. UniLance reserves the right to update these Terms at any time, and your continued use of the Platform constitutes acceptance of any modifications.</p>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">2. Eligibility</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>UniLance is exclusively available to currently enrolled university and college students. By creating an account, you represent and warrant that:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You are at least 18 years of age or have reached the age of majority in your jurisdiction.</li>
                  <li>You are currently enrolled at a recognized university or educational institution.</li>
                  <li>The information you provide during registration, including your academic email and/or college identification, is truthful and accurate.</li>
                  <li>You will maintain the accuracy of your account information throughout your use of the Platform.</li>
                </ul>
                <p>UniLance reserves the right to verify your student status at any time and to suspend or terminate accounts that fail verification.</p>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">3. Account Registration & Security</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>When creating an account, you must provide accurate, current, and complete information. You are responsible for:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Maintaining the confidentiality of your account credentials (email and password).</li>
                  <li>All activities that occur under your account, whether authorized by you or not.</li>
                  <li>Notifying UniLance immediately of any unauthorized use of your account at security@unilance.in.</li>
                </ul>
                <p>You may not create multiple accounts, share your account credentials, or transfer your account to another person. UniLance uses JWT-based authentication and bcrypt password hashing to protect your account.</p>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">4. Buyer & Seller Obligations</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-4">
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">4.1 Sellers ("Freelancers")</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Must provide accurate descriptions of their services (gigs), including scope, deliverables, pricing, and delivery timelines.</li>
                    <li>Must deliver work that matches the gig description and agreed-upon requirements.</li>
                    <li>Must communicate professionally and respond to buyer inquiries in a timely manner.</li>
                    <li>Must not engage in plagiarism, copyright infringement, or delivery of harmful content.</li>
                    <li>Are responsible for paying applicable taxes on their earnings.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">4.2 Buyers ("Clients")</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Must provide clear, detailed project requirements when placing an order.</li>
                    <li>Must make payment through the Platform's official payment system (Razorpay).</li>
                    <li>Must review deliveries within 7 days of submission. Failure to respond may result in automatic order completion.</li>
                    <li>Must not request work that violates intellectual property laws, academic integrity policies, or applicable regulations.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">5. Payments & Fees</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <ul className="list-disc pl-5 space-y-2">
                  <li>All payments are processed through Razorpay, a PCI-DSS compliant payment gateway.</li>
                  <li>UniLance charges a 10% service fee on completed orders, deducted from the seller's earnings.</li>
                  <li>Funds are held in escrow until the buyer accepts the delivery or the auto-completion period (7 days) expires.</li>
                  <li>Sellers receive payment within 2-3 business days after order completion, minus the platform fee.</li>
                  <li>All prices displayed on the Platform are in Indian Rupees (INR) and include the platform fee.</li>
                  <li>UniLance does not charge any registration, subscription, or hidden fees.</li>
                </ul>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">6. Intellectual Property</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>Upon completion of an order and full payment:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The buyer receives a non-exclusive license to use the delivered work for its intended purpose, unless the Premium tier includes a commercial license.</li>
                  <li>The seller retains the right to showcase the work in their portfolio unless otherwise agreed.</li>
                  <li>Neither party may claim ownership of the other party's pre-existing intellectual property.</li>
                </ul>
                <p>Sellers must ensure all delivered work is original or properly licensed. Plagiarism and copyright infringement will result in immediate account suspension.</p>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">7. Prohibited Activities</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>You agree not to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use the Platform for any unlawful purpose or in violation of these Terms.</li>
                  <li>Attempt to circumvent the Platform's payment system by accepting direct payments.</li>
                  <li>Create fake reviews, manipulate ratings, or engage in fraudulent activities.</li>
                  <li>Harass, threaten, or discriminate against other users.</li>
                  <li>Upload malicious files, malware, or spam content.</li>
                  <li>Impersonate another person or create multiple accounts.</li>
                  <li>Scrape, crawl, or use automated tools to access the Platform without permission.</li>
                  <li>Offer or request services related to academic dishonesty (e.g., taking exams, writing assignments for submission as one's own work).</li>
                </ul>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">8. Dispute Resolution</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>In the event of a dispute between a buyer and seller:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Both parties are encouraged to resolve the issue through the Platform's messaging system first.</li>
                  <li>If unresolved, either party may submit a dispute to UniLance's Trust & Safety team at disputes@unilance.in.</li>
                  <li>UniLance will review the dispute within 5 business days and may request additional evidence from both parties.</li>
                  <li>UniLance's decision on disputes is final and binding for the purposes of the Platform.</li>
                  <li>Refunds, if applicable, are processed within 7-10 business days of resolution.</li>
                </ul>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">9. Limitation of Liability</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>UniLance acts as a marketplace connecting buyers and sellers. We do not:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Guarantee the quality, accuracy, or legality of any gig or delivered work.</li>
                  <li>Assume responsibility for any loss resulting from transactions between users.</li>
                  <li>Provide employment, partnership, or agency relationships between the Platform and its users.</li>
                </ul>
                <p>To the maximum extent permitted by law, UniLance's total liability for any claim arising from or related to the Platform shall not exceed the amount paid by the claimant to UniLance in the 12 months preceding the claim.</p>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">10. Termination</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>UniLance reserves the right to suspend or terminate your account at any time, with or without notice, for:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Violation of these Terms of Service.</li>
                  <li>Fraudulent, abusive, or harmful behavior.</li>
                  <li>Failure to verify student status when requested.</li>
                  <li>Inactivity for more than 12 consecutive months.</li>
                </ul>
                <p>You may delete your account at any time by contacting support@unilance.in. Outstanding orders must be completed or cancelled before account deletion.</p>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">11. Governing Law</h2>
              <p className="text-sm text-text-secondary leading-relaxed">These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or the use of the Platform shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.</p>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">12. Contact Information</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-2">
                <p>For questions about these Terms of Service, contact us at:</p>
                <p><strong className="text-text-primary">UniLance Legal Team</strong></p>
                <p>Email: legal@unilance.in</p>
                <p>Address: UniLance Technologies Pvt. Ltd., Startup Incubation Centre, New Delhi, India - 110001</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;

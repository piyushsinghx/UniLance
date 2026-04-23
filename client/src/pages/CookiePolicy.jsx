const CookiePolicy = () => {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-bg-primary to-bg-primary"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight mb-4">Cookie Policy</h1>
          <p className="text-text-secondary">Last updated: April 1, 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none space-y-10">
            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">1. What Are Cookies?</h2>
              <p className="text-sm text-text-secondary leading-relaxed">Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and supply information to the owners of the site. UniLance uses cookies and similar tracking technologies (like local storage) to improve our platform and deliver personalized services.</p>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">2. Types of Cookies We Use</h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-4">
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Essential Cookies (Local Storage)</h3>
                  <p>These are necessary for the platform to function properly. We primarily use local storage to keep you logged in securely (e.g., storing your JWT token and minimal user data). You cannot opt out of these as the platform will not work without them.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Performance & Analytics Cookies</h3>
                  <p>These allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Functionality Cookies</h3>
                  <p>These enable the platform to provide enhanced functionality and personalization, such as remembering your preferences or supporting our AI-powered gig recommendations based on your recent searches.</p>
                </div>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">3. Managing Your Preferences</h2>
              <p className="text-sm text-text-secondary leading-relaxed">Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, as it will no longer be personalized to you. It may also stop you from saving customized settings like login information. You can clear your local storage at any time by logging out of your UniLance account or clearing your browser data.</p>
            </div>
            
            <div className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">4. Contact Us</h2>
              <p className="text-sm text-text-secondary leading-relaxed">If you have any questions about our use of cookies, please email us at privacy@unilance.in.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;

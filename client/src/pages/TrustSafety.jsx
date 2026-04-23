import { Shield, Lock, UserCheck, AlertTriangle } from 'lucide-react';

const TrustSafety = () => {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-bg-primary to-bg-primary"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center text-success mx-auto mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight mb-4">Trust & Safety</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">Our commitment to keeping the UniLance community safe, secure, and reliable for all student freelancers and clients.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              { icon: UserCheck, title: 'Verified Student Network', desc: 'Every freelancer on UniLance is a verified student. We use academic email (.edu, .ac.in) validation and manual college ID checks to ensure a genuine peer-to-peer ecosystem.' },
              { icon: Lock, title: 'Secure Escrow Payments', desc: 'Buyers pay upfront, but funds are held securely in escrow by Razorpay. Sellers are guaranteed payment for completed work, and buyers are protected against non-delivery.' },
              { icon: Shield, title: '24/7 Moderation', desc: 'Our automated systems and human moderators work around the clock to detect spam, inappropriate content, and fraudulent activity before it affects you.' },
              { icon: AlertTriangle, title: 'Dispute Resolution', desc: 'If things don\'t go as planned, our dedicated Trust & Safety team steps in to mediate fairly based on order requirements, communication logs, and delivered files.' }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-bg-secondary rounded-xl border border-border p-8 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-bg-secondary rounded-xl border border-border p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Report an Issue</h2>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">If you encounter suspicious behavior, harassment, or someone violating our Terms of Service, please report it immediately. Your reports are kept strictly confidential.</p>
            <a href="mailto:safety@unilance.in" className="inline-flex items-center gap-2 bg-error hover:bg-error/90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-error/20">
              <AlertTriangle size={18} /> Contact Safety Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrustSafety;

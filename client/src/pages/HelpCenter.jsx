import { Link } from 'react-router-dom';
import { HelpCircle, Search, MessageSquare, Shield, CreditCard, FileText, Users, BookOpen, ChevronRight, Mail, ArrowRight } from 'lucide-react';

const HELP_CATEGORIES = [
  {
    icon: Users,
    title: 'Getting Started',
    articles: [
      { title: 'How to create your UniLance account', answer: 'Visit the registration page, choose your role (Buyer or Seller), enter your college email for automatic verification, or upload your college ID for manual review. Fill in your details and you\'re ready to go!' },
      { title: 'How to verify your student identity', answer: 'UniLance supports two verification methods: (1) Automatic — sign up with an academic email (.edu, .ac.in). (2) Manual — upload a clear photo of your college ID card. Manual reviews are typically completed within 24-48 hours.' },
      { title: 'Setting up your seller profile', answer: 'Navigate to your Profile page, click "Edit Profile", add your skills, bio, university, and avatar. A complete profile with relevant skills increases your visibility in search results and AI recommendations.' },
      { title: 'Understanding buyer vs. seller accounts', answer: 'Buyers hire freelancers and place orders. Sellers create gigs and deliver services. You choose your role during registration, but you can contact support to switch roles later.' },
    ],
  },
  {
    icon: FileText,
    title: 'Orders & Delivery',
    articles: [
      { title: 'How to place an order', answer: 'Browse gigs, select a pricing tier (Basic/Standard/Premium), click "Continue", share your requirements, and complete payment via Razorpay. Your order becomes active once payment is confirmed.' },
      { title: 'Order status explained', answer: 'Pending: Payment being processed. Active: Seller is working on your order. Delivered: Work submitted for review. Revision: You\'ve requested changes. Completed: You\'ve accepted the delivery.' },
      { title: 'How to request a revision', answer: 'After a seller delivers, you\'ll see "Accept & Complete" and "Request Revision" buttons. Click revision, explain what needs to change, and the seller will update the work accordingly.' },
      { title: 'What if my order is late?', answer: 'If a seller misses the delivery deadline, you can contact them via messages, request a cancellation, or reach out to our support team for assistance.' },
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments & Billing',
    articles: [
      { title: 'Supported payment methods', answer: 'UniLance uses Razorpay, supporting UPI (GPay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking (all major banks), and wallet payments.' },
      { title: 'When do sellers receive payment?', answer: 'Funds are held in escrow until the buyer accepts delivery. After acceptance, the seller receives the payment (minus 10% platform fee) within 2-3 business days via bank transfer.' },
      { title: 'How to request a refund', answer: 'If the work is not delivered or significantly differs from what was promised, go to your order page and contact support. Our Trust & Safety team will review the case and process eligible refunds within 5-7 business days.' },
      { title: 'Understanding the platform fee', answer: 'UniLance charges a 10% service fee on completed orders. This covers secure payments, platform maintenance, AI features, and customer support. There are no sign-up or subscription fees.' },
    ],
  },
  {
    icon: Shield,
    title: 'Safety & Security',
    articles: [
      { title: 'How UniLance protects your payment', answer: 'All payments are processed through Razorpay with bank-level encryption. Funds are held in escrow and only released to the seller after you approve the delivery. Your financial data is never stored on our servers.' },
      { title: 'Reporting a problem', answer: 'Click the "Contact Seller" button on any order page to communicate directly. For unresolved issues, email support@unilance.in with your order ID and a description of the problem.' },
      { title: 'Account security best practices', answer: 'Use a strong, unique password (8+ characters with numbers and symbols). Never share your login credentials. UniLance will never ask for your password via email or chat.' },
      { title: 'How we verify student identity', answer: 'We verify students through academic email domains (.edu, .ac.in, .ac.uk) for instant verification, or through manual college ID review for non-academic email users. This ensures UniLance remains a trusted, student-only network.' },
    ],
  },
];

const HelpCenter = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg-primary to-accent/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight mb-6">
            Help <span className="gradient-text">Center</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Find answers to common questions about using UniLance. Can't find what you need? Contact our support team.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {HELP_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.title}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Icon size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">{category.title}</h2>
                </div>
                <div className="space-y-4">
                  {category.articles.map((article) => (
                    <details key={article.title} className="group bg-bg-secondary rounded-xl border border-border overflow-hidden">
                      <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-bg-card transition-colors">
                        <span className="text-sm font-medium text-text-primary pr-4">{article.title}</span>
                        <ChevronRight size={16} className="text-text-muted group-open:rotate-90 transition-transform flex-shrink-0" />
                      </summary>
                      <div className="px-5 pb-5 pt-1">
                        <p className="text-sm text-text-secondary leading-relaxed">{article.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-bg-secondary/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Still Need Help?</h2>
          <p className="text-text-secondary mb-8">Our support team is available Monday to Saturday, 9 AM – 6 PM IST.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:support@unilance.in" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20">
              <Mail size={18} /> Email Support
            </a>
            <Link to="/messages" className="inline-flex items-center gap-2 bg-bg-secondary hover:bg-bg-card text-text-primary font-semibold px-6 py-3 rounded-xl border border-border transition-all">
              <MessageSquare size={18} /> Live Chat
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;

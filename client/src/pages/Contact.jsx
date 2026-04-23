import { useState } from 'react';
import { Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-bg-primary to-bg-primary"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight mb-4">Contact <span className="gradient-text">Us</span></h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">Have a question, feedback, or partnership inquiry? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Get in Touch</h2>
              <p className="text-text-secondary mb-10 leading-relaxed">Our support team is available Monday to Saturday, 9 AM to 6 PM IST. We aim to respond to all inquiries within 24 hours.</p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">Email</h3>
                    <p className="text-sm text-text-secondary mb-1">For support: <a href="mailto:support@unilance.in" className="text-primary hover:underline">support@unilance.in</a></p>
                    <p className="text-sm text-text-secondary">For business: <a href="mailto:partners@unilance.in" className="text-primary hover:underline">partners@unilance.in</a></p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">Live Chat</h3>
                    <p className="text-sm text-text-secondary">Available for registered users directly from the dashboard messaging system.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">Office</h3>
                    <p className="text-sm text-text-secondary">UniLance Technologies Pvt. Ltd.<br />Startup Incubation Centre<br />New Delhi, India - 110001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-bg-secondary rounded-2xl border border-border p-8 shadow-xl shadow-black/10">
              <h3 className="text-xl font-bold text-text-primary mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Provide details about your inquiry..."
                  ></textarea>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Sending...' : <><Send size={18} /> Send Message</>}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

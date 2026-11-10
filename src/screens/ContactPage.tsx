'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../components/StoreProvider.tsx';

export const ContactPage: React.FC = () => {
  const { showToast: onShowToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'Order Status & Tracking',
    orderNumber: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      onShowToast('Please fill out all required fields');
      return;
    }

    const generatedTicket = `KCK-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setFormSubmitted(true);
    onShowToast(`Ticket ${generatedTicket} created successfully!`);
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      inquiryType: 'Order Status & Tracking',
      orderNumber: '',
      message: '',
    });
    setFormSubmitted(false);
    setTicketId('');
  };

  const stores = [
    {
      city: 'New York City',
      name: 'KICKS. Broadway Flagship',
      address: '540 Broadway, SoHo, NY 10012',
      hours: 'Mon - Sat: 11:00 AM - 8:00 PM | Sun: 12:00 PM - 6:00 PM',
      phone: '+1 (212) 555-0194',
      badge: 'Flagship & Drop Lab',
    },
    {
      city: 'Tokyo',
      name: 'KICKS. Harajuku Drop Space',
      address: '4-26-10 Jingumae, Shibuya-ku, Tokyo 150-0001',
      hours: 'Daily: 11:00 AM - 8:00 PM JST',
      phone: '+81 3 5555 0182',
      badge: 'Archival Lounge',
    },
    {
      city: 'London',
      name: 'KICKS. Soho Store',
      address: '14 Carnaby Street, Soho, London W1F 9PN',
      hours: 'Mon - Sat: 10:00 AM - 7:00 PM | Sun: 12:00 PM - 6:00 PM',
      phone: '+44 20 7946 0921',
      badge: 'European Hub',
    },
  ];

  const faqs = [
    {
      q: 'How do you guarantee that all sneakers are 100% authentic?',
      a: 'Every single pair that enters our vault passes through our 10-step authentication lab. We utilize UV ultraviolet spectroscopy, stitch-per-inch tension matching against original blueprints, weight density testing down to the gram, and barcode RFID registration. Only pairs that pass all 10 checks receive our tamper-evident numbered holographic NFC tag.',
    },
    {
      q: 'What is your shipping timeframe and packaging quality?',
      a: 'Orders are double-boxed and dispatched via express courier within 24 to 48 hours. Domestic US delivery typically takes 2–4 business days. International delivery takes 4–7 business days with full online door-to-door tracking. Orders over $150 qualify for free express shipping.',
    },
    {
      q: 'What is your 30-Day Return & Exchange policy?',
      a: 'If you are not completely satisfied with your pair, or if the size doesn’t fit perfectly, you can return unworn sneakers with all original tags attached and original box in pristine condition within 30 days of delivery for a full refund or direct exchange.',
    },
    {
      q: 'Can I cancel or modify my shipping address after placing an order?',
      a: 'We process orders quickly to ensure rapid dispatch. You can modify or cancel your order within 2 hours of placement directly from your order receipt or by reaching out immediately with your order number via live chat or email.',
    },
  ];

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-neutral-900 pb-16">
      
      {/* Top Banner */}
      <section className="bg-[#111111] text-white py-14 sm:py-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-3">
              CLIENT SERVICES & CONCIERGE
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4">
              WE'RE HERE FOR YOU.
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Have questions regarding sizing, upcoming drop reservations, or order status? Our expert sneaker concierge team is on standby 24/7.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Email Support</h3>
              <p className="text-xs text-neutral-500 mt-0.5 mb-2">Average response under 2 hours</p>
              <a
                href="mailto:support@kicks-official.com"
                className="text-xs font-bold text-black hover:underline"
              >
                support@kicks-official.com
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Sneaker Concierge</h3>
              <p className="text-xs text-neutral-500 mt-0.5 mb-2">Mon - Sat: 9:00 AM - 8:00 PM EST</p>
              <a
                href="tel:18005555425"
                className="text-xs font-bold text-black hover:underline"
              >
                +1 (800) 555-KICKS
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Authentication Inquiries</h3>
              <p className="text-xs text-neutral-500 mt-0.5 mb-2">Digital NFC cert lookup & verification</p>
              <span className="text-xs font-bold text-black">
                verify@kicks-official.com
              </span>
            </div>
          </div>

        </div>

        {/* Main Grid: Contact Form + Flagship Stores */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left: Contact Form Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-sm">
            <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight mb-2">
              Send Us a Message
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              Fill out the form below and an authentic sneaker specialist will review your inquiry immediately.
            </p>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-emerald-900 uppercase">
                  Inquiry Received!
                </h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your support ticket has been registered in our concierge queue. A specialist will reply to <strong>{formData.email}</strong> shortly.
                </p>
                <div className="inline-block bg-white border border-emerald-300 px-4 py-2 rounded-xl text-xs font-mono font-bold text-emerald-900">
                  Ticket Reference: {ticketId}
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleResetForm}
                    className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1.5">
                      Inquiry Subject *
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) =>
                        setFormData({ ...formData, inquiryType: e.target.value })
                      }
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white transition-all cursor-pointer"
                    >
                      <option>Order Status & Tracking</option>
                      <option>Authenticity Verification</option>
                      <option>Size & Fit Recommendation</option>
                      <option>Returns & Exchanges</option>
                      <option>Drop Reservations</option>
                      <option>Press & Partnerships</option>
                      <option>General Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1.5">
                      Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. #ORD-9842"
                      value={formData.orderNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orderNumber: e.target.value,
                        })
                      }
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you need help with (shoe model, size inquiry, delivery details)..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    * All fields with asterisk are mandatory
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Flagship Stores */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight mb-4">
              Global Flagship Stores
            </h2>

            {stores.map((store) => (
              <div
                key={store.city}
                className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900">
                    {store.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-mono">
                    {store.badge}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{store.hours}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{store.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* FAQ Quick Accordion Section */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 text-neutral-500 mb-1">
              <HelpCircle className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">
                FREQUENTLY ASKED QUESTIONS
              </span>
            </div>
            <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">
              Instant Answers
            </h2>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-neutral-200">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 group cursor-pointer"
                  >
                    <span className="text-sm font-bold text-neutral-900 group-hover:text-black">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-black' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed animate-in fade-in duration-200">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

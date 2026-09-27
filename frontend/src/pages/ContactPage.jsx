import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock, Building, Sparkles } from 'lucide-react';
import { submitContactMessage } from '../services/api';
import {
  COLLEGE_NAME,
  COLLEGE_LOCATION,
  FESTIVAL_EMAIL,
  FESTIVAL_PHONE
} from '../utils/constants';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitContactMessage(formData);
      if (res.data?.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setError(res.data?.message || 'Failed to submit message.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-purple/15 text-brand-purple dark:text-brand-accent">
          <Mail className="w-3.5 h-3.5" />
          <span>Festival Coordination Committee</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
          Contact Committee
        </h1>
        <p className="text-xs sm:text-sm text-dark-text-secondary max-w-xl mx-auto leading-relaxed">
          Questions about tournament formats, schedule clarifications, or campus directions? Send a message directly to our committee.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left Column: Campus Information & Contact Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md space-y-6">
            <h2 className="text-lg font-bold font-display text-dark-text dark:text-dark-text light:text-light-text flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-purple" />
              <span>Campus Information</span>
            </h2>

            <div className="space-y-4 text-xs text-dark-text-secondary">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-error shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text">{COLLEGE_NAME}</p>
                  <p className="mt-0.5">{COLLEGE_LOCATION}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-secondary shrink-0" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text">Helpdesk Helpline</p>
                  <p>{FESTIVAL_PHONE}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-purple shrink-0" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text">Official Email</p>
                  <p>{FESTIVAL_EMAIL}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-brand-success shrink-0" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text">Festival Office Hours</p>
                  <p>08:00 AM - 08:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border text-xs space-y-2">
            <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <span>Outstation Teams Notice</span>
            </p>
            <p className="text-dark-muted leading-relaxed">
              Accommodation in campus student guest houses is available for verified collegiate teams traveling from outside Guntur/Vijayawada.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-3">
          <div className="p-6 sm:p-10 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-2xl space-y-6">
            <h2 className="text-xl font-bold font-display text-dark-text dark:text-dark-text light:text-light-text">
              Send an Inquiry
            </h2>

            {/* Success state banner */}
            {success && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3 font-semibold">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>Thank you! Your message has been sent to the festival committee.</span>
              </div>
            )}

            {/* Error state banner */}
            {error && (
              <div className="p-4 rounded-2xl bg-brand-error/15 border border-brand-error/30 text-brand-error text-xs flex items-center gap-3 font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-dark-text-secondary">
                    Your Name <span className="text-brand-error">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-dark-text-secondary">
                    Email Address <span className="text-brand-error">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@college.edu"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-dark-text-secondary">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98480 00000"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-dark-text-secondary">
                    Subject <span className="text-brand-error">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Query regarding Hackathon hardware"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-dark-text-secondary">
                  Message <span className="text-brand-error">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your message or inquiry here..."
                  className="w-full px-4 py-3 rounded-2xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {submitting ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Committee</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

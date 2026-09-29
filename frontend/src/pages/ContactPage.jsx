import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock,
  Building, Lock, UserCheck, ShieldCheck, ArrowRight, MessageSquareText
} from 'lucide-react';
import { submitContactMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  COLLEGE_NAME,
  COLLEGE_LOCATION,
  FESTIVAL_EMAIL,
  FESTIVAL_PHONE
} from '../utils/constants';

export default function ContactPage() {
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Pre-populate with authenticated user info
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const quickSubjects = [
    'Complaint / Grievance',
    'Rule & Eligibility Doubt',
    'Schedule Clarification',
    'Venue & Accommodation',
    'Technical / Pass Issue',
    'General Inquiry'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.subject.trim() || !formData.message.trim()) {
      setError('Please provide both a subject and your message/complaint details.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitContactMessage({
        ...formData,
        name: user?.name || formData.name,
        email: user?.email || formData.email
      });

      if (res.data?.success) {
        setSuccess(true);
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          subject: '',
          message: ''
        });
      } else {
        setError(res.data?.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please sign in again to submit inquiries.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2980B9]/15 text-[#2980B9] border border-[#2980B9]/30">
          <Mail className="w-3.5 h-3.5" />
          <span>Festival Coordination Committee</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-dark-text dark:text-dark-text light:text-slate-900 tracking-tight">
          Helpdesk &amp; Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-600 max-w-xl mx-auto leading-relaxed">
          Have doubts about tournament regulations, accommodation, schedule details, or complaints? Reach out directly to the festival organizing team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left Column: Campus Information & Contact Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-white border border-[#95A5A6]/20 dark:border-[#95A5A6]/15 light:border-slate-200 shadow-md space-y-6">
            <h2 className="text-lg font-bold font-display text-dark-text dark:text-dark-text light:text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#2980B9]" />
              <span>Campus Information</span>
            </h2>

            <div className="space-y-4 text-xs text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#E67E22] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-slate-900">{COLLEGE_NAME}</p>
                  <p className="mt-0.5">{COLLEGE_LOCATION}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#2980B9] shrink-0" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-slate-900">Helpdesk Helpline</p>
                  <a href={`tel:${FESTIVAL_PHONE}`} className="hover:text-[#2980B9] transition-colors">
                    {FESTIVAL_PHONE}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#2980B9] shrink-0" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-slate-900">Official Email</p>
                  <a href={`mailto:${FESTIVAL_EMAIL}`} className="hover:text-[#2980B9] transition-colors">
                    {FESTIVAL_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-slate-900">Festival Office Hours</p>
                  <p>08:00 AM - 08:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-white border border-[#95A5A6]/20 text-xs space-y-2">
            <p className="font-bold text-dark-text dark:text-dark-text light:text-slate-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#2980B9]" />
              <span>Outstation Teams Notice</span>
            </p>
            <p className="text-dark-muted leading-relaxed">
              Accommodation in campus student guest houses is available for verified collegiate teams traveling from outside Guntur/Vijayawada.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Message Form or Login Gate */}
        <div className="lg:col-span-3">
          {!isAuthenticated ? (
            /* Login Required Gate */
            <div className="p-8 sm:p-12 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-white border border-[#95A5A6]/25 dark:border-[#95A5A6]/20 light:border-slate-200 shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#2980B9]/15 border border-[#2980B9]/30 text-[#2980B9] flex items-center justify-center mx-auto shadow-md">
                <Lock className="w-8 h-8 text-[#2980B9]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-display text-dark-text dark:text-dark-text light:text-slate-900">
                  Authentication Required
                </h2>
                <p className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-600 max-w-md mx-auto leading-relaxed">
                  To ask doubts, submit complaints, or contact the committee, you must be signed in. This ensures faculty convenors can track your ticket and follow up directly with you.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
                <Link
                  to="/auth?mode=signin&redirect=/contact"
                  className="w-full py-3.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#2980B9] to-[#2471A3] hover:from-[#3498DB] hover:to-[#2980B9] shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Sign In to Your Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/auth?mode=signup&redirect=/contact"
                  className="w-full py-3.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-dark-text dark:text-dark-text light:text-slate-800 bg-dark-elevated dark:bg-dark-elevated light:bg-slate-100 hover:bg-dark-highest border border-dark-border dark:border-dark-border light:border-slate-300 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Create Account</span>
                </Link>
              </div>

              <div className="pt-6 border-t border-[#95A5A6]/20 text-xs text-dark-muted space-y-1">
                <p>
                  Need quick assistance without an account? Call our helpline:
                </p>
                <a href={`tel:${FESTIVAL_PHONE}`} className="inline-block text-[#2980B9] font-bold hover:underline">
                  {FESTIVAL_PHONE}
                </a>
              </div>
            </div>
          ) : (
            /* Authenticated Submission Form */
            <div className="p-6 sm:p-10 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-white border border-[#95A5A6]/25 dark:border-[#95A5A6]/20 light:border-slate-200 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#95A5A6]/20">
                <div>
                  <h2 className="text-xl font-bold font-display text-dark-text dark:text-dark-text light:text-slate-900">
                    Submit Inquiry / Complaint
                  </h2>
                  <p className="text-xs text-dark-muted mt-0.5">
                    Your message will be routed directly to the festival convenors.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified User</span>
                </div>
              </div>

              {/* Success state banner */}
              {success && (
                <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs space-y-2 font-semibold">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>Inquiry Submitted Successfully!</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Thank you, <strong className="text-white">{user?.name}</strong>. Your query has been logged in the committee dashboard. The administrators will review it and reply directly to your email address (<strong>{user?.email}</strong>).
                  </p>
                </div>
              )}

              {/* Error state banner */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3 font-semibold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Identity Display */}
                <div className="p-4 rounded-2xl bg-dark-elevated dark:bg-dark-elevated light:bg-slate-50 border border-dark-border dark:border-dark-border light:border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-dark-muted block text-[11px]">Logged in as:</span>
                    <span className="font-bold text-dark-text dark:text-dark-text light:text-slate-900 mt-0.5 block truncate">
                      {user?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-dark-muted block text-[11px]">Reply Email:</span>
                    <span className="font-mono text-dark-text dark:text-dark-text light:text-slate-900 mt-0.5 block truncate">
                      {user?.email}
                    </span>
                  </div>
                </div>

                {/* Quick Subject Chips */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-700">
                    Topic / Category
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {quickSubjects.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, subject: s })}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          formData.subject === s
                            ? 'bg-[#2980B9] text-white shadow-sm'
                            : 'bg-dark-elevated dark:bg-dark-elevated light:bg-slate-100 text-dark-muted hover:text-dark-text border border-dark-border'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-700">
                      Subject <span className="text-[#E67E22]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Cricket tournament reporting timing doubt"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-slate-50 border border-dark-border dark:border-dark-border light:border-slate-300 text-xs text-dark-text dark:text-dark-text light:text-slate-900 placeholder:text-dark-muted focus:outline-none focus:border-[#2980B9]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-700">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98480 00000"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-slate-50 border border-dark-border dark:border-dark-border light:border-slate-300 text-xs text-dark-text dark:text-dark-text light:text-slate-900 placeholder:text-dark-muted focus:outline-none focus:border-[#2980B9]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-700">
                    Message / Complaint Details <span className="text-[#E67E22]">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue, complaint, or question clearly so the committee can provide a fast resolution..."
                    className="w-full px-4 py-3 rounded-2xl bg-dark-elevated dark:bg-dark-elevated light:bg-slate-50 border border-dark-border dark:border-dark-border light:border-slate-300 text-xs text-dark-text dark:text-dark-text light:text-slate-900 placeholder:text-dark-muted focus:outline-none focus:border-[#2980B9] resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#2980B9] to-[#2471A3] hover:from-[#3498DB] hover:to-[#2980B9] shadow-md shadow-[#2980B9]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting inquiry...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Committee</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

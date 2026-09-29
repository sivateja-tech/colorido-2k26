import React, { useState, useEffect } from 'react';
import {
  Mail, Search, Filter, Trash2, CheckCircle2, Clock,
  AlertCircle, RefreshCw, X, MessageSquare, User, Phone,
  Calendar, CheckCheck, Send, MessageCircle, ExternalLink
} from 'lucide-react';
import {
  adminFetchMessages,
  adminUpdateMessageStatus,
  adminReplyToMessage,
  adminDeleteMessage
} from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import BackButton from '../components/BackButton';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Active / Selected Message
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // In-App Reply Form State
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminFetchMessages({
        search: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined
      });
      if (res.data.success) {
        setMessages(res.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadMessages();
  };

  const handleStatusChange = async (msgId, newStatus) => {
    try {
      await adminUpdateMessageStatus(msgId, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: newStatus } : m))
      );
      if (selectedMessage && selectedMessage.id === msgId) {
        setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
      }
      setSuccessMsg(`Message marked as ${newStatus}.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to update message status.');
    }
  };

  const handleDelete = async (msgId) => {
    try {
      await adminDeleteMessage(msgId);
      setDeleteConfirmId(null);
      if (selectedMessage && selectedMessage.id === msgId) {
        setSelectedMessage(null);
      }
      setSuccessMsg('Message deleted.');
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to delete message.');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    setError(null);

    try {
      const res = await adminReplyToMessage(selectedMessage.id, {
        replyText: replyText.trim(),
        subject: replySubject.trim() || `Re: ${selectedMessage.subject} — COLORIDO 2K26 Helpdesk`
      });

      if (res.data?.success) {
        setSuccessMsg(`Official response dispatched to ${selectedMessage.email} and inquiry marked as RESOLVED!`);
        setMessages((prev) =>
          prev.map((m) => (m.id === selectedMessage.id ? { ...m, status: 'RESOLVED' } : m))
        );
        setSelectedMessage((prev) => ({ ...prev, status: 'RESOLVED' }));
        setReplyText('');
        setTimeout(() => setSuccessMsg(''), 4500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch email reply.');
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'UNREAD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" /> UNREAD
          </span>
        );
      case 'READ':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <CheckCircle2 className="w-3 h-3" /> READ
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCheck className="w-3 h-3" /> RESOLVED
          </span>
        );
      default:
        return <span className="text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-6 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BackButton fallback="/admin/dashboard" label="Dashboard" />
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-palette-blue" />
              <h1 className="text-xl sm:text-2xl font-display font-black text-dark-text dark:text-dark-text light:text-light-text">
                Inquiries &amp; Helpdesk Messages
              </h1>
            </div>
          </div>
          <p className="text-xs text-dark-muted mt-1">
            Incoming queries from participants, college faculty coordinators, and festival visitors.
          </p>
        </div>

        <button
          onClick={loadMessages}
          disabled={loading}
          className="p-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border dark:border-dark-border light:border-light-border text-dark-text-secondary hover:text-dark-text transition-colors self-start sm:self-auto"
          title="Reload Messages"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-rose-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-4 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
        <form onSubmit={handleSearchSubmit} className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sender name, subject, message text..."
            className="w-full pl-10 pr-20 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-[10px] font-bold bg-brand-purple text-white hover:bg-brand-purple-hover"
          >
            Search
          </button>
        </form>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Statuses ({messages.length})</option>
            <option value="UNREAD">Unread</option>
            <option value="READ">Read</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Messages Grid / Table */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : messages.length === 0 ? (
        <div className="bg-dark-surface p-12 text-center rounded-2xl border border-dark-border">
          <Mail className="w-10 h-10 mx-auto text-dark-muted mb-3" />
          <h3 className="text-base font-bold text-dark-text">No Messages Found</h3>
          <p className="text-xs text-dark-muted mt-1">
            All caught up! No visitor inquiries match this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List Column */}
          <div className="lg:col-span-1 space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {messages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setReplySubject(`Re: ${msg.subject} — COLORIDO 2K26 Helpdesk`);
                    setReplyText('');
                    if (msg.status === 'UNREAD') {
                      handleStatusChange(msg.id, 'READ');
                    }
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border-brand-purple shadow-sm'
                      : 'bg-dark-surface dark:bg-dark-surface light:bg-light-surface border-dark-border hover:border-brand-purple/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-dark-text truncate max-w-[140px]">
                      {msg.name}
                    </span>
                    {getStatusBadge(msg.status)}
                  </div>
                  <h4 className="font-semibold text-xs text-dark-text-secondary truncate">
                    {msg.subject}
                  </h4>
                  <p className="text-[11px] text-dark-muted line-clamp-2 mt-1">
                    {msg.message}
                  </p>
                  <div className="text-[10px] text-dark-muted mt-2 font-mono">
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Message Detail Column */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface rounded-2xl border border-dark-border p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-dark-border gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-dark-text">
                        {selectedMessage.subject}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-dark-muted mt-1">
                      <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      {getStatusBadge(selectedMessage.status)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Dropdown */}
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-dark-elevated border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                    >
                      <option value="UNREAD">Mark as UNREAD</option>
                      <option value="READ">Mark as READ</option>
                      <option value="RESOLVED">Mark as RESOLVED</option>
                    </select>

                    <button
                      onClick={() => setDeleteConfirmId(selectedMessage.id)}
                      className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sender Details */}
                <div className="p-4 rounded-xl bg-dark-elevated/40 border border-dark-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-dark-muted block text-[11px]">Sender Name:</span>
                    <span className="font-semibold text-dark-text flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-brand-purple" />
                      {selectedMessage.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-dark-muted block text-[11px]">Email Address:</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="font-semibold text-brand-purple hover:underline flex items-center gap-1.5 mt-0.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {selectedMessage.email}
                    </a>
                  </div>

                  {selectedMessage.phone && (
                    <div className="sm:col-span-2">
                      <span className="text-dark-muted block text-[11px]">Contact Phone:</span>
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="font-semibold text-dark-text hover:text-brand-purple flex items-center gap-1.5 mt-0.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-dark-muted">
                    Message Body
                  </h4>
                  <div className="p-5 rounded-xl bg-dark-bg border border-dark-border text-dark-text text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* In-App Direct Email Reply & Resolution */}
                <div className="pt-5 border-t border-dark-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-[#2980B9]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-dark-text">
                        Respond Directly to Participant
                      </h4>
                    </div>
                    <span className="text-[11px] text-dark-muted">
                      Sends official email from COLORIDO 2K26 Helpdesk
                    </span>
                  </div>

                  <form onSubmit={handleSendReply} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        placeholder="Email Subject"
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-[#2980B9]"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={4}
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type official reply message here... The participant will receive this as an official branded email with your solution."
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-[#2980B9] leading-relaxed resize-y"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={sendingReply || !replyText.trim()}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2980B9] hover:bg-[#1F618D] shadow-md shadow-[#2980B9]/20 transition-all disabled:opacity-50"
                        >
                          {sendingReply ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>{sendingReply ? 'Dispatching...' : 'Send Official Email Reply & Resolve'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        {selectedMessage.phone && (
                          <>
                            <a
                              href={`tel:${selectedMessage.phone}`}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-elevated text-dark-text border border-dark-border hover:border-emerald-500 hover:text-emerald-400 text-xs font-semibold transition-colors"
                              title="Call directly"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Call</span>
                            </a>
                            <a
                              href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedMessage.name}, regarding your COLORIDO 2K26 inquiry: `)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
                              title="Message on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>WhatsApp</span>
                            </a>
                          </>
                        )}

                        <a
                          href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(replySubject || `Re: ${selectedMessage.subject} - COLORIDO 2K26`)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-elevated text-dark-muted hover:text-dark-text border border-dark-border text-xs font-semibold transition-colors"
                          title="Open in mail client (mailto)"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Client App</span>
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-dark-surface rounded-2xl border border-dark-border p-12 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
                <MessageSquare className="w-10 h-10 text-dark-muted mb-3" />
                <h3 className="text-base font-bold text-dark-text">Select an Inquiry</h3>
                <p className="text-xs text-dark-muted mt-1 max-w-xs">
                  Choose any message from the left list to review contents and update resolution status.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border max-w-sm w-full rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-dark-text">
              Delete Message?
            </h3>
            <p className="text-xs text-center text-dark-muted mt-2">
              Are you sure you want to remove this message? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-elevated text-dark-text border border-dark-border"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

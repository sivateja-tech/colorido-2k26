import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Printer, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, User, Building, Award, ExternalLink } from 'lucide-react';

export default function DigitalPass({ pass }) {
  const printRef = useRef(null);

  if (!pass) return null;

  const event = pass.event || {};
  let teamMembersList = [];
  try {
    if (pass.teamMembers) {
      teamMembersList = typeof pass.teamMembers === 'string' ? JSON.parse(pass.teamMembers) : pass.teamMembers;
    }
  } catch (e) {
    if (typeof pass.teamMembers === 'string') {
      teamMembersList = pass.teamMembers.split(',').map(m => m.trim());
    }
  }

  // Dynamic origin so scanning works locally, via LAN IP, or on production domain
  const origin = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : (import.meta.env.VITE_APP_URL || 'http://localhost:5173');
  const verifyUrl = `${origin}/verify/${pass.registrationId}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = verifyUrl;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `COLORIDO 2K26 Digital Pass - ${pass.registrationId}`,
          text: `Official Entry Pass for ${event.title || 'COLORIDO 2K26'} - ${pass.fullName}`,
          url: url,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Official Pass Verification link copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Pass Card with #2C3E50 and #1A252F palette */}
      <div
        ref={printRef}
        className="relative bg-gradient-to-b from-[#2C3E50] to-[#1A252F] border border-[#2980B9]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#2980B9]/15 overflow-hidden text-[#ECF0F1]"
      >
        {/* Holographic glowing background effect using #2980B9 and #E67E22 */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2980B9]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#E67E22]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header: Institution & Brand */}
        <div className="flex items-center justify-between border-b border-[#95A5A6]/20 pb-5">
          <div className="flex items-center gap-3">
            <img
              src="/rvrjc_logo.png"
              alt="R V R & J C College of Engineering"
              className="w-12 h-12 object-contain bg-[#1A252F]/70 p-1 rounded-xl border border-[#95A5A6]/20"
            />
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#95A5A6]">
                R V R &amp; J C College of Engineering
              </p>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-[#ECF0F1]">
                COLORIDO <span className="text-[#E67E22]">2K26</span>
              </h2>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Pass
            </span>
          </div>
        </div>

        {/* Pass ID Display Banner */}
        <div className="my-5 p-3.5 rounded-2xl bg-[#1A252F]/70 border border-[#95A5A6]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#95A5A6]">Registration Pass ID</span>
            <div className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#E67E22] via-[#F39C12] to-[#ECF0F1]">
              {pass.registrationId}
            </div>
          </div>
          <div className="text-right text-xs text-[#95A5A6]">
            <span className="block text-[10px] uppercase font-semibold text-[#95A5A6]">Category</span>
            <span className="font-bold text-[#2980B9] uppercase tracking-wider">{event.category || 'EVENT'}</span>
          </div>
        </div>

        {/* QR Code and Primary Attendee Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center my-6">
          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center">
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center p-3 bg-white rounded-2xl border-2 border-white/90 shadow-xl shadow-black/40 hover:scale-[1.03] transition-all"
              title="Click or scan to view live verification"
            >
              <QRCodeSVG
                value={verifyUrl}
                size={145}
                level="M"
                includeMargin={true}
                bgColor="#FFFFFF"
                fgColor="#2C3E50"
              />
              <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-[#2C3E50] group-hover:text-[#2980B9] tracking-wider transition-colors">
                <span>SCAN / VERIFY</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </div>
            </a>
            <span className="mt-2 text-[10px] text-[#95A5A6] font-mono tracking-wider text-center">
              Official Entry QR
            </span>
          </div>

          {/* Attendee Info */}
          <div className="sm:col-span-2 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#95A5A6]">
                <User className="w-3.5 h-3.5 text-[#2980B9]" />
                <span>Participant</span>
              </div>
              <p className="text-lg font-bold text-[#ECF0F1] tracking-wide">{pass.fullName}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#95A5A6]">
                <Building className="w-3.5 h-3.5 text-[#95A5A6]" />
                <span>Institution</span>
              </div>
              <p className="text-sm font-medium text-[#ECF0F1] line-clamp-1">{pass.college}</p>
              <p className="text-xs text-[#BDC3C7]">{pass.department} • {pass.year}</p>
            </div>

            {pass.teamName && (
              <div>
                <span className="text-xs text-[#95A5A6]">Team Name</span>
                <p className="text-sm font-semibold text-[#E67E22]">{pass.teamName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Event Details Card */}
        <div className="p-4 rounded-2xl bg-[#1A252F]/70 border border-[#95A5A6]/20 space-y-2.5">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#E67E22]" />
            <h4 className="text-base font-bold text-[#ECF0F1]">{event.title || 'Official Festival Competition'}</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#BDC3C7]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2980B9]" />
              <span>{event.date || event.demoDate || 'March 20-22, 2026'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>{event.startTime || event.time || event.demoTime || '10:00 AM'}</span>
            </div>
            <div className="sm:col-span-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#95A5A6]" />
              <span>{event.venue || 'R V R & J C Campus'}</span>
            </div>
          </div>
        </div>

        {/* Team Members List (if applicable) */}
        {teamMembersList.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#95A5A6]/20">
            <p className="text-xs font-semibold text-[#95A5A6] mb-2">Registered Team Members ({teamMembersList.length}):</p>
            <div className="flex flex-wrap gap-1.5">
              {teamMembersList.map((member, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] bg-[#2C3E50] border border-[#95A5A6]/30 text-[#ECF0F1]">
                  {member}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Security Watermark Footer */}
        <div className="mt-6 pt-4 border-t border-[#95A5A6]/20 flex items-center justify-between text-[11px] text-[#95A5A6]">
          <span>STATUS: <strong className="text-emerald-400">{pass.status || 'CONFIRMED'}</strong></span>
          <span>Security Code: <strong className="text-[#ECF0F1]">{(pass.registrationId || '').replace('COL26-', '#')}</strong></span>
        </div>
      </div>

      {/* Action Buttons: Print, Download, Share, Verify Online */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={handlePrint}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#34495E] hover:bg-[#2C3E50] text-[#ECF0F1] border border-[#95A5A6]/30 transition-all shadow-md"
        >
          <Printer className="w-4 h-4 text-[#2980B9]" />
          <span>Print / Save PDF</span>
        </button>
        <button
          onClick={handleShare}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#2980B9]/20 hover:bg-[#2980B9]/30 text-[#2980B9] border border-[#2980B9]/40 transition-all shadow-md"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Pass</span>
        </button>
        <a
          href={verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-all shadow-md"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Verify Online</span>
        </a>
      </div>
    </div>
  );
}

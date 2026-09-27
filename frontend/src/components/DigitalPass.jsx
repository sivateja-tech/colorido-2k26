import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Printer, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, User, Building, Award } from 'lucide-react';

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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `COLORIDO 2K26 Digital Pass - ${pass.registrationId}`,
          text: `Here is my official entry pass for ${event.title || 'COLORIDO 2K26'}!`,
          url: url,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Pass link copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Pass Card */}
      <div
        ref={printRef}
        className="relative bg-gradient-to-b from-[#121626] to-[#0a0c14] border border-brand-purple/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-brand-purple/15 overflow-hidden text-slate-100"
      >
        {/* Holographic glowing background effect */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header: Institution & Brand */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <img
              src="/rvrjc_logo.png"
              alt="R V R & J C College of Engineering"
              className="w-12 h-12 object-contain bg-white/5 p-1 rounded-xl border border-white/10"
            />
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
                R V R & J C College of Engineering
              </p>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                COLORIDO <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-cyan">2K26</span>
              </h2>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
        </div>

        {/* Pass ID Display Banner */}
        <div className="my-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Registration Pass ID</span>
            <div className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              {pass.registrationId}
            </div>
          </div>
          <div className="text-right text-xs text-slate-400">
            <span className="block text-[10px] uppercase">Category</span>
            <span className="font-semibold text-brand-cyan uppercase">{event.category || 'EVENT'}</span>
          </div>
        </div>

        {/* QR Code and Primary Attendee Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center my-6">
          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-white/20 shadow-md">
            <QRCodeSVG
              value={pass.qrData || `https://colorido2k26.rvrjc.ac.in/verify/${pass.registrationId}`}
              size={135}
              level="H"
              includeMargin={false}
            />
            <span className="mt-2 text-[10px] font-mono text-dark-900 font-semibold tracking-widest">
              SCAN TO VERIFY
            </span>
          </div>

          {/* Attendee Info */}
          <div className="sm:col-span-2 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <User className="w-3.5 h-3.5 text-brand-purple" />
                <span>Participant</span>
              </div>
              <p className="text-lg font-bold text-white tracking-wide">{pass.fullName}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Building className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Institution</span>
              </div>
              <p className="text-sm font-medium text-slate-200 line-clamp-1">{pass.college}</p>
              <p className="text-xs text-slate-400">{pass.department} • {pass.year}</p>
            </div>

            {pass.teamName && (
              <div>
                <span className="text-xs text-slate-400">Team Name</span>
                <p className="text-sm font-semibold text-amber-300">{pass.teamName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Event Details Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-purple" />
            <h4 className="text-base font-bold text-white">{event.title}</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
              <span>{event.demoDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{event.demoTime}</span>
            </div>
            <div className="sm:col-span-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Team Members List (if applicable) */}
        {teamMembersList.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs font-semibold text-slate-400 mb-2">Registered Team Members ({teamMembersList.length}):</p>
            <div className="flex flex-wrap gap-1.5">
              {teamMembersList.map((member, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] bg-white/5 border border-white/10 text-slate-300">
                  {member}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Security Watermark Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>STATUS: <strong className="text-emerald-400">{pass.status}</strong></span>
          <span>Security Code: <strong>{pass.registrationId.replace('COL26-', '#')}</strong></span>
        </div>
      </div>

      {/* Action Buttons: Print, Download, Share */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={handlePrint}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all shadow-md"
        >
          <Printer className="w-4 h-4 text-brand-purple" />
          <span>Print / Save PDF</span>
        </button>
        <button
          onClick={handleShare}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple border border-brand-purple/40 transition-all shadow-md"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Pass</span>
        </button>
      </div>
    </div>
  );
}

import React, { useRef } from 'react';
import { Share2, Printer, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, User, Building, Award, Users, KeyRound, Crown } from 'lucide-react';

export default function DigitalPass({ pass }) {
  const printRef = useRef(null);

  if (!pass) return null;

  const event = pass.event || {};

  // Extract participants list
  let participantList = [];
  if (Array.isArray(pass.participants) && pass.participants.length > 0) {
    participantList = pass.participants;
  } else if (pass.teamMembers) {
    try {
      const parsed = typeof pass.teamMembers === 'string' ? JSON.parse(pass.teamMembers) : pass.teamMembers;
      if (Array.isArray(parsed)) {
        participantList = parsed.map((m, idx) => ({
          name: typeof m === 'string' ? m : m.name,
          email: typeof m === 'object' ? m.email : null,
          isCaptain: false,
          order: idx + 1
        }));
      }
    } catch (e) {
      if (typeof pass.teamMembers === 'string') {
        participantList = pass.teamMembers.split(',').map((name, idx) => ({
          name: name.trim(),
          isCaptain: false,
          order: idx + 1
        })).filter(p => p.name);
      }
    }
  }

  // Determine captain
  const captain = participantList.find(p => p.isCaptain) || {
    name: pass.fullName,
    email: pass.email,
    phone: pass.phone,
    college: pass.college,
    isCaptain: true
  };

  const additionalMembers = participantList.filter(p => !p.isCaptain);
  const regType = (pass.participantType || event.registrationType || 'INDIVIDUAL').toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `COLORIDO 2K26 Official Entry Pass\nEvent: ${event.title || 'Festival Event'}\nRegistration ID: ${pass.registrationId}\nVerification Code: ${pass.verificationCode || 'VERIFIED'}\nCaptain: ${captain.name}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `COLORIDO 2K26 Pass - ${pass.registrationId}`,
          text,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Registration pass details copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Official Digital Entry Pass (Strictly No QR Code) */}
      <div
        ref={printRef}
        className="relative bg-gradient-to-b from-[#2C3E50] to-[#1A252F] border border-[#2980B9]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#2980B9]/15 overflow-hidden text-[#ECF0F1]"
      >
        {/* Holographic glowing background effect */}
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
              Verified Entry Pass
            </span>
          </div>
        </div>

        {/* Pass ID & Verification Code Banner */}
        <div className="my-5 p-4 rounded-2xl bg-[#1A252F]/80 border border-[#95A5A6]/20 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#95A5A6] block">
              Official Registration ID
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-[#E67E22]">
              {pass.registrationId}
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-[#95A5A6]/20 pt-3 sm:pt-0 sm:pl-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#95A5A6] block flex items-center sm:justify-end gap-1">
              <KeyRound className="w-3 h-3 text-[#2980B9]" />
              <span>Gate Verification Code</span>
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black tracking-widest text-[#ECF0F1] bg-[#2C3E50]/70 px-3 py-1 rounded-xl inline-block mt-1 border border-[#2980B9]/30">
              {pass.verificationCode || '849201'}
            </div>
          </div>
        </div>

        {/* Registration Type Badge & Team Name */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#2980B9]/20 text-[#3498DB] border border-[#2980B9]/40">
            <Users className="w-3.5 h-3.5" />
            <span>{regType} REGISTRATION</span>
          </div>
          {pass.teamName && (
            <div className="text-xs">
              <span className="text-[#95A5A6]">Team: </span>
              <span className="font-bold text-[#E67E22]">{pass.teamName}</span>
            </div>
          )}
        </div>

        {/* Captain & Participant Details */}
        <div className="p-4 rounded-2xl bg-[#1A252F]/70 border border-[#95A5A6]/20 space-y-3.5">
          {/* Captain / Team Leader Section */}
          <div className="border-b border-[#95A5A6]/20 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#E67E22] flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                <span>Captain / Team Leader</span>
              </span>
              <span className="text-[11px] font-mono text-[#95A5A6]">{captain.phone || pass.phone}</span>
            </div>
            <p className="text-base font-bold text-[#ECF0F1] mt-1">{captain.name}</p>
            <p className="text-xs text-[#BDC3C7]">{pass.college}</p>
            <p className="text-[11px] text-[#95A5A6]">{pass.department} • {pass.year} • {captain.email || pass.email}</p>
          </div>

          {/* Additional Team / Group Members */}
          {additionalMembers.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#95A5A6]">
                  Team Members ({additionalMembers.length})
                </span>
                <span className="text-[10px] text-[#95A5A6]">Total Squad: {1 + additionalMembers.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {additionalMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-[#2C3E50]/60 border border-[#95A5A6]/20 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1A252F] text-[10px] font-bold flex items-center justify-center text-[#95A5A6]">
                        {idx + 2}
                      </span>
                      <span className="font-semibold text-[#ECF0F1]">{member.name}</span>
                    </div>
                    {member.email && (
                      <span className="text-[10px] text-[#95A5A6] font-mono truncate max-w-[100px]">
                        {member.email}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Event Details Card */}
        <div className="mt-4 p-4 rounded-2xl bg-[#1A252F]/70 border border-[#95A5A6]/20 space-y-2.5">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#E67E22]" />
            <h4 className="text-base font-bold text-[#ECF0F1]">{event.title || 'Official Festival Competition'}</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#BDC3C7]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2980B9]" />
              <span>{event.date || 'October 15-17, 2026'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>{event.startTime || '10:00 AM'}</span>
            </div>
            <div className="sm:col-span-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#95A5A6]" />
              <span>{event.venue || 'R V R & J C Campus'}</span>
            </div>
          </div>
        </div>

        {/* Security Watermark Footer */}
        <div className="mt-5 pt-3 border-t border-[#95A5A6]/20 flex items-center justify-between text-[11px] text-[#95A5A6]">
          <span>STATUS: <strong className="text-emerald-400">{pass.status || 'CONFIRMED'}</strong></span>
          <span>Check-in: <strong className={pass.checkedIn ? 'text-emerald-400' : 'text-[#E67E22]'}>{pass.checkedIn ? 'CHECKED IN' : 'READY AT GATE'}</strong></span>
        </div>
      </div>

      {/* Action Buttons: Print, Download, Share */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={handlePrint}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[#34495E] hover:bg-[#2C3E50] text-[#ECF0F1] border border-[#95A5A6]/30 transition-all shadow-md"
        >
          <Printer className="w-4 h-4 text-[#2980B9]" />
          <span>Print / Save Pass (PDF)</span>
        </button>
        <button
          onClick={handleShare}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[#2980B9]/20 hover:bg-[#2980B9]/30 text-[#2980B9] border border-[#2980B9]/40 transition-all shadow-md"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Pass Details</span>
        </button>
      </div>
    </div>
  );
}

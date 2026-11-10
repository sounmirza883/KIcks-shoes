'use client';

import React from 'react';
import {
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  Flame,
  Search,
} from 'lucide-react';
import { useStore } from '../components/StoreProvider.tsx';

export const AboutPage: React.FC = () => {
  const { navigate } = useStore();
  const onNavigateToShop = () => navigate('shop');
  const onNavigateToContact = () => navigate('contact');

  const authenticationSteps = [
    {
      step: '01',
      title: 'UV Blacklight Inspection',
      desc: 'High-intensity ultraviolet scans reveal factory ink stamps, invisible glue stains, and stitch glow inconsistencies.',
    },
    {
      step: '02',
      title: 'Stitch-per-Inch Calibration',
      desc: 'Precision micro-metric gauges measure stitch density, curvature angles, and thread tension against OEM blueprints.',
    },
    {
      step: '03',
      title: 'Strobel Board & Insole Audit',
      desc: 'Inspecting under the insole to confirm authentic strobel threading, tape alignment, and footbed date stamps.',
    },
    {
      step: '04',
      title: 'Weight & Density Matching',
      desc: 'Pairs are weighed down to the gram to detect lightweight fake polyurethane and density mismatches in the sole.',
    },
    {
      step: '05',
      title: 'Box Label & RFID Verification',
      desc: 'Font kerning, barcode spacing, and embedded RFID/NFC chips are scanned directly against manufacturer registry databases.',
    },
    {
      step: '06',
      title: 'Air Unit & Cushion Rigidity',
      desc: 'Compressive pressure gauges test visible Air-Sole and Zoom chambers for factory PSI specifications.',
    },
    {
      step: '07',
      title: 'Chemical Scent & Glue Profiling',
      desc: 'Authentic solvent profiles differentiate OEM industrial adhesive smells from hazardous counterfeit synthetic glues.',
    },
    {
      step: '08',
      title: 'Pantone Color Accuracy',
      desc: 'Spectrophotometer scans check leather dye pigmentation, suede nap direction, and contrast stitching color fidelity.',
    },
    {
      step: '09',
      title: 'Hardware & Eyelet Integrity',
      desc: 'Molded plastic waffle wings, metallic eyelets, and aglets undergo tension testing for authentic grade alloys.',
    },
    {
      step: '10',
      title: 'KICKS Tamper-Evident NFC Tag',
      desc: 'Once approved, a numbered holographic NFC tag is affixed to the left shoe, linking directly to its digital inspection cert.',
    },
  ];

  const milestones = [
    {
      year: '2018',
      title: 'Founded in Underground Pop-ups',
      desc: 'KICKS began as a boutique exchange in New York and London, helping collectors source verified grails without counterfeit fear.',
    },
    {
      year: '2020',
      title: 'First Physical Verification Lab',
      desc: 'Opened our flagship authentication facility equipped with ultraviolet spectral cameras and tensile testing benches.',
    },
    {
      year: '2022',
      title: 'SoHo Flagship Store Opening',
      desc: 'Debuted our 3-story concept space on Broadway in New York City, blending sneaker archives with community events.',
    },
    {
      year: '2024',
      title: 'Global Drop Space in Tokyo',
      desc: 'Expanded into Shibuya, Tokyo, bridging Asian streetwear culture with exclusive archival retro drops.',
    },
    {
      year: '2026',
      title: 'Over 100,000 Verified Pairs',
      desc: 'A thriving global collective of sneakerheads, athletes, and artists who trust KICKS for authentic footwear.',
    },
  ];

  const team = [
    {
      name: 'Marcus Vance',
      role: 'Founder & Head of Curation',
      bio: 'Lifelong sneaker collector with over 18 years in footwear design and street culture archiving.',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dr. Elena Rostova',
      role: 'Chief of Authentication & Materials',
      bio: 'Polymer materials engineer specializing in footwear diagnostics, textile analysis, and counterfeit detection.',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Kenji Takahashi',
      role: 'Creative Director & Drop Curator',
      bio: 'Former Tokyo footwear designer bringing rare retro grails and modern technical runners to the global community.',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-neutral-900">
      
      {/* Hero Banner */}
      <section className="bg-[#111111] text-white py-16 sm:py-24 border-b border-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&auto=format&fit=crop&q=80')`
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-3">
              ABOUT KICKS. OFFICIAL
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-none mb-6">
              MORE THAN SNEAKERS.<br />
              <span className="text-neutral-400">A GLOBAL CULTURE.</span>
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-8">
              We believe sneakers are more than just footwear — they are a lifestyle, a statement of identity, and an art form. Founded on the principle that every collector deserves access to genuine grails, KICKS bridges historic hardwood heritage with the future of streetwear.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={onNavigateToShop}
                className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>Shop Verified Vault</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateToContact}
                className="inline-flex items-center gap-2 bg-neutral-800 text-white hover:bg-neutral-700 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>Get In Touch</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars / Core Commitments */}
      <section className="py-16 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase block mb-2">
              OUR STANDARDS
            </span>
            <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">
              THE 4 PILLARS OF KICKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                100% Authentic Guarantee
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every single shoe undergoes physical evaluation by verified authenticators before leaving our facility. If it isn't genuine, it never ships.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                Handpicked Drops
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Zero clutter. We curate only the most culturally significant silhouettes, high-demand collaborations, and timeless everyday staples.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                Fair Street Pricing
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Transparent market values without unfair hidden checkout fees. What you see is what you pay, paired with authentic customer care.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                Double-Boxed Express
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                All kicks are encased in reinforced outer boxes with moisture guards to ensure shoe boxes arrive in pristine, mint condition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 10-Step Authentication Lab Section */}
      <section className="py-16 bg-[#F8F9FA] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-neutral-500 uppercase block mb-1">
              INSIDE THE LAB
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 uppercase tracking-tight">
              OUR 10-STEP AUTHENTICATION PROTOCOL
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base mt-2">
              Counterfeits are becoming more sophisticated every month. That’s why our testing lab blends industrial scientific diagnostic tools with veteran human appraisal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {authenticationSteps.map((item) => (
              <div
                key={item.step}
                className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-black text-neutral-400 block mb-2">
                    PHASE {item.step}
                  </span>
                  <h4 className="text-sm font-bold text-neutral-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Standard</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones / History */}
      <section className="py-16 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase block mb-1">
              OUR JOURNEY
            </span>
            <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">
              HOW KICKS GREW
            </h2>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {milestones.map((m, idx) => (
              <div
                key={m.year}
                className="flex items-start gap-6 p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-black transition-colors"
              >
                <span className="text-2xl font-black font-mono text-neutral-900 shrink-0">
                  {m.year}
                </span>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1">
                    {m.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership / Curators */}
      <section className="py-16 bg-[#F8F9FA] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase block mb-1">
              THE TEAM
            </span>
            <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">
              MEET THE CURATORS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-3xl p-6 border border-neutral-200 text-center shadow-xs"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-neutral-100"
                />
                <h3 className="text-base font-bold text-neutral-900">
                  {member.name}
                </h3>
                <span className="text-xs font-semibold text-neutral-500 block mb-3">
                  {member.role}
                </span>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="py-16 bg-neutral-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
            READY TO STEP INTO SOMETHING REAL?
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mb-8">
            Explore our curated vault of authenticated models, backed by our 100% money-back verification pledge.
          </p>
          <button
            onClick={onNavigateToShop}
            className="bg-white hover:bg-neutral-200 text-black px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:shadow-xl cursor-pointer"
          >
            Explore The Store
          </button>
        </div>
      </section>

    </div>
  );
};

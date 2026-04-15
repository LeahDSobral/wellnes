import React from 'react';
import { motion } from 'framer-motion';
import SectionLabel from './SectionLabel';
import SectionHeading from './SectionHeading';
import ProcessMap from './ProcessMap';
import Takeaway from './Takeaway';

// ─── shared primitives ────────────────────────────────────────────────────────
const ACCENT = '#4fc3f7';
const DIM = '#6a85b0';
const TEXT = '#ccd6f6';
const BORDER = '#0d1b2e';
const CARD = '#080e1a';

function StageHeader({ number, label, title }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: ACCENT, marginBottom: '0.5rem' }}>
        Stage {number}&nbsp;&nbsp;{label}
      </p>
      <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 400, color: TEXT }}>
        {title}
      </h3>
    </div>
  );
}

function InfoCard({ icon, title, bullets, accent }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {icon && <div style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>{icon}</div>}
      {title && <p style={{ fontSize: '0.78rem', fontWeight: 700, color: accent || ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</p>}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: DIM, lineHeight: 1.5 }}>
            <span style={{ color: accent || ACCENT, flexShrink: 0, marginTop: '0.05rem' }}>›</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatPill({ value, label }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '0.75rem 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.4rem', color: '#64b5f6', fontWeight: 400 }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: DIM, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '0.2rem' }}>{label}</div>
    </div>
  );
}

function CardGrid({ children, cols = 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1px', background: BORDER }} className="pipeline-grid">
      {children}
      <style>{`
        @media (max-width: 900px) { .pipeline-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .pipeline-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function StageBlock({ number, label, title, takeaway, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      style={{ marginBottom: '4rem' }}
    >
      <StageHeader number={number} label={label} title={title} />
      {children}
      {takeaway && <Takeaway>{takeaway}</Takeaway>}
    </motion.div>
  );
}

// ─── specialties table ────────────────────────────────────────────────────────
const specialties = [
  { code: 'HALO',    name: 'High-Acuity Low-Frequency',  count: 8 },
  { code: 'NEURO',   name: 'Neurocritical Care',          count: 8 },
  { code: 'CARDIAC', name: 'Cardiac ICU',                 count: 8 },
  { code: 'RESP',    name: 'Respiratory ICU',             count: 8 },
  { code: 'TRAUMA',  name: 'Trauma & Surgical ICU',       count: 8 },
  { code: 'OB',      name: 'Maternal & Obstetric ICU',    count: 8 },
];

// ─── Stage 4 augmentation layers ─────────────────────────────────────────────
const augLayers = [
  { num: '01', name: 'Room Acoustics',         detail: 'RIR via pyroomacoustics · random room dims & mic pos' },
  { num: '02', name: 'Speaker Distance',       detail: '40% of cases · gain shift + LPF rolloff' },
  { num: '03', name: 'ICU Noise Mix',          detail: 'Ventilator hum · monitor beeps · PA · speech noise' },
  { num: '04', name: 'Disfluency Augment',     detail: '25% of cases · time-stretch or speed-compress' },
  { num: '05', name: 'iPhone Mic Sim',         detail: 'Biquad EQ + optional codec artifacts' },
];

// ─── Main export ──────────────────────────────────────────────────────────────
export default function PipelineSection() {
  return (
    <section id="pipeline" className="px-6 md:px-12 lg:px-32 py-24" style={{ borderTop: `1px solid ${BORDER}` }}>
      <SectionLabel>The Data Pipeline</SectionLabel>
      <SectionHeading>From blank prompt to fine-tuning manifest in five automated stages</SectionHeading>

      <p style={{ fontSize: '0.88rem', color: DIM, lineHeight: 1.7, maxWidth: '740px', marginBottom: '3rem' }}>
        No real patient audio was used. A fully synthetic factory — medically accurate scripts,
        multi-speaker TTS, and programmatic ICU noise — produces NeMo-format manifests ready for
        Parakeet ASR fine-tuning. Progress is tracked in <em style={{ color: TEXT }}>run_state.json</em> for
        batch restarts without duplicate work.
      </p>

      {/* Process Map */}
      <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: ACCENT, marginBottom: '1.2rem' }}>Process Map</p>
      <h3 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: TEXT, fontWeight: 400, marginBottom: '2rem' }}>
        End-to-end flowchart — standard process map symbols
      </h3>
      <ProcessMap />

      {/* ── STAGE 1 ── */}
      <StageBlock
        number="01" label="stage1_blueprints.py"
        title="Two-Pass LLM Blueprint Generation"
        takeaway="Separating clinical facts (Pass 1) from clinical reasoning (Pass 2) produces internally consistent blueprints where vitals, labs, and deterioration arc all agree. Retry logic self-heals on transient JSON failures."
      >
        <CardGrid cols={3}>
          <InfoCard title="Pass 1 — Patient Profile" bullets={[
            'Age, sex, weight, height',
            'Presenting vitals (BP, HR, SpO₂, GCS, temp)',
            'PMH · medications · labs · imaging',
          ]} />
          <InfoCard title="Pass 2 — Simulation Logic" bullets={[
            'Deterioration arc · 4+ time points over 30 min',
            'Intervention sequence · 5+ steps',
            '8+ seed dialogue cues',
            'Expected learner errors & debriefing points',
            'Fidelity markers (boolean flags)',
          ]} />
          <InfoCard title="Quality Control" bullets={[
            'JSON validation after every merge',
            'Pass 2 retries on failure (max_retries)',
            'Written to blueprints/CASE_ID.json',
            'Case marked done in progress tracker',
          ]} accent="#1D9E75" />
        </CardGrid>

        {/* Specialties grid */}
        <p style={{ fontSize: '0.72rem', color: TEXT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2rem', marginBottom: '0.8rem' }}>
          6 Specialties · 8 Scenarios Each · 48 Total Cases
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: BORDER }} className="spec-grid">
          {specialties.map(s => (
            <div key={s.code} style={{ background: CARD, padding: '0.9rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
              <span style={{ color: ACCENT, fontSize: '0.78rem', fontWeight: 700, minWidth: '56px' }}>{s.code}</span>
              <span style={{ color: DIM, fontSize: '0.78rem' }}>{s.name}</span>
            </div>
          ))}
          <style>{`
            @media (max-width: 700px) { .spec-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </div>
      </StageBlock>

      {/* ── STAGE 2 ── */}
      <StageBlock
        number="02" label="stage2_scripts.py"
        title="60+ Line Clinical Dialogue Scripts with Disfluency Control"
        takeaway="Disfluency stratification is deliberate — real ICU recordings contain heavy disfluency under pressure. Training on a controlled mix prepares the model for realistic clinical conditions, not only idealized speech."
      >
        <CardGrid cols={3}>
          <InfoCard title="Speaker Roles & Word Caps" bullets={[
            'ATTENDING / CHARGE_NURSE — 12 words (clipped)',
            'NURSE / RT — 15 words (observation)',
            'FELLOW / PHARMACIST — 18 words (reasoning)',
            'RESIDENT — 20 words (learning conciseness)',
          ]} />
          <InfoCard title="Required Script Elements" bullets={[
            '≥ 3 speaker interruptions',
            '≥ 2 spoken confirmations ("Did you say…?")',
            '≥ 1 cross-room call',
            'Clinical shorthand: sat · pressors · lytes · trop',
          ]} />
          <InfoCard title="Disfluency Distribution" bullets={[
            '40% Clean — fluent, no hesitations',
            '35% Mild — 2–3 hesitations, 1 correction',
            '20% Moderate — 4–5 hesitations, 2 corrections',
            '5% Heavy — 6+ hesitations, truncated sentences',
          ]} accent="#e67e22" />
        </CardGrid>
      </StageBlock>

      {/* ── STAGE 3 ── */}
      <StageBlock
        number="03" label="stage3_audio.py"
        title="Multi-Speaker TTS — Magpie-TTS (NeMo, 357M Parameters)"
        takeaway="Distinct voices per speaker role create realistic multi-talker audio. The silence gap strategy mimics real clinical turn-taking and provides the ASR model with natural acoustic boundaries between speakers."
      >
        <CardGrid cols={4}>
          <StatPill value="357M" label="Model Parameters" />
          <StatPill value="5" label="Distinct Voices" />
          <StatPill value="16 kHz" label="Output Sample Rate" />
          <StatPill value="0.2 / 0.5s" label="Silence Gaps (same / diff speaker)" />
        </CardGrid>

        <div style={{ marginTop: '1px' }}>
          <CardGrid cols={2}>
            <InfoCard title="Voice Assignment" bullets={[
              'Voices 0–4 shuffled per case via MD5 seed',
              'ATTENDING · FELLOW · RESIDENT · NURSE · RT each get a unique voice',
              'PHARMACIST shares FELLOW · CHARGE_NURSE shares NURSE',
            ]} />
            <InfoCard title="Text Normalisation Pipeline" bullets={[
              'Numbers → words via num2words',
              '"180/110" → "one hundred and eighty over one hundred and ten"',
              '"4mg/kg/min" → "four milligrams per kilo per minute"',
              'Abbreviation table: PEEP · SpO₂ · MAP · CRRT · SOFA · G2P1',
              'Resampled 22050 Hz → 16 kHz via librosa',
            ]} />
          </CardGrid>
        </div>
      </StageBlock>

      {/* ── STAGE 4 ── */}
      <StageBlock
        number="04" label="stage4_augment.py"
        title="Five-Layer ICU Noise Simulation for Smartphone Recordings"
        takeaway="Each layer models a specific physical phenomenon in real ICU recordings — making augmented data acoustically representative rather than merely statistically perturbed."
      >
        <div style={{ display: 'grid', gap: '1px', background: BORDER }}>
          {augLayers.map(layer => (
            <div key={layer.num} style={{ background: CARD, display: 'grid', gridTemplateColumns: '40px 160px 1fr', gap: '1rem', padding: '0.85rem 1.25rem', alignItems: 'center' }}>
              <span style={{ color: ACCENT, fontSize: '0.85rem', fontWeight: 700 }}>{layer.num}</span>
              <span style={{ color: TEXT, fontSize: '0.82rem', fontWeight: 700 }}>{layer.name}</span>
              <span style={{ color: DIM, fontSize: '0.8rem' }}>{layer.detail}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1px' }}>
          <CardGrid cols={3}>
            <InfoCard title="Overlap Speech" bullets={[
              '20% of cases receive cross-talk from a random other case',
              'Mixed at lower SNR — simulates adjacent bay',
            ]} accent="#9b59b6" />
            <InfoCard title="Difficulty Classification" bullets={[
              'Hard → SNR < 12 dB, or disfluency + overlap combined',
              'Medium → SNR ≤ 18 dB, or either disfluency or overlap alone',
            ]} accent="#e67e22" />
            <InfoCard title="Reproducibility" bullets={[
              'All augmentation decisions seeded via MD5(case_id)',
              'float32 · 16 kHz mono throughout',
              'Fully deterministic — identical output every run',
            ]} accent="#1D9E75" />
          </CardGrid>
        </div>
      </StageBlock>

      {/* ── STAGE 5 ── */}
      <StageBlock
        number="05" label="stage5_manifests.py"
        title="NeMo-Format JSONL Manifests for Parakeet Fine-Tuning"
        takeaway="The 90/5/5 split with audio-tier stratification ensures validation and evaluation on acoustically harder conditions than the clean training baseline — preventing overfitting to ideal-quality audio."
      >
        <CardGrid cols={2}>
          <InfoCard title="Train / Val / Eval Split" bullets={[
            '90% Training — clean + medium + hard (3× per case)',
            '5% Validation — medium audio only',
            '5% Evaluation — hard audio only',
            'Split assigned via MD5 hash mod 100',
          ]} />
          <InfoCard title="Each Manifest Entry" bullets={[
            'audio_filepath · duration · text',
            'case_id · audio_type · difficulty',
            'category (CARDIAC / HALO / NEURO / OB / RESP / TRAUMA)',
          ]} />
        </CardGrid>
        <div style={{ marginTop: '1px' }}>
          <InfoCard title="GO / NO-GO Check" bullets={[
            '✓ PASS — training hours ≥ 15',
            '⚠ WARN — 8–15 hours',
            '✗ ABORT — below 8 hours',
            'summary.json written to manifests/',
          ]} accent="#1D9E75" />
        </div>

        <div style={{ marginTop: '1px' }}>
          <InfoCard title="Transcript Cleaning Rules" bullets={[
            'Strip leading line numbers & speaker tags',
            'Discard NARRATOR lines entirely',
            'Em dashes → commas · % → "percent" · / → "per"',
            'Angle brackets → "less than" / "greater than"',
          ]} />
        </div>
      </StageBlock>
    </section>
  );
}
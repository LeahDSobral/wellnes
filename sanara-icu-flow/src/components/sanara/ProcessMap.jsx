import React from 'react';

const ACCENT = '#4fc3f7';
const STROKE = '#1565c0';
const TEXT = '#ccd6f6';
const DIM = '#6a85b0';
const WARN = '#e67e22';
const GO = '#1D9E75';

// ── Node dimensions ───────────────────────────────────────────────────────────
const NW = 170;   // node width
const NH = 52;    // node height
const COL_W = 210; // column width (includes gap)
const ROW_GAP = 24; // vertical gap between nodes

// ── Shape paths ───────────────────────────────────────────────────────────────
function nodeShape(type, x, y, w, h) {
  switch (type) {
    case 'terminator':
      return `M${x + h / 2},${y} H${x + w - h / 2} A${h / 2},${h / 2} 0 0 1 ${x + w - h / 2},${y + h} H${x + h / 2} A${h / 2},${h / 2} 0 0 1 ${x + h / 2},${y} Z`;
    case 'decision': {
      const mx = x + w / 2, my = y + h / 2;
      return `M${mx},${y} L${x + w},${my} L${mx},${y + h} L${x},${my} Z`;
    }
    case 'data':
      return `M${x + 14},${y} H${x + w} L${x + w - 14},${y + h} H${x} Z`;
    case 'document': {
      const wave = h * 0.25;
      return `M${x},${y} H${x + w} V${y + h - wave} Q${x + w * 0.75},${y + h + wave * 0.4} ${x + w / 2},${y + h - wave} Q${x + w * 0.25},${y + h - wave * 1.8} ${x},${y + h - wave} Z`;
    }
    default: // process rectangle
      return `M${x + 3},${y} H${x + w - 3} Q${x + w},${y} ${x + w},${y + 3} V${y + h - 3} Q${x + w},${y + h} ${x + w - 3},${y + h} H${x + 3} Q${x},${y + h} ${x},${y + h - 3} V${y + 3} Q${x},${y} ${x + 3},${y} Z`;
  }
}

// ── Columns definition ────────────────────────────────────────────────────────
// Each column = one pipeline stage. Each node = { type, label, sub, color }
const columns = [
  {
    stage: 'START',
    color: ACCENT,
    nodes: [
      { type: 'terminator', label: 'START', sub: '48 cases × 6 specialties', color: ACCENT },
    ],
  },
  {
    stage: 'STAGE 01',
    label: 'Blueprint Generator',
    color: STROKE,
    nodes: [
      { type: 'process',  label: 'LLM Pass 1', sub: 'Patient profile JSON', color: STROKE },
      { type: 'process',  label: 'LLM Pass 2', sub: 'Deterioration arc + cues', color: STROKE },
      { type: 'decision', label: 'JSON valid?', sub: null, color: STROKE },
      { type: 'document', label: 'blueprints/CASE_ID.json', sub: 'Progress tracker updated', color: STROKE },
    ],
    retry: 'Retry Pass 2',
  },
  {
    stage: 'STAGE 02',
    label: 'Script Generator',
    color: STROKE,
    nodes: [
      { type: 'process',  label: '65-line ICU Dialogue', sub: '7 speaker roles', color: STROKE },
      { type: 'data',     label: 'Disfluency Assignment', sub: 'MD5 → clean/mild/mod/heavy', color: STROKE },
      { type: 'decision', label: '≥ 55 tagged lines?', sub: null, color: STROKE },
      { type: 'document', label: 'scripts/CASE_ID.txt', sub: '+ metadata JSON', color: STROKE },
    ],
    retry: 'Re-prompt with correction',
  },
  {
    stage: 'STAGE 03',
    label: 'Audio Synthesis',
    color: STROKE,
    nodes: [
      { type: 'process',  label: 'Text Normalisation', sub: 'num2words · abbrev expansion', color: STROKE },
      { type: 'process',  label: 'Magpie-TTS (357M)', sub: '5 voices · 22050 Hz', color: STROKE },
      { type: 'process',  label: 'Resample + Concat', sub: '22050 → 16 kHz · silence gaps', color: STROKE },
      { type: 'document', label: 'audio/CASE_ID.wav', sub: '16 kHz mono PCM-16', color: STROKE },
    ],
  },
  {
    stage: 'STAGE 04',
    label: 'Acoustic Augmentation',
    color: STROKE,
    nodes: [
      { type: 'process', label: 'Layer 1 · Room Acoustics', sub: 'pyroomacoustics RIR', color: STROKE },
      { type: 'process', label: 'Layer 2 · Speaker Distance', sub: 'Gain + LPF (40% cases)', color: STROKE },
      { type: 'process', label: 'Layer 3 · ICU Noise Mix', sub: 'Ventilator · beeps · speech', color: STROKE },
      { type: 'process', label: 'Layer 4 · Disfluency Aug', sub: 'Time-stretch / speed-compress (25%)', color: STROKE },
      { type: 'process', label: 'Layer 5 · iPhone Mic Sim', sub: 'Biquad EQ + codec artifacts', color: STROKE },
      { type: 'data',    label: 'Classify Difficulty', sub: 'SNR thresholds → med / hard', color: STROKE },
      { type: 'document',label: 'CASE_ID_med.wav + hard.wav', sub: 'MD5-seeded reproducible', color: STROKE },
    ],
  },
  {
    stage: 'STAGE 05',
    label: 'Manifest Builder',
    color: STROKE,
    nodes: [
      { type: 'data',     label: '90/5/5 Split', sub: 'MD5 hash mod 100', color: STROKE },
      { type: 'process',  label: 'Build JSONL Entries', sub: 'filepath · duration · text · category', color: STROKE },
      { type: 'process',  label: 'Transcript Cleaning', sub: 'Strip tags · normalise punctuation', color: STROKE },
      { type: 'decision', label: 'Training hrs ≥ 15?', sub: 'GO / NO-GO', color: STROKE },
      { type: 'document', label: 'train / val / eval .jsonl', sub: '+ manifests/summary.json', color: STROKE },
    ],
    retry: 'WARN / ABORT: generate more cases',
    retryColor: WARN,
  },
  {
    stage: 'END',
    color: GO,
    nodes: [
      { type: 'process',   label: 'Parakeet ASR Fine-Tuning', sub: 'NeMo-format manifests ready', color: GO },
      { type: 'terminator',label: 'END', sub: 'Dataset delivered', color: GO },
    ],
  },
];

// ── Legend items ──────────────────────────────────────────────────────────────
const legendItems = [
  { type: 'terminator', label: 'Start / End' },
  { type: 'process',    label: 'Process' },
  { type: 'decision',   label: 'Decision' },
  { type: 'document',   label: 'Output file' },
  { type: 'data',       label: 'Data / Assignment' },
];

function LegendItem({ type, label }) {
  const w = 52, h = 28;
  const path = nodeShape(type, 1, 1, w - 2, h - 2);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <svg width={w} height={h}>
        <path d={path} fill="#080e1a" stroke={ACCENT} strokeWidth="1.5" />
      </svg>
      <span style={{ fontSize: '0.7rem', color: DIM, fontFamily: "'Courier New', monospace" }}>{label}</span>
    </div>
  );
}

// ── Main SVG chart ────────────────────────────────────────────────────────────
export default function ProcessMap() {
  // Calculate total SVG dimensions
  const maxNodes = Math.max(...columns.map(c => c.nodes.length));
  const totalH = maxNodes * (NH + ROW_GAP) + 120; // extra for stage labels + padding
  const totalW = columns.length * COL_W + 40;

  // Pre-compute node centres — vertically centre each column around the tallest column
  const colHeights = columns.map(col => col.nodes.length * NH + (col.nodes.length - 1) * ROW_GAP);
  const maxColH = Math.max(...colHeights);
  const colNodeCentres = columns.map((col, ci) => {
    const cx = 20 + ci * COL_W + NW / 2;
    const colH = colHeights[ci];
    const offsetY = 56 + (maxColH - colH) / 2; // centre shorter columns vertically
    return col.nodes.map((n, ni) => ({
      x: 20 + ci * COL_W,
      y: offsetY + ni * (NH + ROW_GAP),
      cx,
      cy: offsetY + ni * (NH + ROW_GAP) + NH / 2,
    }));
  });

  return (
    <div>
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', padding: '1rem 1.5rem', background: '#080e1a', border: '1px solid #0d1b2e' }}>
        <span style={{ fontSize: '0.68rem', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.2em', alignSelf: 'center' }}>Legend</span>
        {legendItems.map(item => <LegendItem key={item.type} {...item} />)}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="40" height="16"><line x1="0" y1="8" x2="32" y2="8" stroke={WARN} strokeWidth="1.5" strokeDasharray="4,3"/><polygon points="40,8 30,4 30,12" fill={WARN}/></svg>
          <span style={{ fontSize: '0.7rem', color: DIM, fontFamily: "'Courier New', monospace" }}>Retry / fail path</span>
        </div>
      </div>

      {/* Chart — horizontally scrollable */}
      <div style={{ overflowX: 'auto', background: '#080e1a', border: '1px solid #0d1b2e', padding: '1.5rem 1rem' }}>
        <svg width={totalW} height={totalH} style={{ display: 'block' }}>
          {columns.map((col, ci) => {
            const centres = colNodeCentres[ci];
            const stageX = 20 + ci * COL_W;

            return (
              <g key={ci}>
                {/* Stage header label */}
                <text x={stageX + NW / 2} y={20} textAnchor="middle"
                  fill={col.color} fontSize="9" fontFamily="'Courier New', monospace"
                  fontWeight="700" letterSpacing="2">
                  {col.stage}
                </text>
                {col.label && (
                  <text x={stageX + NW / 2} y={34} textAnchor="middle"
                    fill={DIM} fontSize="8" fontFamily="'Courier New', monospace">
                    {col.label}
                  </text>
                )}

                {/* Nodes */}
                {col.nodes.map((node, ni) => {
                  const { x, y, cx, cy } = centres[ni];
                  const strokeColor = node.color || STROKE;
                  const path = nodeShape(node.type, x, y, NW, NH);
                  const isDecision = node.type === 'decision';
                  const textY = isDecision ? cy - 7 : cy - 7;

                  return (
                    <g key={ni}>
                      <path d={path} fill="#04080f" stroke={strokeColor} strokeWidth="1.5" />
                      <text
                        x={cx} y={isDecision ? cy - (node.sub ? 7 : 0) : cy - (node.sub ? 7 : 0)}
                        textAnchor="middle" dominantBaseline="middle"
                        fill={strokeColor === ACCENT || strokeColor === GO ? strokeColor : TEXT}
                        fontSize="9.5" fontFamily="'Courier New', monospace" fontWeight="700">
                        {node.label}
                      </text>
                      {node.sub && (
                        <text x={cx} y={cy + 9} textAnchor="middle" dominantBaseline="middle"
                          fill={DIM} fontSize="8" fontFamily="'Courier New', monospace">
                          {node.sub}
                        </text>
                      )}

                      {/* Vertical connector to next node in same column */}
                      {ni < col.nodes.length - 1 && (
                        <g>
                          <line x1={cx} y1={y + NH} x2={cx} y2={y + NH + ROW_GAP}
                            stroke={strokeColor} strokeWidth="1.2" />
                          <polygon
                            points={`${cx},${y + NH + ROW_GAP} ${cx - 4},${y + NH + ROW_GAP - 8} ${cx + 4},${y + NH + ROW_GAP - 8}`}
                            fill={strokeColor} />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Horizontal connector from last node of this col to first node of next col */}
                {ci < columns.length - 1 && (() => {
                  const fromC = centres[col.nodes.length - 1];
                  const toC = colNodeCentres[ci + 1][0];
                  const fromRight = fromC.x + NW;
                  const toLeft = toC.x;
                  const fromMidY = fromC.cy;
                  const toMidY = toC.cy;
                  // If same row: straight horizontal. Otherwise: elbow.
                  if (Math.abs(fromMidY - toMidY) < 4) {
                    return (
                      <g>
                        <line x1={fromRight} y1={fromMidY} x2={toLeft - 6} y2={toMidY} stroke={STROKE} strokeWidth="1.2" />
                        <polygon points={`${toLeft},${toMidY} ${toLeft - 8},${toMidY - 4} ${toLeft - 8},${toMidY + 4}`} fill={STROKE} />
                      </g>
                    );
                  }
                  // Elbow connector
                  const midX = fromRight + (toLeft - fromRight) / 2;
                  return (
                    <g>
                      <path d={`M${fromRight},${fromMidY} H${midX} V${toMidY} H${toLeft - 6}`}
                        fill="none" stroke={STROKE} strokeWidth="1.2" />
                      <polygon points={`${toLeft},${toMidY} ${toLeft - 8},${toMidY - 4} ${toLeft - 8},${toMidY + 4}`} fill={STROKE} />
                    </g>
                  );
                })()}

                {/* Retry loop — dashed arc back up within the column */}
                {col.retry && (() => {
                  const decisionIdx = col.nodes.findIndex(n => n.type === 'decision');
                  if (decisionIdx < 0) return null;
                  const dec = centres[decisionIdx];
                  const firstNode = centres[0];
                  const loopX = dec.x - 18;
                  const retryColor = col.retryColor || WARN;
                  return (
                    <g>
                      <path
                        d={`M${dec.x},${dec.y + NH} V${dec.y + NH + 10} H${loopX} V${firstNode.y + NH / 2} H${firstNode.x}`}
                        fill="none" stroke={retryColor} strokeWidth="1.2" strokeDasharray="4,3" />
                      <polygon points={`${firstNode.x},${firstNode.cy} ${firstNode.x + 8},${firstNode.cy - 4} ${firstNode.x + 8},${firstNode.cy + 4}`} fill={retryColor} />
                      <text x={loopX - 2} y={(dec.y + NH + firstNode.y + NH / 2) / 2}
                        textAnchor="end" fill={retryColor} fontSize="7.5"
                        fontFamily="'Courier New', monospace"
                        transform={`rotate(-90, ${loopX - 2}, ${(dec.y + NH + firstNode.y + NH / 2) / 2})`}>
                        {col.retry}
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
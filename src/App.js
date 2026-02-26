import React, { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, ComposedChart, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
//  📊 DATA — extraída del PDF Merchant Satisfaction Jan 2026
// ═══════════════════════════════════════════════════════════════════════════

// ── 1. Monthly Sentiment Trend (Global / NAM / INT) ──────────────────────
const MONTHLY_SENTIMENT = {
  Global: [
    { month:"25' May", Bad:	48.28	, Good:	20.69	, Neutral:	31.03	, Responses:	29	},
    { month:"25' June", Bad:	43.10	, Good:	31.03	, Neutral:	25.86	, Responses:	174	},
    { month:"25' July", Bad:	43.81	, Good:	27.14	, Neutral:	29.05	, Responses:	210	},
    { month:"25' August", Bad:	41.20	, Good:	31.46	, Neutral:	27.34	, Responses:	267	},
    { month:"25' September", Bad:	37.69	, Good:	31.72	, Neutral:	30.60	, Responses:	268	},
    { month:"25' October", Bad:	41.46	, Good:	34.15	, Neutral:	24.39	, Responses:	246	},
    { month:"25' November", Bad:	41.73	, Good:	33.46	, Neutral:	24.80	, Responses:	254	},
    { month:"25' December", Bad:	39.62	, Good:	30.38	, Neutral:	30.00	, Responses:	260	},
    { month:"26' January", Bad:	37.58	, Good:	31.21	, Neutral:	31.21	, Responses:	298	},
    { month:"26' February", Bad:	30.00	, Good:	40.00	, Neutral:	30.00	, Responses:	20	},
  ],
  NAM: [
    { month:"	25' May	", Bad:	42.86	, Good:	23.81	, Neutral:	33.33	, Responses:	21	},
    { month:"	25' June	", Bad:	49.11	, Good:	26.79	, Neutral:	24.11	, Responses:	112	},
    { month:"	25' July	", Bad:	44.14	, Good:	24.32	, Neutral:	31.53	, Responses:	111	},
    { month:"	25' August	", Bad:	45.27	, Good:	28.38	, Neutral:	26.35	, Responses:	148	},
    { month:"	25' September	", Bad:	45.39	, Good:	31.21	, Neutral:	23.40	, Responses:	141	},
    { month:"	25' October	", Bad:	46.62	, Good:	30.83	, Neutral:	22.56	, Responses:	133	},
    { month:"	25' November	", Bad:	43.26	, Good:	29.79	, Neutral:	26.95	, Responses:	141	},
    { month:"	25' December	", Bad:	47.45	, Good:	21.90	, Neutral:	30.66	, Responses:	137	},
    { month:"	26' January	", Bad:	41.61	, Good:	26.71	, Neutral:	31.68	, Responses:	161	},
    { month:"	26' February	", Bad:	36.36	, Good:	54.55	, Neutral:	9.09	, Responses:	11	},
  ],
  INT: [
    { month:"	25' May	", Bad:	62.50	, Good:	12.50	, Neutral:	25.00	, Responses:	8	},
    { month:"	25' June	", Bad:	32.26	, Good:	38.71	, Neutral:	29.03	, Responses:	62	},
    { month:"	25' July	", Bad:	43.43	, Good:	30.30	, Neutral:	26.26	, Responses:	99	},
    { month:"	25' August	", Bad:	36.13	, Good:	35.29	, Neutral:	28.57	, Responses:	119	},
    { month:"	25' September	", Bad:	29.13	, Good:	32.28	, Neutral:	38.58	, Responses:	127	},
    { month:"	25' October	", Bad:	35.40	, Good:	38.05	, Neutral:	26.55	, Responses:	113	},
    { month:"	25' November	", Bad:	39.82	, Good:	38.05	, Neutral:	22.12	, Responses:	113	},
    { month:"	25' December	", Bad:	30.89	, Good:	39.84	, Neutral:	29.27	, Responses:	123	},
    { month:"	26' January	", Bad:	32.85	, Good:	36.50	, Neutral:	30.66	, Responses:	137	},
    { month:"	26' February	", Bad:	22.22	, Good:	22.22	, Neutral:	55.56	, Responses:	9	},
  ],
};

// ── 2. Cohort Sentiment (2M / 5M / 12M) ─────────────────────────────────
const COHORT = {
  Jan: {
    Global: [
      { cohort: "02M Live", Bad: 41.2, Good: 29.4, Neutral: 29.4 },
      { cohort: "05M Live", Bad: 36.1, Good: 28.9, Neutral: 34.9 },
      { cohort: "12M Live", Bad: 17.9, Good: 50.0, Neutral: 32.1 },
    ],
    NAM: [
      { cohort: "02M Live", Bad: 45.3, Good: 24.2, Neutral: 30.5 },
      { cohort: "05M Live", Bad: 43.4, Good: 24.5, Neutral: 32.1 },
      { cohort: "12M Live", Bad:  7.7, Good: 53.8, Neutral: 38.5 },
    ],
    INT: [
      { cohort: "02M Live", Bad: 37.0, Good: 34.8, Neutral: 28.3 },
      { cohort: "05M Live", Bad: 23.3, Good: 36.7, Neutral: 40.0 },
      { cohort: "12M Live", Bad: 26.7, Good: 46.7, Neutral: 26.7 },
    ],
  },
  Dec: {
    Global: [
      { cohort: "02M Live", Bad: 47.3, Good: 28.8, Neutral: 24.0 },
      { cohort: "05M Live", Bad: 28.8, Good: 32.9, Neutral: 38.4 },
      { cohort: "12M Live", Bad: 31.7, Good: 31.7, Neutral: 36.6 },
    ],
    NAM: [
      { cohort: "02M Live", Bad: 56.3, Good: 18.8, Neutral: 25.0 },
      { cohort: "05M Live", Bad: 33.3, Good: 19.4, Neutral: 47.2 },
      { cohort: "12M Live", Bad: 38.1, Good: 38.1, Neutral: 23.8 },
    ],
    INT: [
      { cohort: "02M Live", Bad: 36.4, Good: 40.9, Neutral: 22.7 },
      { cohort: "05M Live", Bad: 24.3, Good: 45.9, Neutral: 29.7 },
      { cohort: "12M Live", Bad: 25.0, Good: 25.0, Neutral: 50.0 },
    ],
  },
};

// ── 3. Dissatisfied Reasons MoM (Global / NAM / INT) ────────────────────
const COMPLAINTS = {
  Global: [
    { month: "Oct '25", "Low Performance": 37.9, "Support & Comms": 17.9, Economics: 9.5, "Payment Issues": 10.5, "Dissatisfaction/Exit": 11.6, "Campaign Setup": 9.5, "Tech/Platform": 3.2 },
    { month: "Nov '25", "Low Performance": 23.1, "Support & Comms": 24.2, Economics: 20.9, "Payment Issues":  8.8, "Dissatisfaction/Exit": 11.0, "Campaign Setup": 9.9, "Tech/Platform": 2.2 },
    { month: "Dec '25", "Low Performance": 31.2, "Support & Comms": 10.8, Economics: 17.2, "Payment Issues": 16.1, "Dissatisfaction/Exit":  9.7, "Campaign Setup": 12.9, "Tech/Platform": 2.2 },
    { month: "Jan '26", "Low Performance": 15.2, "Support & Comms": 21.0, Economics: 21.0, "Payment Issues": 13.3, "Dissatisfaction/Exit": 12.4, "Campaign Setup": 10.5, "Tech/Platform": 6.7 },
  ],
  NAM: [
    { month: "Oct '25", "Low Performance": 40.6, "Support & Comms": 12.5, Economics:  9.4, "Payment Issues": 12.5, "Dissatisfaction/Exit": 10.9, "Campaign Setup": 10.9, "Tech/Platform": 3.1 },
    { month: "Nov '25", "Low Performance": 26.2, "Support & Comms": 19.7, Economics: 19.7, "Payment Issues": 11.5, "Dissatisfaction/Exit": 11.5, "Campaign Setup":  9.8, "Tech/Platform": 1.6 },
    { month: "Dec '25", "Low Performance": 30.8, "Support & Comms":  5.8, Economics: 15.4, "Payment Issues": 25.0, "Dissatisfaction/Exit":  9.6, "Campaign Setup": 11.5, "Tech/Platform": 1.9 },
    { month: "Jan '26", "Low Performance": 13.9, "Support & Comms": 26.2, Economics: 20.0, "Payment Issues": 13.9, "Dissatisfaction/Exit": 12.3, "Campaign Setup": 10.8, "Tech/Platform": 3.1 },
  ],
  INT: [
    { month: "Oct '25", "Low Performance": 32.3, "Support & Comms": 29.0, Economics:  9.7, "Payment Issues":  6.5, "Dissatisfaction/Exit": 12.9, "Campaign Setup":  6.5, "Tech/Platform": 3.2 },
    { month: "Nov '25", "Low Performance": 16.7, "Support & Comms": 33.3, Economics: 23.3, "Payment Issues":  3.3, "Dissatisfaction/Exit": 10.0, "Campaign Setup": 10.0, "Tech/Platform": 3.3 },
    { month: "Dec '25", "Low Performance": 31.7, "Support & Comms": 17.1, Economics: 19.5, "Payment Issues":  4.9, "Dissatisfaction/Exit":  9.8, "Campaign Setup": 14.6, "Tech/Platform": 2.4 },
    { month: "Jan '26", "Low Performance": 17.5, "Support & Comms": 12.5, Economics: 22.5, "Payment Issues": 12.5, "Dissatisfaction/Exit": 12.5, "Campaign Setup": 10.0, "Tech/Platform": 12.5 },
  ],
};

// ── 4. Live Deal Correlation ─────────────────────────────────────────────
const LIVE_DEAL = [
  { name: "Dec Live",     Bad: 35, Good: 35, Neutral: 30, pct: "84%", vol: 219 },
  { name: "Dec Not Live", Bad: 63, Good:  7, Neutral: 29, pct: "16%", vol:  41 },
  { name: "Jan Live",     Bad: 33, Good: 33, Neutral: 33, pct: "90%", vol: 269 },
  { name: "Jan Not Live", Bad: 79, Good: 10, Neutral: 10, pct: "10%", vol:  29 },
];

// ── 5. Launch Source (NAM & INT) ─────────────────────────────────────────
const LAUNCH_SOURCE = {
  NAM: [
    { month: "Dec '25", source: "L. by Rep Dec", Bad: 49, Good: 17, Neutral: 34 },
    { month: "Jan '26", source: "L. by Rep Jan", Bad: 44, Good: 24, Neutral: 32 },
    { month: "Dec '25", source: "S3 (Metro) Dec",      Bad: 46, Good: 26, Neutral: 28 },
    { month: "Jan '26", source: "S3 (Metro) Jan",      Bad: 38, Good: 31, Neutral: 31 },
  ],
  INT: [
    { month: "Dec '25", source: "L. by Rep Dec", Bad: 28, Good: 43, Neutral: 29 },
    { month: "Jan '26", source: "L. by Rep Jan", Bad: 32, Good: 34, Neutral: 33 },
    { month: "Dec '25", source: "S3 (Metro) Dec",      Bad: 43, Good: 26, Neutral: 30 },
    { month: "Jan '26", source: "S3 (Metro) Jan",      Bad: 34, Good: 45, Neutral: 21 },
  ],
};

// ── Cohort Root Cause Trends ─────────────────────────────────────────────
const COHORT_ROOT_CAUSE = {
  Jan: [
    { case: "Low Performance",      "02M": 17, "05M": 7,  "12M": 1  },
    { case: "Support & Comms",      "02M": 14, "05M": 7,  "12M": 1  },
    { case: "Economics",            "02M": 13, "05M": 6,  "12M": 4  },
    { case: "Payment Issues",       "02M": 9,  "05M": 4,  "12M": 1  },
    { case: "Campaign Setup",       "02M": 10, "05M": 4,  "12M": 1  },
    { case: "Dissatisfaction/Exit", "02M": 9,  "05M": 4,  "12M": 0  },
    { case: "Tech/Platform Issues",        "02M": 7,  "05M": 0,  "12M": 0  },
    { case: "Positive Feedback",    "02M": 6,  "05M": 4,  "12M": 3  },
  ],
  Dec: [
    { case: "Low Performance",      "02M": 24, "05M": 2,  "12M": 4  },
    { case: "Support & Comms",      "02M": 4,  "05M": 5,  "12M": 1  },
    { case: "Economics",            "02M": 8,  "05M": 8,  "12M": 2  },
    { case: "Payment Issues",       "02M": 9,  "05M": 2,  "12M": 4  },
    { case: "Campaign Setup",       "02M": 8,  "05M": 4,  "12M": 1  },
    { case: "Dissatisfaction/Exit", "02M": 2,  "05M": 5,  "12M": 2  },
    { case: "Tech/Platform Issues",        "02M": 2,  "05M": 0,  "12M": 0  },
    { case: "Positive Feedback",    "02M": 8,  "05M": 5,  "12M": 4  },
  ],
};


// ── 6. Supply Pyramid ────────────────────────────────────────────────────
const SUPPLY_PYRAMID = {
  Jan: {
    Global: [
      { tier: "A", Bad: 100, Good: 0,  Neutral: 0,  vol: 1  },
      { tier: "B", Bad:  22, Good: 44, Neutral: 33, vol: 9  },
      { tier: "C", Bad:  33, Good: 58, Neutral:  8, vol: 12 },
      { tier: "D", Bad:  34, Good: 40, Neutral: 26, vol: 47 },
      { tier: "E", Bad:  31, Good: 29, Neutral: 40, vol: 65 },
      { tier: "F", Bad:  75, Good: 25, Neutral:  0, vol: 4  },
    ],
    NAM: [
      { tier: "A", Bad: 100, Good: 0,  Neutral: 0,  vol: 1  },
      { tier: "B", Bad:  24, Good: 41, Neutral: 35, vol: 17 },
      { tier: "C", Bad:  30, Good: 50, Neutral: 20, vol: 20 },
      { tier: "D", Bad:  36, Good: 36, Neutral: 28, vol: 95 },
      { tier: "E", Bad:  36, Good: 27, Neutral: 36, vol: 146 },
      { tier: "F", Bad:  74, Good: 11, Neutral: 16, vol: 19 },
    ],
    INT: [
      { tier: "B", Bad:  25, Good: 38, Neutral: 38, vol: 8  },
      { tier: "C", Bad:  25, Good: 38, Neutral: 38, vol: 8  },
      { tier: "D", Bad:  38, Good: 31, Neutral: 31, vol: 48 },
      { tier: "E", Bad:  41, Good: 26, Neutral: 33, vol: 81 },
      { tier: "F", Bad:  73, Good:  7, Neutral: 20, vol: 15 },
    ],
  },
  Dec: {
    Global: [
      { tier: "B", Bad: 29, Good: 50, Neutral: 21, vol: 14 },
      { tier: "C", Bad:  8, Good: 54, Neutral: 38, vol: 24 },
      { tier: "D", Bad: 31, Good: 34, Neutral: 35, vol: 97 },
      { tier: "E", Bad: 51, Good: 24, Neutral: 25, vol: 110 },
      { tier: "F", Bad: 73, Good: 27, Neutral:  0, vol: 15 },
    ],
    NAM: [
      { tier: "B", Bad: 30, Good: 40, Neutral: 30, vol: 10 },
      { tier: "C", Bad: 17, Good: 50, Neutral: 33, vol: 12 },
      { tier: "D", Bad: 48, Good: 23, Neutral: 30, vol: 44 },
      { tier: "E", Bad: 54, Good: 16, Neutral: 30, vol: 63 },
      { tier: "F", Bad: 63, Good: 38, Neutral:  0, vol: 8  },
    ],
    INT: [
      { tier: "B", Bad: 25, Good: 75, Neutral:  0, vol: 4  },
      { tier: "C", Bad: 58, Good: 42, Neutral:  0, vol: 12 },
      { tier: "D", Bad: 17, Good: 43, Neutral: 40, vol: 53 },
      { tier: "E", Bad: 47, Good: 34, Neutral: 19, vol: 47 },
      { tier: "F", Bad: 86, Good: 14, Neutral:  0, vol: 7  },
    ],
  },
};

// ── 7. Category Satisfaction ─────────────────────────────────────────────
const CATEGORY = {
  Jan: {
    Global: [
      { cat: "Beauty/Wellness", Bad: 37, Good: 33, Neutral: 30, vol: 211 },
      { cat: "Food & Drink",    Bad: 41, Good: 18, Neutral: 41, vol: 22  },
      { cat: "Leisure/Act.",    Bad: 38, Good: 27, Neutral: 35, vol: 26  },
      { cat: "Services",        Bad: 39, Good: 32, Neutral: 29, vol: 38  },
    ],
    NAM: [
      { cat: "Beauty/Wellness", Bad: 44, Good: 27, Neutral: 29, vol: 115 },
      { cat: "Food & Drink",    Bad: 25, Good: 25, Neutral: 50, vol: 8   },
      { cat: "Leisure/Act.",    Bad: 36, Good: 21, Neutral: 43, vol: 14  },
      { cat: "Services",        Bad: 39, Good: 30, Neutral: 30, vol: 23  },
    ],
    INT: [
      { cat: "Beauty/Wellness", Bad: 28, Good: 41, Neutral: 31, vol: 96  },
      { cat: "Food & Drink",    Bad: 50, Good: 14, Neutral: 36, vol: 14  },
      { cat: "Leisure/Act.",    Bad: 42, Good: 33, Neutral: 25, vol: 12  },
      { cat: "Services",        Bad: 40, Good: 33, Neutral: 27, vol: 15  },
    ],
  },
  Dec: {
    Global: [
      { cat: "Beauty/Wellness", Bad: 36, Good: 33, Neutral: 31, vol: 172 },
      { cat: "Food & Drink",    Bad: 35, Good: 41, Neutral: 24, vol: 17  },
      { cat: "Leisure/Act.",    Bad: 48, Good: 19, Neutral: 32, vol: 31  },
      { cat: "Services",        Bad: 49, Good: 27, Neutral: 24, vol: 37  },
    ],
    NAM: [
      { cat: "Beauty/Wellness", Bad: 46, Good: 23, Neutral: 31, vol: 94  },
      { cat: "Food & Drink",    Bad: 40, Good: 20, Neutral: 40, vol: 5   },
      { cat: "Leisure/Act.",    Bad: 57, Good: 14, Neutral: 29, vol: 14  },
      { cat: "Services",        Bad: 47, Good: 33, Neutral: 20, vol: 22  },
    ],
    INT: [
      { cat: "Beauty/Wellness", Bad: 24, Good: 44, Neutral: 32, vol: 78  },
      { cat: "Food & Drink",    Bad: 33, Good: 50, Neutral: 17, vol: 12  },
      { cat: "Leisure/Act.",    Bad: 41, Good: 24, Neutral: 35, vol: 17  },
      { cat: "Services",        Bad: 50, Good: 23, Neutral: 27, vol: 15  },
    ],
  },
};

// ── 8. Merchant Potential ────────────────────────────────────────────────
const MERCHANT_POTENTIAL = {
  Jan: [
    { group: "High Potential", Bad: 35, Good: 22, Neutral: 43, vol: 23  },
    { group: "Mid/Low Pot.",   Bad: 42, Good: 29, Neutral: 29, vol: 161 },
    { group: "No Info",        Bad: 48, Good: 33, Neutral: 19, vol: 21  },
    { group: "No Potential",   Bad: 31, Good: 38, Neutral: 31, vol: 13  },
  ],
  Dec: [
    { group: "High Potential", Bad: 26, Good: 32, Neutral: 42, vol: 19  },
    { group: "Mid/Low Pot.",   Bad: 39, Good: 29, Neutral: 32, vol: 144 },
    { group: "No Info",        Bad: 55, Good: 18, Neutral: 27, vol: 33  },
    { group: "No Potential",   Bad: 63, Good: 38, Neutral:  0, vol: 8   },
  ],
};

// ── 9. Specialization (Opportunity Owner) ───────────────────────────────
const SPECIALIZATION = {
  Global: [
    { spec: "BD",         Bad: 33, Good: 31, Neutral: 35, vol: 99 },
    { spec: "IB",         Bad: 42, Good: 32, Neutral: 26, vol: 85 },
    { spec: "S3 (Metro)", Bad: 37, Good: 35, Neutral: 28, vol: 97 },
    { spec: "MD",         Bad: 29, Good:  0, Neutral: 71, vol: 7  },
    { spec: "MC",         Bad: 33, Good:  0, Neutral: 67, vol: 3  },
  ],
  NAM: [
    { spec: "BD",         Bad: 33, Good: 26, Neutral: 41, vol: 27 },
    { spec: "IB",         Bad: 48, Good: 23, Neutral: 30, vol: 61 },
    { spec: "S3 (Metro)", Bad: 38, Good: 31, Neutral: 31, vol: 68 },
    { spec: "MD",         Bad: 100, Good: 0, Neutral:  0, vol: 1  },
  ],
  INT: [
    { spec: "BD",         Bad: 33, Good: 33, Neutral: 33, vol: 72 },
    { spec: "IB",         Bad: 29, Good: 54, Neutral: 17, vol: 24 },
    { spec: "S3 (Metro)", Bad: 34, Good: 45, Neutral: 21, vol: 29 },
    { spec: "MD",         Bad: 17, Good:  0, Neutral: 83, vol: 6  },
    { spec: "MC",         Bad: 33, Good:  0, Neutral: 67, vol: 3  },
  ],
};

// ── 10. Country Level (NAM + INT) Jan '26 ───────────────────────────────
const COUNTRY = [
  { country: "US",  Bad: 41.3, Good: 26.9, Neutral: 31.9, vol: 160 },
  { country: "FR",  Bad: 15.2, Good: 54.5, Neutral: 30.3, vol: 33  },
  { country: "DE",  Bad: 53.6, Good: 25.0, Neutral: 21.4, vol: 28  },
  { country: "ES",  Bad: 35.5, Good: 29.0, Neutral: 35.5, vol: 31  },
  { country: "GB",  Bad: 23.5, Good: 47.1, Neutral: 29.4, vol: 17  },
  { country: "PL",  Bad: 22.2, Good: 44.4, Neutral: 33.3, vol: 9   },
  { country: "AU",  Bad: 44.4, Good: 22.2, Neutral: 33.3, vol: 9   },
  { country: "AE",  Bad: 28.6, Good: 14.3, Neutral: 57.1, vol: 7   },
];


// ── Email Response Rate ──────────────────────────────────────────────────
const emailData = [
  { cohort: "02M Live", Sends: 1763, Bad: 4.4, Good: 3.1, Neutral: 3.1 },
  { cohort: "05M Live", Sends: 894,  Bad: 3.4, Good: 2.7, Neutral: 3.2 },
  { cohort: "12M Live", Sends: 501,  Bad: 1.0, Good: 2.8, Neutral: 1.8 },
];

// ═══════════════════════════════════════════════════════════════════════════
//  PALETTE & HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const P = {
  bad: "#FF4C4C", good: "#00D68F", neutral: "#FFB547",
  bg: "#080B12", card: "#0F1320", border: "#1A2236",
  text: "#E8ECF4", muted: "#c7c8c9", accent: "#4D8EFF",
  accent2: "#B06EFF", accent3: "#FF8C42", sends: "#ffffff", 
};

const PIE_COLORS = [P.bad, P.good, P.neutral];

const COMPLAINT_COLORS = {
  "Low Performance": P.bad,
  "Support & Comms": P.accent,
  "Economics": P.neutral,
  "Payment Issues": P.accent2,
  "Dissatisfaction/Exit": "#FF8C42",
  "Campaign Setup": "#2DD4BF",
  "Tech/Platform": "#E879F9",
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1A2436", border: `1px solid ${P.border}`, borderRadius: 8, padding: "10px 14px", fontFamily: "Montserrat", fontSize: 11, color: P.text }}>
      {label && <div style={{ marginBottom: 5, color: P.muted }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || P.text, display: "flex", gap: 8 }}>
          <span>{p.name}:</span><span><span>
  {typeof p.value === "number" 
    ? p.name === "Total Sends" 
      ? p.value.toLocaleString()       
      : p.value.toFixed(1) + "%" 
    : p.value}
</span></span>
        </div>
      ))}
      {payload[0]?.payload?.vol && (
  <div style={{ color: "#bdbcbb", marginTop: 6 }}>
    Total: {payload[0].payload.vol}
  </div>
)}
    </div>
  );
};

const Card = ({ title, subtitle, children, style = {} }) => (
  <div style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: "20px 22px", ...style }}>
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: P.text }}>{title}</div>
      {subtitle && <div style={{ fontSize: 10, color: P.muted, marginTop: 3, fontFamily: "Montserrat" }}>{subtitle}</div>}
    </div>
    {children}
  </div>
);

const Delta = ({ curr, prev, key: k, invert = false }) => {
  if (!prev) return null;
  const d = curr - prev;
  const good = invert ? d < 0 : d > 0;
  if (d === 0) return null;
  return (
    <span style={{ fontSize: 10, color: good ? P.good : P.bad, background: good ? "rgba(0,214,143,0.1)" : "rgba(255,76,76,0.1)", padding: "1px 6px", borderRadius: 100, marginLeft: 6 }}>
      {d > 0 ? "▲+" : "▼"}{Math.abs(d).toFixed(1)}pp
    </span>
  );
};

// Tab component
const Tabs = ({ options, value, onChange, small }) => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
    {options.map(o => (
      <button key={o} onClick={() => onChange(o)} style={{
        cursor: "pointer", padding: small ? "4px 12px" : "5px 14px",
        borderRadius: 100, fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: small ? 10 : 11, transition: "all 0.2s",
        border: `1px solid ${value === o ? P.accent : P.border}`,
        background: value === o ? P.accent : "transparent",
        color: value === o ? "#fff" : P.muted,
      }}>{o}</button>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// 1 ─ Monthly Trend Line Chart
const SentimentTrend = ({region, setRegion}) => {
  const data = MONTHLY_SENTIMENT[region]; 
  return (
    <Card title="1. Monthly Sentiment Trend" subtitle="Bad · Good · Neutral (%) over time">
      <Tabs options={["Global", "NAM", "INT"]} value={region} onChange={setRegion} />
      <ResponsiveContainer width="100%" height={220} style={{ marginTop: 16 }}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} domain={[10, 60]} />
          <Tooltip content={<Tip />} />
          <Legend wrapperStyle={{ fontFamily: "Montserrat", fontSize: 10 }} />
          <Line dataKey="Bad"     stroke={P.bad}     strokeWidth={2.5} dot={{ r: 4, fill: P.bad }}     name="Bad"     />
          <Line dataKey="Good"    stroke={P.good}    strokeWidth={2.5} dot={{ r: 4, fill: P.good }}    name="Good"    />
          <Line dataKey="Neutral" stroke={P.neutral} strokeWidth={2.5} dot={{ r: 4, fill: P.neutral }} name="Neutral" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

// 1 ─ Response Volume
const TipVol = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1A2436", border: `1px solid ${P.border}`, borderRadius: 8, padding: "10px 14px", fontFamily: "Montserrat", fontSize: 11, color: P.text }}>
      {label && <div style={{ marginBottom: 5, color: P.muted }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || P.text, display: "flex", gap: 8 }}>
          <span>{p.name}:</span><span>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const ResponseVolume = ({region, setRegion}) =>  (
  <Card title="1. Monthly Response Volume" subtitle="Total survey submissions">
     <Tabs options={["Global", "NAM", "INT"]} value={region} onChange={setRegion} />
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={MONTHLY_SENTIMENT[region]} barCategoryGap="40%">
        <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
        <XAxis dataKey="month" tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
        <Tooltip content={<TipVol />} />
        <Bar dataKey="Responses" name="Responses" fill={P.accent} radius={[6, 6, 0, 0]}>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </Card>
  );


// 2 ─ Cohort Sentiment
const CohortSentiment = () => {
  const [month, setMonth] = useState("Jan");
  const [region, setRegion] = useState("Global");
  const data = COHORT[month][region];
  return (
    <Card title="2. Cohort Sentiment (2M / 5M / 12M Live)" subtitle="Satisfaction by months live">
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <Tabs options={["Jan", "Dec"]} value={month} onChange={setMonth} small />
        <Tabs options={["Global", "NAM", "INT"]} value={region} onChange={setRegion} small />
      </div>
      <ResponsiveContainer width="100%" height={200} style={{ marginTop: 16 }}>
        <BarChart data={data} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
          <XAxis dataKey="cohort" tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="Bad"     fill={P.bad}     name="Bad"     radius={[4,4,0,0]} />
          <Bar dataKey="Good"    fill={P.good}    name="Good"    radius={[4,4,0,0]} />
          <Bar dataKey="Neutral" fill={P.neutral} name="Neutral" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};


// 3 ─ Country Level
const CountryChart = () => (
  <Card title="3. Country Level Satisfaction — Jan '26" subtitle="NAM & INT combined · sorted by volume">
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={COUNTRY} layout="vertical" barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} />
        <YAxis type="category" dataKey="country" width={36} tick={{ fill: P.muted, fontSize: 11, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} />
        <Bar dataKey="Bad"     fill={P.bad}     name="Bad"     stackId="a" />
        <Bar dataKey="Good"    fill={P.good}    name="Good"    stackId="a" />
        <Bar dataKey="Neutral" fill={P.neutral} name="Neutral" stackId="a" 
        radius={[0,4,4,0]} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);



// 4 ─ Email Engagement

const EmailEngagement = () => (
  <Card title="4. Submission Response Rate & Engagement" subtitle="Submision Rate">
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={emailData} barCategoryGap="30%" margin={{ top: 8, right: 40, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
        <XAxis dataKey="cohort" tick={{ fill: P.muted, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
        <YAxis
          yAxisId="left"
          tick={{ fill: P.muted, fontSize: 10 }}
          axisLine={false} tickLine={false}
          domain={[0, 6]}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: P.muted, fontSize: 10 }}
          axisLine={false} tickLine={false}
          tickFormatter={v => v.toLocaleString()}
        />
        <Tooltip content={<Tip />} />
        <Legend wrapperStyle={{ fontFamily: "monospace", fontSize: 10 }} />
        <Bar yAxisId="right" dataKey="Sends" fill={P.sends} name="Total Sends" radius={[4,4,0,0]} />
        <Bar yAxisId="left"  dataKey="Bad"     fill={P.bad}     name="Bad"     radius={[4,4,0,0]} />
        <Bar yAxisId="left"  dataKey="Good"    fill={P.good}    name="Good"    radius={[4,4,0,0]} />
        <Bar yAxisId="left"  dataKey="Neutral" fill={P.neutral} name="Neutral"  radius={[4,4,0,0]} />
      </ComposedChart>
    </ResponsiveContainer>
  </Card>
);

// 5 ─ Live Deal Correlation
const LiveDealChart = () => {
  return (
    <Card title="5. Live Deal Correlation" subtitle="Sentiment split by live deal status">
      <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
        {LIVE_DEAL.map(d => (
          <div key={d.name} style={{ background: P.border, borderRadius: 8, padding: "6px 12px", flex: 1 }}>
            <div style={{ fontSize: 9, color: P.muted, fontFamily: "Montserrat" }}>{d.name}</div>
            <div style={{ fontSize: 15, fontFamily: "'Syne',sans-serif", fontWeight: 700, color: P.text }}>{d.pct}</div>
            <div style={{ fontSize: 9, color: P.muted, fontFamily: "Montserrat" }}>Vol={d.vol}</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={LIVE_DEAL} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
          <XAxis dataKey="name" tick={{ fill: P.muted, fontSize: 9, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="Bad"     fill={P.bad}     name="Bad"     stackId="a" />
          <Bar dataKey="Good"    fill={P.good}    name="Good"    stackId="a" />
          <Bar dataKey="Neutral" fill={P.neutral} name="Neutral" stackId="a" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

// 6 ─ Launch Source
const LaunchSourceChart = () => {
  const [region, setRegion] = useState("NAM");
  const data = LAUNCH_SOURCE[region];
  return (
    <Card title="6. Launch Source Breakdown" subtitle="Launched by Rep vs S3 (Metro) — NAM & INT">
      <Tabs options={["NAM", "INT"]} value={region} onChange={setRegion} />
      <ResponsiveContainer width="100%" height={200} style={{ marginTop: 16 }}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
          <XAxis dataKey="source" tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} />
          <Tooltip content={<Tip />} />
          <Legend wrapperStyle={{ fontFamily: "Montserrat", fontSize: 10 }} />
          {["Dec '25", "Jan '26"].map((m, mi) => (
            ["Bad", "Good", "Neutral"].map((s, si) => null) // rendered below
          ))}
          <Bar dataKey="Bad"     fill={P.bad}     name="Bad"     radius={[4,4,0,0]} />
          <Bar dataKey="Good"    fill={P.good}    name="Good"    radius={[4,4,0,0]} />
          <Bar dataKey="Neutral" fill={P.neutral} name="Neutral" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

// 6.1 ─ Specialization
const SpecializationChart = () => {
  const [region, setRegion] = useState("Global");
  const data = SPECIALIZATION[region];
  return (
    <Card title="6. Specialization (Opportunity Owner)" subtitle="Satisfaction by rep. type">
      <Tabs options={["Global", "NAM", "INT"]} value={region} onChange={setRegion} />
      <ResponsiveContainer width="100%" height={220} style={{ marginTop: 16 }}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
          <XAxis dataKey="spec" tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} domain={[0, 110]} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="Bad"     fill={P.bad}     name="Bad"     stackId="a" />
          <Bar dataKey="Good"    fill={P.good}    name="Good"    stackId="a" />
          <Bar dataKey="Neutral" fill={P.neutral} name="Neutral" stackId="a" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

// 7 ─ Complaint Drivers
const ComplaintDrivers = () => {
  const [region, setRegion] = useState("Global");
  const data = COMPLAINTS[region];
  const keys = ["Low Performance", "Support & Comms", "Economics", "Payment Issues", "Dissatisfaction/Exit", "Campaign Setup", "Tech/Platform"];
  return (
    <Card title="7. Dissatisfied Reasons MoM" subtitle="% of bad responses by complaint type">
      <Tabs options={["Global", "NAM", "INT"]} value={region} onChange={setRegion} />
      <ResponsiveContainer width="100%" height={250} style={{ marginTop: 16 }}>
        <BarChart data={data} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} />
          <Tooltip content={<Tip />} />
          <Legend wrapperStyle={{ fontFamily: "Montserrat", fontSize: 9 }} />
          {keys.map(k => <Bar key={k} dataKey={k} stackId="a" fill={COMPLAINT_COLORS[k]} name={k} />)}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};


// 8 Cohort Root Cause Chart ──────────────────────────────────────────────
const CohortRootCause = () => {
  const [month, setMonth] = useState("Jan");
  const data = COHORT_ROOT_CAUSE[month];

  return (
    <Card title="8. Cohort Root Cause Trends" subtitle="Feedback Reasons">
      <div style={{ marginBottom: 16 }}>
        <Tabs options={["Jan", "Dec"]} value={month} onChange={setMonth} small />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: P.muted, fontSize: 10, fontFamily: "Montserrat" }}
            axisLine={false} tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="case"
            width={120}
            tick={{ fill: P.muted, fontSize: 9, fontFamily: "Montserrat" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<TipVol />} />
          <Legend wrapperStyle={{ fontFamily: "Montserrat", fontSize: 10 }} />
          <Bar dataKey="02M" name="02 Months Live" stackId="a" fill="#93C5FD" />
          <Bar dataKey="05M" name="05 Months Live" stackId="a" fill="#C4B5FD" />
          <Bar dataKey="12M" name="12 Months Live" stackId="a" fill="#FDA4AF" radius={[0,4,4,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};


// 7 ─ Supply Pyramid
const SupplyPyramidChart = () => {
  const [month, setMonth] = useState("Jan");
  const [region, setRegion] = useState("Global");
  const data = SUPPLY_PYRAMID[month][region];
  return (
    <Card title="Supply Pyramid Satisfaction" subtitle="Tier A–F sentiment breakdown">
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <Tabs options={["Jan", "Dec"]} value={month} onChange={setMonth} small />
        <Tabs options={["Global", "NAM", "INT"]} value={region} onChange={setRegion} small />
      </div>
      <ResponsiveContainer width="100%" height={220} style={{ marginTop: 16 }}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
          <XAxis dataKey="tier" tick={{ fill: P.muted, fontSize: 11, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} domain={[0, 110]} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="Bad"     fill={P.bad}     name="Bad"     stackId="a" />
          <Bar dataKey="Good"    fill={P.good}    name="Good"    stackId="a" />
          <Bar dataKey="Neutral" fill={P.neutral} name="Neutral" stackId="a" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

// 8 ─ Category Satisfaction
const CategoryChart = () => {
  const [month, setMonth] = useState("Jan");
  const [region, setRegion] = useState("Global");
  const data = CATEGORY[month][region];
  return (
    <Card title="Category Satisfaction" subtitle="Beauty · Food · Leisure · Services">
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <Tabs options={["Jan", "Dec"]} value={month} onChange={setMonth} small />
        <Tabs options={["Global", "NAM", "INT"]} value={region} onChange={setRegion} small />
      </div>
      <ResponsiveContainer width="100%" height={220} style={{ marginTop: 16 }}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
          <XAxis dataKey="cat" tick={{ fill: P.muted, fontSize: 9, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} domain={[0, 110]} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="Bad"     fill={P.bad}     name="Bad"     stackId="a" />
          <Bar dataKey="Good"    fill={P.good}    name="Good"    stackId="a" />
          <Bar dataKey="Neutral" fill={P.neutral} name="Neutral" stackId="a" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

// 9 ─ Merchant Potential
const MerchantPotentialChart = () => {
  const [month, setMonth] = useState("Jan");
  const data = MERCHANT_POTENTIAL[month];
  return (
    <Card title="Merchant Potential Group" subtitle="High · Mid/Low · No Info · No Potential">
      <Tabs options={["Jan", "Dec"]} value={month} onChange={setMonth} small />
      <ResponsiveContainer width="100%" height={220} style={{ marginTop: 16 }}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false} />
          <XAxis dataKey="group" tick={{ fill: P.muted, fontSize: 9, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} domain={[0, 110]} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="Bad"     fill={P.bad}     name="Bad"     stackId="a" />
          <Bar dataKey="Good"    fill={P.good}    name="Good"    stackId="a" />
          <Bar dataKey="Neutral" fill={P.neutral} name="Neutral" stackId="a" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};






// ═══════════════════════════════════════════════════════════════════════════
//  ANALYSIS TEXT
//  Cada sección tiene: title, y blocks (array de { type, text/items })
//  Types: "p" = párrafo normal, "label" = etiqueta de subsección (ej. "Insight:"),
//         "bold" = párrafo con primera palabra en negrita, "list" = lista de bullets
// ═══════════════════════════════════════════════════════════════════════════

const ANALYSIS_CONTENT = [
  {
    title: "1. Global Summary",
    blocks: [
      { type: "p", text: "Global merchant satisfaction showed modest improvement in January, with Bad sentiment declining from 39.6% to 37.6% (-2.0pp), Good sentiment rising from 30.4% to 31.2% (+0.8pp), and Neutral sentiment holding essentially stable at 31.2% vs 30.0% (+1.2pp). The 298 responses in January (vs 260 in December) represent a 14.6% increase in survey engagement, providing a more robust sample for analysis." },
      { type: "label", text: "Insight:" },
      { type: "p", text: "The improvement in global sentiment is directly attributable to a strategic shift in dissatisfaction drivers. Low Performance complaints dropped dramatically from 31.2% in December to 15.2% in January (-16.0pp), while Support & Communication Issues increased from 10.8% to 21.0% (+10.2pp), and Economics concerns rose from 17.2% to 21.0% (+3.8pp). This suggests merchants are experiencing better deal performance outcomes, but operational support gaps are emerging as the primary friction point." },
      { type: "label", text: "Action:" },
      { type: "p", text: "Focus on support response quality and economics transparency. Review support team workflows to identify efficiency opportunities and launch pricing education initiatives to address the 21.0% economics complaint rate." },
      { type: "subsection", text: "NAM Section" },
      { type: "p", text: "NAM demonstrated significant improvement with Bad sentiment declining from 47.4% to 41.6% (-5.8pp), Good sentiment rising from 21.9% to 26.7% (+4.8pp), and Neutral holding stable at 31.7% vs 30.7% (+1.0pp). The 161 responses represent a 17.5% increase from December's 137 responses." },
      { type: "label", text: "Insight:" },
      { type: "p", text: "NAM's improvement is directly correlated with Low Performance complaints plummeting from 30.77% in December to 13.85% in January (-16.92pp). However, this was partially offset by Support & Communication Issues surging from 5.77% to 26.15% (+20.38pp), and Economics concerns rising from 15.38% to 20.00% (+4.62pp). The data indicates NAM merchants are seeing better campaign results but experiencing service delivery challenges." },
      { type: "label", text: "Action:" },
      { type: "p", text: "NAM should assess support team capacity and implement standardized response protocols. Consider quarterly business reviews for Tier A-C merchants and enhance pricing transparency through merchant-facing tools." },
      { type: "subsection", text: "INT Section" },
      { type: "p", text: "INT experienced a slight deterioration with Bad sentiment rising from 30.9% to 32.8% (+1.9pp), Good sentiment declining from 39.8% to 36.5% (-3.3pp), and Neutral remaining essentially flat at 30.7% vs 29.3% (+1.4pp). The region processed 137 responses, up from 123 in December (+11.4%)." },
      { type: "label", text: "Insight:" },
      { type: "p", text: "INT's decline is driven by a shift in complaint composition. While Low Performance improved from 31.7% to 17.5% (-14.2pp), Economics complaints surged from 19.5% to 22.5% (+3.0pp), Payment Issues jumped from 4.9% to 12.5% (+7.6pp), and Technical or Platform Problems spiked from 2.4% to 12.5% (+10.1pp). This suggests operational and technical infrastructure challenges unique to international markets." },
      { type: "label", text: "Action:" },
      { type: "p", text: "Monitor INT payment processing and technical issues over the next 30 days. If complaint volumes continue at or above current levels in February, conduct technical infrastructure review. Address economics concerns through enhanced pricing communication in key markets." },
    ],
  },
  {
    title: "2. Cohort Sentiment (2, 5, 12 Months Live)",
    blocks: [
      { type: "subsection", text: "Global" },
      { type: "p", text: "The lifecycle cohort analysis reveals a concerning onboarding pattern but strong long-term retention dynamics." },
      { type: "label", text: "Insight:" },
      { type: "p", text: "The 2M cohort struggles with early satisfaction (41.2% Bad), showing a 23.3pp gap vs the mature 12M cohort (17.9% Bad). However, merchants who reach 12 months show dramatically improved sentiment with 50.0% Good sentiment vs 29.4% at 2M, representing a 20.6pp improvement. This indicates that time-to-value and relationship maturity are critical success factors." },
      { type: "label", text: "Action:" },
      { type: "p", text: "Continue focus on 0-3 month merchant support with structured onboarding playbooks. The 12M success validates that early investment pays off in long-term satisfaction." },
      { type: "subsection", text: "NAM" },
      { type: "p", text: "NAM cohort sentiment shows similar lifecycle patterns with regional nuances." },
      { type: "label", text: "Insight:" },
      { type: "p", text: "NAM's 2M cohort sentiment is notably worse than global (45.3% vs 41.2% Bad), indicating particularly challenging onboarding in North America. However, the 12M cohort performs exceptionally well (7.7% Bad vs 17.9% global), suggesting NAM merchants who survive early challenges become highly satisfied long-term partners. The 5M cohort shows minimal improvement from 2M (43.4% vs 45.3% Bad), indicating a critical support gap at months 3-6." },
      { type: "label", text: "Action:" },
      { type: "p", text: "NAM requires enhanced 0-6 month support. Consider mid-journey check-ins at month 4-5 and implement performance milestone tracking to prevent attrition during the transition period." },
      { type: "subsection", text: "INT" },
      { type: "p", text: "INT demonstrates stronger early-stage satisfaction but weaker long-term improvement." },
      { type: "label", text: "Insight:" },
      { type: "p", text: "INT's 2M cohort outperforms NAM significantly (37.0% vs 45.3% Bad), suggesting more effective international onboarding processes. The 5M cohort shows strong improvement (23.3% Bad), and the 12M cohort maintains good satisfaction (46.7% Good, 26.7% Bad). The 12M Bad sentiment is higher than NAM's (26.7% vs 7.7%), which may correlate with regional dynamics such as currency fluctuations or local market competition." },
      { type: "label", text: "Action:" },
      { type: "p", text: "INT should implement 6-month and 12-month business reviews to strengthen long-term relationships and address regional market dynamics proactively." },
    ],
  },
  {
    title: "3. Country Level Satisfaction (US v INTL)",
    blocks: [
      { type: "subsection", text: "Best Performing Markets" },
      { type: "list", items: [
        "France (FR): Bad 15.2%, Good 54.5%, Neutral 30.3% (33 responses) — strongest performer",
        "Great Britain (GB): Bad 23.5%, Good 47.1%, Neutral 29.4% (17 responses)",
        "Poland (PL): Bad 22.2%, Good 44.4%, Neutral 33.3% (9 responses — limited sample)",
      ]},
      { type: "subsection", text: "Worst Performing Markets" },
      { type: "list", items: [
        "Germany (DE): Bad 53.6%, Good 25.0%, Neutral 21.4% (28 responses) — highest Bad sentiment",
        "Spain (ES): Bad 35.5%, Good 29.0%, Neutral 35.5% (31 responses) — balanced but elevated Bad sentiment",
      ]},
      { type: "label", text: "Insight:" },
      { type: "p", text: "France and GB demonstrate operational excellence. Germany's 53.6% Bad sentiment with 28 responses provides sufficient confidence to warrant investigation. The performance gap between FR (15.2% Bad) and DE (53.6% Bad) represents a 38.4pp variance, suggesting market-specific challenges in Germany." },
      { type: "label", text: "Action:" },
      { type: "p", text: "Conduct qualitative follow-up with German merchants to understand root causes (payment processing, local competition, support quality, product-market fit). Extract best practices from France's support model and pricing approach for potential replication across EMEA." },
    ],
  },
  {
    title: "4. Submission Response Rate & Engagement",
    blocks: [
      { type: "subsection", text: "January Response Rates by Cohort" },
      { type: "list", items: [
        "2 Months Live: 10.6% response rate, up from 8.2% in December (+2.4pp)",
        "5 Months Live: 9.3% response rate, up from 6.7% in December (+2.6pp)",
        "12 Months Live: 5.6% response rate, down from 7.9% in December (-2.3pp)",
      ]},
      { type: "label", text: "Insight:" },
      { type: "p", text: "The email improvements implemented in late December/early January successfully lifted response rates for early and mid-journey cohorts. However, the 12M cohort declined -2.3pp (7.9% → 5.6%), suggesting mature merchants may be experiencing survey fatigue or the email improvements were less relevant to this segment. The overall pattern still shows response rates declining as tenure increases (10.6% at 2M → 5.6% at 12M), creating sampling bias toward newer merchants. Notably, at 12M Live, Good response rates (2.8%) significantly exceed Bad rates (1.0%), suggesting satisfied long-term merchants remain more willing to provide feedback." },
      { type: "label", text: "Action:" },
      { type: "p", text: "The email improvements are working for early/mid-stage merchants — continue current approach. For the 12M cohort, consider differentiated survey strategies such as quarterly strategic surveys with executive-level engagement or lighter-touch NPS surveys to reduce fatigue while maintaining feedback channels." },
    ],
  },
  {
    title: "5. Live Deal Correlation",
    blocks: [
      { type: "label", text: "Insight:" },
      { type: "p", text: "29 merchants (NotLiveDeal) in January (79% Bad) have already churned, mirroring December's pattern where 41 merchants churned. The critical risk is the 89 Live Deal merchants with Bad sentiment (33% of 269). Without intervention, these currently active but dissatisfied merchants are likely to become February's Not Live cohort, following the established pattern of negative sentiment preceding churn." },
      { type: "label", text: "Action:" },
      { type: "p", text: "Prioritize outreach to the ~89 dissatisfied Live Deal merchants within 48-72 hours, focusing on Tier A-C first. Address blockers and track renewal rates through February to prevent churn." },
      { type: "label", text: "Expected Outcome:" },
      { type: "p", text: "Without intervention, expect approximately 45-55 of the currently dissatisfied Live Deal merchants to appear in February's Not Live cohort." },
    ],
  },
  {
    title: "6. Launch Source & Specialization",
    blocks: [
      { type: "subsection", text: "NAM — Launch Source (January)" },
      { type: "label", text: "Insight:" },
      { type: "p", text: "Both channels improved month-over-month. Rep-led Bad sentiment improved from 49% to 44% (-5pp), while S3 Metro improved from 46% to 38% (-8pp). S3 Metro continues to show 6pp better Bad sentiment and 7pp better Good sentiment (31% vs 24%) compared to rep-led merchants." },
      { type: "p", text: "NAM's improvement across both launch channels is directly attributable to two major operational wins: Low Performance complaints plummeted from 30.77% → 13.85% (-16.92pp), and Payment Issues resolved from 25.00% → 13.85% (-11.15pp). However, these gains were partially offset by Support & Communication Issues surging from 5.77% → 26.15% (+20.38pp)." },
      { type: "label", text: "Action:" },
      { type: "p", text: "Document what drove the Low Performance and Payment Issues improvements to ensure sustainability. Address the emerging support capacity challenge through team expansion or process optimization. S3 Metro's stronger performance (38% Bad vs 44% Rep-led) suggests their playbook may include better expectation-setting or more efficient support workflows that could be replicated for rep-led merchants." },
      { type: "subsection", text: "INT — Launch Source (January)" },
      { type: "label", text: "Insight:" },
      { type: "p", text: "January's larger sample sizes (108 rep-led, 29 S3) provide better confidence than December's limited samples. S3 Metro's 45% Good sentiment vs 34% for rep-led (+11pp) suggests the S3 model is performing well internationally. INT's mixed performance is explained by contrasting trends: improvements in Low Performance (31.7% → 17.5%, -14.2pp) and Support & Communication (17.1% → 12.5%, -4.6pp), but new challenges in Technical/Platform Problems (2.4% → 12.5%, +10.1pp) and Payment Issues (4.9% → 12.5%, +7.6pp)." },
      { type: "label", text: "Action:" },
      { type: "p", text: "Monitor INT technical and payment issues individually with affected merchants. If complaint volumes remain elevated in February, escalate for infrastructure review." },
      { type: "subsection", text: "Global — Specialization Breakdown" },
      { type: "list", items: [
        "S3 (Metro): Bad 37%, Good 35%, Neutral 28% (97 responses) — largest volume",
        "IB (Inbound): Bad 42%, Good 32%, Neutral 26% (85 responses) — 9pp gap vs BD",
        "BD (Business Development): Bad 33%, Good 31%, Neutral 35% (99 responses) — most balanced",
      ]},
      { type: "label", text: "Action:" },
      { type: "p", text: "IB should review lead quality and expectation-setting processes given the 9pp gap vs BD performance. Scale successful BD relationship management practices where applicable." },
    ],
  },
  {
    title: "7. Merchant Feedback & Case Follow-Up",
    blocks: [
      { type: "subsection", text: "Global Trends" },
      { type: "list", items: [
        "Low Performance: 31.2% (Dec) → 15.2% (Jan) = -16.0pp (dramatic improvement)",
        "Support & Communication Issues: 10.8% (Dec) → 21.0% (Jan) = +10.2pp (now co-leading)",
        "Economics: 17.2% (Dec) → 21.0% (Jan) = +3.8pp (now co-leading)",
        "Payment Issues: 16.1% (Dec) → 13.3% (Jan) = -2.8pp (modest improvement)",
        "Campaign Setup & Deal Structure: 12.9% (Dec) → 10.5% (Jan) = -2.4pp",
        "Technical or Platform Problems: 2.2% (Dec) → 6.7% (Jan) = +4.5pp",
      ]},
      { type: "label", text: "Insight:" },
      { type: "p", text: "The dramatic 16.0pp drop in Low Performance complaints explains the overall satisfaction improvement globally. However, this success is being offset by operational challenges. Support & Communication Issues surging 10.2pp to become a co-leading complaint (tied with Economics at 21.0%) indicates that as deal performance improves, merchants are increasingly frustrated by responsiveness, communication quality, or issue resolution speed." },
      { type: "subsection", text: "NAM" },
      { type: "list", items: [
        "Low Performance: 30.77% → 13.85% = -16.92pp (exceptional improvement)",
        "Support & Communication Issues: 5.77% → 26.15% = +20.38pp (now #1 NAM complaint)",
        "Economics: 15.38% → 20.00% = +4.62pp (growing concern)",
        "Payment Issues: 25.00% → 13.85% = -11.15pp (significant improvement)",
      ]},
      { type: "subsection", text: "INT" },
      { type: "list", items: [
        "Low Performance: 31.7% → 17.5% = -14.2pp (strong improvement)",
        "Support & Communication Issues: 17.1% → 12.5% = -4.6pp (improving)",
        "Economics: 19.5% → 22.5% = +3.0pp (moderate increase)",
        "Payment Issues: 4.9% → 12.5% = +7.6pp (concerning, ~5-6 merchants)",
        "Technical or Platform Problems: 2.4% → 12.5% = +10.1pp (~5-6 merchants)",
      ]},
    ],
  },
  {
    title: "8. Cohort-Level Root Cause Trends",
    blocks: [
      { type: "subsection", text: "02 Months Live" },
      { type: "list", items: [
        "Low Performance: 24 → 17 complaints = -29.2% reduction",
        "Economics: 8 → 14 complaints = +75.0% increase",
        "Support & Communication Issues: 4 → 14 complaints = +250.0% increase",
        "Dissatisfaction/Exit Request: 2 → 9 complaints = +350.0% increase ⚠️ Early churn signal",
        "Payment Issues: 9 → 9 complaints = stable",
      ]},
      { type: "label", text: "Action:" },
      { type: "p", text: "Implement structured 60-day onboarding program with regular check-ins and pricing transparency tools. Flag 2M merchants submitting Exit Requests for proactive intervention within 48 hours." },
      { type: "priority", text: "🔴 HIGH — Early churn prevention is more cost-effective than new merchant acquisition." },
      { type: "subsection", text: "05 Months Live" },
      { type: "list", items: [
        "Low Performance: 2 → 7 complaints = +250.0% increase ⚠️",
        "Support & Communication Issues: 5 → 7 complaints = +40.0%",
        "Economics: 8 → 6 complaints = -25.0% (modest improvement)",
        "Payment Issues: 2 → 4 complaints = +100.0%",
        "Dissatisfaction/Exit Request: 5 → 4 complaints = -20.0%",
      ]},
      { type: "label", text: "Action:" },
      { type: "p", text: "Launch proactive 90-day performance review program. Implement campaign refresh strategies and automated optimization recommendations for 5M merchants showing performance degradation." },
      { type: "priority", text: "🟡 MEDIUM-HIGH — Preventing 5M attrition protects 6-12 month LTV realization." },
      { type: "subsection", text: "12 Months Live" },
      { type: "list", items: [
        "Low Performance: 4 → 1 complaints = -75.0% (dramatic improvement)",
        "Economics: 2 → 4 complaints = +100.0% (2 additional merchants)",
        "Payment Issues: 4 → 1 complaints = -75.0% (resolved)",
        "Positive Feedback: 4 → 3 = -25.0% (high satisfaction maintained)",
      ]},
      { type: "label", text: "Action:" },
      { type: "p", text: "Implement mandatory 12-month strategic reviews for all merchants reaching 1-year tenure. Include contract optimization, performance benchmarking, and competitive positioning discussions." },
      { type: "priority", text: "🟢 MEDIUM — Protect high-LTV mature merchant base with proactive relationship management." },
    ],
  },
  {
    title: "9. Merchant Potential & Supply Pyramid",
    blocks: [
      { type: "subsection", text: "Merchant Potential Analysis" },
      { type: "label", text: "Insight:" },
      { type: "p", text: "High Potential merchants showed sentiment softening with Bad increasing from 26% to 35% (+9pp) and Good declining from 32% to 22% (-10pp), though with only 23 merchants this represents approximately 2-3 additional dissatisfied merchants. Mid/Low Potential merchants (161 merchants) improved slightly with Bad essentially stable at 42% vs 39% (+3pp)." },
      { type: "subsection", text: "Supply Pyramid — Tier Highlights" },
      { type: "list", items: [
        "Tier A: 1 merchant — 100% Bad → 🔴 CRITICAL: Executive-level outreach within 48h",
        "Tier B: Bad improved -5pp globally; INT doubled to 9 merchants → 🔴 HIGH: Quarterly reviews for all",
        "Tier C: INT dramatic improvement (-25pp Bad, +16pp Good) → 🔴 HIGH: Replicate INT success",
        "Tier D: NAM improved -10pp Bad; INT deteriorated +17pp Bad (correlates with tech/payment issues) → 🟡 MEDIUM-HIGH",
        "Tier E: +33% volume growth (110→146); Bad -15pp globally → 🟢 MEDIUM: Scale to self-service",
        "Tier F: NAM nearly doubled (8→15), 73% Bad → 🟢 LOW: Minimal investment; prevent inflow",
      ]},
      { type: "subsection", text: "Strategic Actions" },
      { type: "list", items: [
        "Tier A-C Quarterly Engagement: 38 high-value merchants globally with named account sponsors",
        "INT Tier C Success Replication: Document -25pp Bad drivers and scale to NAM and Global",
        "NAM Tier D Best Practice Scaling: Extract strategies for application to INT Tier D",
        "Tier Migration Tracking: Monitor monthly tier movement to trigger proactive interventions",
        "Tier E Scalability: Transition 146 merchants to automated support infrastructure",
      ]},
    ],
  },
  {
    title: "📈 Summary of Trends",
    blocks: [
      { type: "list", items: [
        "✅ Global Low Performance: Dropped from 31.2% to 15.2% (-16.0pp) → Strongest improvement driver",
        "⚠️ NAM Support & Communication Issues: Surged from 5.77% to 26.15% (+20.38pp) → Capacity constraint signal",
        "✅ NAM Payment Issues: Resolved from 25.0% to 13.85% (-11.15pp) → December's Payment Ops Fix succeeded",
        "⚠️ INT Technical/Platform Problems: Increased from 2.4% to 12.5% (+10.1pp, ~5-6 merchants) → Monitor trend",
        "⚠️ Economics Concerns: Rising globally from 17.2% to 21.0% (+3.8pp) → Pricing transparency needed",
        "✅ INT S3 Metro: Strong performance at 34% Bad, 45% Good (+19pp Good from Dec) → Replication opportunity",
        "⚠️ Live Deal Churn Risk: 89 merchants with Bad sentiment at risk of becoming February's Not Live cohort",
      ]},
      { type: "subsection", text: "Q1 2026 Focus Priorities" },
      { type: "list", items: [
        "NAM Support Capacity Expansion (Feb–Mar): Reduce Support complaints from 26.15% to <15%",
        "Live Deal Merchant Retention (Feb — Immediate): Prevent 89 dissatisfied merchants from churning",
        "NAM Onboarding Overhaul (Feb–Mar): Reduce 2M Bad sentiment from 45.3% to <38%",
        "Economics Transparency Initiative (Feb–Apr): Reduce Economics complaints from 21.0% to <15%",
        "Tier A-C Engagement Program (Ongoing): Zero Tier A-B churn in Q1",
      ]},
    ],
  },
];

// ─── Rich text renderer ───────────────────────────────────────────────────
const RichBlock = ({ block }) => {
  const base = { fontSize: 12, lineHeight: 1.75, fontFamily: "Montserrat", marginBottom: 10 };
  if (block.type === "p") return <p style={{ ...base, color: "#C4CEDE" }}>{block.text}</p>;
  if (block.type === "label") return (
    <p style={{ ...base, color: P.accent, fontWeight: 700, marginBottom: 4, marginTop: 6 }}>{block.text}</p>
  );
  if (block.type === "subsection") return (
    <p style={{ ...base, color: P.text, fontWeight: 700, fontSize: 12, marginTop: 14, marginBottom: 6, borderLeft: `3px solid ${P.accent}`, paddingLeft: 8 }}>{block.text}</p>
  );
  if (block.type === "priority") return (
    <p style={{ ...base, color: P.neutral, background: "rgba(255,181,71,0.08)", borderRadius: 6, padding: "6px 10px", marginTop: 4 }}>{block.text}</p>
  );
  if (block.type === "list") return (
    <ul style={{ paddingLeft: 16, marginBottom: 10 }}>
      {block.items.map((item, i) => (
        <li key={i} style={{ ...base, color: "#C4CEDE", marginBottom: 4 }}>{item}</li>
      ))}
    </ul>
  );
  return null;
};

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  const [sharedRegion, setSharedRegion] = useState("Global");
  const janG = MONTHLY_SENTIMENT.Global[4];
  const decG = MONTHLY_SENTIMENT.Global[3];
  const janN = MONTHLY_SENTIMENT.NAM[4];
  const decN = MONTHLY_SENTIMENT.NAM[3];
  const janI = MONTHLY_SENTIMENT.INT[4];
  const decI = MONTHLY_SENTIMENT.INT[3];

  // Resizer state — left panel width as percentage
  const [leftPct, setLeftPct] = useState(38);
  const isResizing = React.useRef(false);
  const containerRef = React.useRef(null);

  const onMouseDown = () => { isResizing.current = true; };

  React.useEffect(() => {
    const onMove = (e) => {
      if (!isResizing.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const raw = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftPct(Math.min(Math.max(raw, 20), 70));
    };
    const onUp = () => { isResizing.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const KPIs = [
    { label: "Global Good",    val: janG.Good,    prev: decG.Good,    invert: false, color: P.good    },
    { label: "Global Neutral", val: janG.Neutral, prev: decG.Neutral, invert: false, color: P.neutral },
    { label: "Global Bad",     val: janG.Bad,     prev: decG.Bad,     invert: true,  color: P.bad     },
    { label: "NAM Good",       val: janN.Good,    prev: decN.Good,    invert: false, color: P.good    },
    { label: "NAM Neutral",    val: janN.Neutral, prev: decN.Neutral, invert: false, color: P.neutral },
    { label: "NAM Bad",        val: janN.Bad,     prev: decN.Bad,     invert: true,  color: P.bad     },
    { label: "INT Good",       val: janI.Good,    prev: decI.Good,    invert: false, color: P.good    },
    { label: "INT Neutral",    val: janI.Neutral, prev: decI.Neutral, invert: false, color: P.neutral },
    { label: "INT Bad",        val: janI.Bad,     prev: decI.Bad,     invert: true,  color: P.bad     },

  ];

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body { background: ${P.bg}; color: ${P.text}; font-family: Montserrat; -webkit-font-smoothing: antialiased; overflow: hidden; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${P.border}; border-radius: 3px; }
        .resizer {
          width: 6px; cursor: col-resize; background: ${P.border}; flex-shrink: 0;
          transition: background 0.2s; position: relative; z-index: 10;
        }
        .resizer:hover, .resizer:active { background: ${P.accent}; }
        .resizer::after {
          content: ''; position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 2px; height: 40px; border-radius: 2px;
          background: ${P.muted}; opacity: 0.5;
        }
      `}</style>

      {/* FULL HEIGHT WRAPPER */}
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

        {/* ── HEADER (fixed top) ── */}
        <div style={{ padding: "14px 24px 10px", borderBottom: `1px solid ${P.border}`, flexShrink: 0, background: P.bg }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>
            Merchant Satisfaction Dashboard
          </div>
          <div style={{ fontSize: 10, color: P.muted, marginTop: 2 }}>January 2026 · MoM Analysis vs December 2025</div>
        </div>

        {/* ── KPI STRIP (fixed) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 8, padding: "10px 24px", borderBottom: `1px solid ${P.border}`, flexShrink: 0, background: P.bg }}>
          {KPIs.map((k, i) => {
            const d = k.val - k.prev;
            const isGood = k.invert ? d < 0 : d > 0;
            return (
              <div key={i} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 8, color: P.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 16, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: k.color }}>{k.val.toFixed(1)}%</div>
                <div style={{ marginTop: 3, fontSize: 9, color: isGood ? P.good : P.bad }}>
                  {d > 0 ? "▲ +" : "▼ "}{Math.abs(d).toFixed(1)}pp
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SPLIT PANELS ── */}
        <div ref={containerRef} style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* LEFT — Analysis Text */}
          <div style={{ width: `${leftPct}%`, overflowY: "auto", padding: "24px", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {ANALYSIS_CONTENT.map((section, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                    color: P.accent, marginBottom: 12, paddingBottom: 8,
                    borderBottom: `1px solid ${P.border}`,
                  }}>
                    {section.title}
                  </div>
                  {section.blocks.map((block, j) => (
                    <RichBlock key={j} block={block} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* RESIZER */}
          <div className="resizer" onMouseDown={onMouseDown} />

          {/* RIGHT — Charts */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px", minWidth: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <div style={{  }}>
                <SentimentTrend region={sharedRegion} setRegion={setSharedRegion} />
              </div>

              <div style={{  }}>
                <ResponseVolume region={sharedRegion} setRegion={setSharedRegion} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <CohortSentiment />
                <CountryChart />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <EmailEngagement />
                <LiveDealChart />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <LaunchSourceChart />
                <SpecializationChart />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <ComplaintDrivers />
                <CohortRootCause />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <MerchantPotentialChart />
                <SupplyPyramidChart />
              </div>

              <div style={{ }}>
                <CategoryChart />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
#!/usr/bin/env node
/**
 * tag_ebrw.js  — assigns SAT domain & skill to all EBRW questions
 * Run: node scripts/tag_ebrw.js
 */

const fs   = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '../src/data/ebrw_bank.json');

const questions = JSON.parse(fs.readFileSync(DATA, 'utf8'));

/* ── SAT EBRW taxonomy ─────────────────────────────────────────────────────
   Domain → [skill, …]
*/
const TAXONOMY = {
  'Information and Ideas': [
    'Central ideas and details',
    'Inferences',
    'Command of evidence (textual)',
    'Command of evidence (quantitative)',
  ],
  'Craft and Structure': [
    'Words in context',
    'Text structure and purpose',
    'Cross-text connections',
  ],
  'Expression of Ideas': [
    'Rhetorical synthesis',
    'Transitions',
  ],
  'Standard English Conventions': [
    'Boundaries',
    'Form, structure, and sense',
  ],
};

/* ── Keyword patterns for skill detection ──────────────────────────────── */
const SKILL_PATTERNS = [
  // Standard English Conventions
  { skill: 'Boundaries',               domain: 'Standard English Conventions',
    re: /\b(punctuat|comma|semicolon|colon|dash|period|run.on|fragment|sentence boundary|correctly completes the sentence)\b/i },
  { skill: 'Form, Structure, and Sense', domain: 'Standard English Conventions',
    re: /\b(verb|subject.verb|pronoun|agreement|tense|modifier|parallel|apostrophe|possessive|noun form)\b/i },

  // Expression of Ideas
  { skill: 'Transitions',              domain: 'Expression of Ideas',
    re: /\b(transition|however|furthermore|moreover|therefore|consequently|best completes the text|which.*best.*follows)\b/i },
  { skill: 'Rhetorical Synthesis',     domain: 'Expression of Ideas',
    re: /\b(note|notes|should.*emphasize|while.*highlight|student.*research|writer.*accomplish|effectively accomplish|synthesize)\b/i },

  // Craft and Structure
  { skill: 'Words in Context',         domain: 'Craft and Structure',
    re: /\b(underlined word|as used in|most nearly means|best.*meaning|replace the underlined)\b/i },
  { skill: 'Text Structure and Purpose', domain: 'Craft and Structure',
    re: /\b(main purpose|primarily (serve|function|used)|overall structure|how.*organized|strengthen.*argument|weaken|claim|counterargument|function of the (sentence|paragraph))\b/i },
  { skill: 'Cross-Text Connections',   domain: 'Craft and Structure',
    re: /\b(passage (1|2|i|ii)|text (1|2|a|b)|both authors|author.*agree|author.*disagree|cross.text|compare|contrast.*passage)\b/i },

  // Information and Ideas
  { skill: 'Command of Evidence',      domain: 'Information and Ideas',
    re: /\b(table|graph|chart|figure|data|percent|statistic|survey|according to the (table|graph|figure|chart)|most effectively (use|illustrate|complete|support)|evidence|which.*best.*support|which finding|which detail|logically complete)\b/i },
  { skill: 'Inferences',               domain: 'Information and Ideas',
    re: /\b(most likely|conclude|infer|suggest|imply|probably|reasonable to (assume|say|conclude))\b/i },
  { skill: 'Central Ideas and Details', domain: 'Information and Ideas',
    re: /\b(main (idea|point|claim|argument)|central|primarily (about|discuss|describe)|best (describes|states|summarizes)|according to the (passage|text))\b/i },
];

const DEFAULT_DOMAIN = 'Information and Ideas';
const DEFAULT_SKILL  = 'Central Ideas and Details';

function detectTag(q) {
  const haystack = `${q.question} ${(q.passage||'').slice(0, 400)}`;

  for (const {skill, domain, re} of SKILL_PATTERNS) {
    if (re.test(haystack)) return {domain, skill};
  }
  return {domain: DEFAULT_DOMAIN, skill: DEFAULT_SKILL};
}

/* ── Assign difficulty if missing (distribute roughly 40/40/20 Easy/Med/Hard) ─ */
const DIFFS = ['Easy','Easy','Medium','Medium','Hard'];
let diffIdx = 0;
function nextDiff() {
  const d = DIFFS[diffIdx % DIFFS.length];
  diffIdx++;
  return d;
}

/* Skill alias map — normalises old names to exact UI names */
const ALIAS = {
  'Central ideas and details':       'Central Ideas and Details',
  'Command of evidence (textual)':   'Command of Evidence',
  'Command of evidence (quantitative)': 'Command of Evidence',
  'Inferences':                      'Inferences',
  'Words in context':                'Words in Context',
  'Text structure and purpose':      'Text Structure and Purpose',
  'Cross-text connections':          'Cross-Text Connections',
  'Rhetorical synthesis':            'Rhetorical Synthesis',
  'Transitions':                     'Transitions',
  'Boundaries':                      'Boundaries',
  'Form, structure, and sense':      'Form, Structure, and Sense',
};

let tagged = 0;
const updated = questions.map(q => {
  const {domain, skill} = detectTag(q);
  const finalSkill  = ALIAS[q.skill] || ALIAS[skill] || skill;
  const finalDomain = q.domain || domain;
  const finalDiff   = q.difficulty || nextDiff();
  tagged++;
  return { ...q, domain: finalDomain, skill: finalSkill, difficulty: finalDiff };
});

fs.writeFileSync(DATA, JSON.stringify(updated, null, 2));
console.log(`Done. Tagged ${tagged} / ${updated.length} questions.`);
console.log('Distribution:');
const ds = {};
updated.forEach(q => { ds[q.domain] = (ds[q.domain]||0)+1; });
Object.entries(ds).sort((a,b)=>b[1]-a[1]).forEach(([d,n])=>console.log(`  ${d}: ${n}`));

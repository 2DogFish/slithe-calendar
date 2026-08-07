'use strict';

// Slithe AI Beta ontology. Canonical terms only. Expand carefully.
window.SLITHE_LEXICON = [
  {
    term:'Vivese', pos:'doctrine', category:'Strategy',
    definition:'Leave a realistic avenue for surrender or withdrawal so an opponent is not needlessly forced into desperation.',
    assertion:'analytical_judgment',
   triggers:['surrender was not offered','no opportunity to surrender','did not offer an opportunity to surrender','did not offer the defenders an opportunity to surrender','withdrawal was impossible','no route of withdrawal','escape routes were closed','denied surrender','refused surrender'],
    counterSignals:['surrender was offered','allowed to surrender','withdrawal route remained open','allowed to withdraw'],
    notes:'Absence or violation may be classified when a source explicitly indicates that a reasonable surrender or withdrawal avenue was denied. Do not infer solely from encirclement.'
  },
  {
    term:'Rures', pos:'noun', category:'Duty',
    definition:"One's assigned duty or duty period.",
    assertion:'assignment',
    triggers:['assigned duty','duty period','guard duty','watch duty','has duty'],
    notes:'Names the assigned duty itself, not the roster and not the act of rotating personnel.'
  },
  {
    term:'Rurester', pos:'noun', category:'Duty',
    definition:'Duty roster or garrison duty schedule.',
    assertion:'document_or_schedule',
    triggers:['duty roster','duty schedule','watch roster','guard roster'],
    notes:'Specifically organizes duty assignments.'
  },
  {
    term:'Spin', pos:'verb', category:'General',
    definition:'To rotate something through a sequence, cycle, position, or order.',
    assertion:'action',
    triggers:['rotate through','cycle through','rotating stock','move older products to the front','alternate through'],
    notes:'General term; not restricted to military personnel.'
  },
  {
    term:'Cebarra', pos:'epistemic', category:'Knowledge',
    definition:"The speaker does not know the answer but knows a reliable way to find it.",
    assertion:'speaker_assessment',
    triggers:['do not know but can find out','don\'t know but can find out','know how to find out'],
    notes:'Different from Turdle: Turdle lacks both the answer and a known path to obtain it.'
  },
  {
    term:'Turdle', pos:'epistemic', category:'Knowledge',
    definition:"The speaker does not know the answer and does not know how to find it.",
    assertion:'speaker_assessment',
    triggers:['do not know how to find out','don\'t know how to find out','no idea how to find out'],
    notes:'Stronger uncertainty than Cebarra.'
  },
  {
    term:'Cliwe', pos:'noun', category:'Knowledge',
    definition:'Unknown information or informational fog within a situation.',
    assertion:'analytical_judgment',
    triggers:['unknown information','information gap','unclear intelligence','unknown strength','unknown location'],
    notes:'Broader situational unknowns; not a direct answer word like Gnaw.'
  },
  {
    term:'Clawi', pos:'noun', category:'Knowledge',
    definition:'Unverified assumptions used to fill unknown information.',
    assertion:'analytical_judgment',
    triggers:['assumed without verification','unverified assumption','planners assumed','assumed that'],
    notes:'An assumption filling Cliwe.'
  },
  {
    term:'Gnaw', pos:'epistemic', category:'Knowledge',
    definition:'A genuinely unknown specific identity or fact.',
    assertion:'speaker_knowledge_state',
    triggers:['unknown source','unknown shooter','identity unknown','source unknown'],
    notes:'Used when the requested specific answer is genuinely unknown.'
  },
  {
    term:'Dripono', pos:'assessment', category:'Strategy',
    definition:'Assessed as willing to die for the immediate objective.',
    assertion:'speaker_assessment',
    triggers:['willing to die','fight to the death','prepared to die','die rather than surrender'],
    notes:'An assessment, not an objective fact about internal mental state.'
  },
  {
    term:'Snaredual', pos:'noun', category:'Strategy',
    definition:'A situation in which no realistic course of action remains.',
    assertion:'analytical_judgment',
    triggers:['no realistic option','no viable option','no way out','all options eliminated'],
    notes:'Do not equate mere encirclement with Snaredual unless realistic courses truly appear absent.'
  },
  {
    term:'Snareduel', pos:'noun', category:'Strategy',
    definition:'A situation in which only one realistic course of action remains.',
    assertion:'analytical_judgment',
    triggers:['only realistic option','only viable option','one option remained'],
    notes:'Exactly one realistic course remains.'
  },
  {
    term:'Capla', pos:'doctrine', category:'Strategy',
    definition:'Creating a no-realistic-course condition is acceptable once enemy capability has been sufficiently reduced.',
    assertion:'doctrinal_judgment',
    triggers:['incapable of meaningful resistance','combat power was destroyed','no meaningful resistance remained'],
    notes:'Potential qualifier to Vivese; insufficient evidence should remain unresolved.'
  },
  {
    term:'Smin', pos:'verb', category:'Observation',
    definition:'Observe or see a target while the speaker is confident the target did not observe the speaker.',
    assertion:'speaker_assessment',
    triggers:['observed without being seen','watched undetected','remained unseen while observing'],
    notes:'Confidence of remaining unseen is part of the assertion.'
  },
  {
    term:'Thin', pos:'verb', category:'Observation',
    definition:'Observe or see a target when concealment from the target is not confirmed or the observer is known to have been seen.',
    assertion:'speaker_assessment',
    triggers:['observed but was seen','observed without concealment','uncertain whether detected'],
    notes:'Contrasts with Smin.'
  },
  {
    term:'Pith', pos:'status', category:'Safety',
    definition:'Speaker asserts that an area or thing has been proven or verified safe.',
    assertion:'speaker_assertion',
    triggers:['verified safe','proven safe','confirmed safe'],
    notes:'Stronger than Save; proof or verification is asserted.'
  },
  {
    term:'Save', pos:'status', category:'Safety',
    definition:'Safe to inhabit or occupy right now; no proof is implied.',
    assertion:'speaker_assessment',
    triggers:['safe right now','safe to occupy','safe to inhabit'],
    notes:'Does not assert verification.'
  },
  {
    term:'Piter', pos:'status', category:'Security',
    definition:'A room or area has been searched and is clear of the immediate threat being searched for.',
    assertion:'operational_status',
    triggers:['room clear','area clear','cleared the room','searched and clear'],
    notes:'May be Piter without being Pith.'
  },
  {
    term:'Durn', pos:'conjunction_or_preposition', category:'Grammar',
    definition:'While or during; marks temporal overlap between an action, condition, event, or period and another.',
    assertion:'temporal_relation',
    triggers:['while','during','at the same time as'],
    notes:'Temporal overlap only; does not itself assert cause, sequence, or condition.'
  },
  {
    term:'Spludu', pos:'concept', category:'Social',
    definition:'Literally a chimpanzee throwing feces; figuratively an extreme form of pettiness.',
    assertion:'speaker_judgment',
    triggers:['extreme pettiness','purely spiteful','petty retaliation','spite for its own sake'],
    notes:'The literal image is a chimpanzee throwing feces.'
  },
  {
    term:'Slubble', pos:'concept', category:'Development',
    definition:'Literally an infant walking; figuratively an early stage of independent function that remains immature and unstable.',
    assertion:'metaphorical_classification',
    triggers:['first independent stage','early functional stage','infant walking'],
    notes:'Literal image is specifically an infant walking.'
  }
];

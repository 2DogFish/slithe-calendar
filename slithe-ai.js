'use strict';

(function(){
  const lexicon = window.SLITHE_LEXICON || [];
  const $ = id => document.getElementById(id);

  function norm(s){ return String(s || '').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim(); }
  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function phraseHit(text, phrase){
    const p = norm(phrase);
    return p && text.includes(p);
  }

  function classify(input){
    const text = norm(input);
    const results = [];
    for(const entry of lexicon){
      const hits = (entry.triggers || []).filter(t => phraseHit(text,t));
      const counters = (entry.counterSignals || []).filter(t => phraseHit(text,t));
      if(!hits.length && !counters.length) continue;

      let state = 'POSSIBLE';
      let score = 0;
      if(hits.length){ score += Math.min(0.92, 0.58 + hits.length * 0.12); state = 'PRESENT'; }
      if(counters.length){
        if(entry.term === 'Vivese') state = 'PRESENT';
        else state = hits.length ? 'DISPUTED' : 'ABSENT';
      }

      if(entry.term === 'Vivese'){
        if(hits.some(h => /not offered|no opportunity|impossible|no route|closed|denied|refused/.test(h))){
          state = 'VIOLATED'; score = Math.max(score,0.86);
        }
        if(counters.length && !hits.length){ state='PRESENT'; score=0.86; }
      }

      results.push({entry,state,score:Math.min(score || .55,.99),hits,counters});
    }
    return results.sort((a,b)=>b.score-a.score);
  }

  const directMap = [
    [/\bwhile\b|\bduring\b/gi,'Durn'],
    [/\bduty roster\b/gi,'Rurester'],
    [/\bduty period\b|\bassigned duty\b/gi,'Rures'],
    [/\brotate through\b|\bcycle through\b/gi,'Spin'],
    [/\bverified safe\b|\bproven safe\b/gi,'Pith'],
    [/\broom clear\b|\barea clear\b/gi,'Piter']
  ];

  function betaTranslation(input){
    let output = input;
    let changed = false;
    for(const [re,term] of directMap){
      if(re.test(output)){ changed=true; output = output.replace(re,term); }
      re.lastIndex=0;
    }
    return {output, changed};
  }

  function render(input){
    const classifications = classify(input);
    const trans = betaTranslation(input);
    $('slitheTranslation').innerHTML = trans.changed
      ? `<strong>${esc(trans.output)}</strong><br><small>Beta lexical substitution only. Untranslated English remains English rather than being guessed.</small>`
      : `<span class="muted-copy">No safe direct translation available from the current beta grammar. Classification may still be possible.</span>`;

    if(!classifications.length){
      $('slitheClassifications').innerHTML = '<p class="muted-copy">No supported Slithe concept was detected. This does not mean none applies; the beta ontology is intentionally small.</p>';
      return;
    }

    $('slitheClassifications').innerHTML = classifications.map(r => {
      const pct = Math.round(r.score*100);
      return `<article class="ai-hit">
        <div class="ai-hit-head"><strong>${esc(r.entry.term)}</strong><span>${esc(r.state)} · ${pct}%</span></div>
        <p>${esc(r.entry.definition)}</p>
        <small>${esc(r.entry.notes || '')}</small>
      </article>`;
    }).join('');
  }

  function lookup(q){
    const query = norm(q);
    if(!query) return [];
    return lexicon.filter(e => norm(e.term).includes(query) || norm(e.definition).includes(query) || norm(e.category).includes(query));
  }

  function renderLookup(q){
    const hits = lookup(q).slice(0,12);
    $('lexiconResults').innerHTML = hits.length ? hits.map(e => `<article class="lex-hit"><strong>${esc(e.term)}</strong><span>${esc(e.category)} · ${esc(e.pos)}</span><p>${esc(e.definition)}</p><small>${esc(e.notes || '')}</small></article>`).join('') : '<p class="muted-copy">No matching beta term.</p>';
  }

  const form = $('slitheAiForm');
  if(form){
    form.addEventListener('submit', e => { e.preventDefault(); render($('slitheAiInput').value); });
    $('slitheExample').addEventListener('click', () => {
      $('slitheAiInput').value = 'The occupying force did not offer the defenders an opportunity to surrender.';
      render($('slitheAiInput').value);
    });
  }

  const search = $('lexiconSearch');
  if(search){ search.addEventListener('input', () => renderLookup(search.value)); renderLookup(''); }
})();

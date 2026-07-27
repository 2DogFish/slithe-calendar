'use strict';

const CST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 86400000;

const WEEKDAYS = ['Menar', 'Munare', 'Thundrin', 'Sarathra', 'Shivonte', 'Siolo', 'Ziar'];
const MANEWE_DAYS = [
  { name: 'Glepto', glyph: '🐒' },
  { name: 'Glepta', glyph: '🐒' }
];

const MOLOS = [
  ['Clethra','Eagle','🦅'], ['Telo','Turtle','🐢'], ['Maptra','Crocodile','🐊'],
  ['Nepthor','Crab','🦀'], ['Dini','Dolphin','🐬'], ['Melo','Rabbit','🐇'],
  ['Fova','Fox','🦊'], ['Octon','Octopus','🐙'], ['Unuthru','Python','🐍'],
  ['Glalgara','Spider','🕷️'], ['Ilia','Praying Mantis','🦗'], ['Benart','Bat','🦇'],
  ['Zebar','Tiger','🐅']
];

const ELCETRE = ['Elcetre','Eel','〰'];

const $ = id => document.getElementById(id);

const cstParts = date => {
  const shifted = new Date(date.getTime() + CST_OFFSET_MS);
  return {
    y: shifted.getUTCFullYear(),
    m: shifted.getUTCMonth() + 1,
    d: shifted.getUTCDate(),
    h: shifted.getUTCHours(),
    min: shifted.getUTCMinutes(),
    s: shifted.getUTCSeconds()
  };
};

const cstDayNumber = date => {
  const p = cstParts(date);
  return Math.floor(Date.UTC(p.y, p.m - 1, p.d) / DAY_MS);
};

const utcFromCst = (y,m,d,h=0,min=0,s=0) => new Date(Date.UTC(y,m-1,d,h-9,min,s));
const cstStartOfDay = date => { const p = cstParts(date); return utcFromCst(p.y,p.m,p.d); };
const formatCstDate = date => new Intl.DateTimeFormat('en-US',{timeZone:'UTC',year:'numeric',month:'long',day:'numeric'}).format(new Date(date.getTime()+CST_OFFSET_MS));
const formatCstDateTime = date => new Intl.DateTimeFormat('en-US',{timeZone:'UTC',year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true}).format(new Date(date.getTime()+CST_OFFSET_MS))+' CST';

const formatDuration = ms => {
  ms = Math.max(0, ms);
  const days = Math.floor(ms / DAY_MS);
  const hrs = Math.floor(ms % DAY_MS / 3600000);
  const mins = Math.floor(ms % 3600000 / 60000);
  return days ? `${days}d ${hrs}h ${mins}m` : `${hrs}h ${mins}m`;
};

function decemberSolstice(year){ return Astronomy.Seasons(year).dec_solstice.date; }
function juneSolstice(year){ return Astronomy.Seasons(year).jun_solstice.date; }

function firstNewMoonAfter(date){
  let q = Astronomy.SearchMoonQuarter(date);
  while(q.quarter !== 0) q = Astronomy.NextMoonQuarter(q);
  return q.time.date;
}

function nextNewMoonAfter(date){ return firstNewMoonAfter(new Date(date.getTime()+1000)); }

function wholgaNumber(startYear){
  const n = startYear - 1943;
  return n > 0 ? n : n - 1; // no year zero: Wholga 1 is preceded by Morgra 1
}

function yearLabel(number){
  return number >= 1 ? `Wholga ${number}` : `Morgra ${Math.abs(number)}`;
}

function findWholgaBounds(date){
  const p = cstParts(date);
  const sol = decemberSolstice(p.y);
  const start = cstDayNumber(date) >= cstDayNumber(sol) ? sol : decemberSolstice(p.y-1);
  const startYear = cstParts(start).y;
  const end = decemberSolstice(startYear+1);
  return {
    startEvent: start,
    endEvent: end,
    startDay: cstStartOfDay(start),
    endDay: cstStartOfDay(end),
    startYear,
    number: wholgaNumber(startYear)
  };
}

function buildWholga(date){
  const w = findWholgaBounds(date);
  const periods = [];
  const firstMoon = firstNewMoonAfter(w.startEvent);

  periods.push({
    type: 'elcetre',
    name: ELCETRE[0],
    animal: ELCETRE[1],
    glyph: ELCETRE[2],
    start: w.startDay,
    end: cstStartOfDay(firstMoon)
  });

  let moon = firstMoon;
  let i = 0;
  while(cstDayNumber(moon) < cstDayNumber(w.endEvent) && i < 13){
    const next = nextNewMoonAfter(moon);
    const info = MOLOS[i];
    periods.push({
      type: 'molo',
      index: i+1,
      name: info[0],
      animal: info[1],
      glyph: info[2],
      start: cstStartOfDay(moon),
      end: cstStartOfDay(next)
    });
    moon = next;
    i++;
  }

  return {
    ...w,
    carpanyaDay: cstStartOfDay(juneSolstice(w.startYear+1)),
    periods
  };
}

function slitheFor(date){
  const wholga = buildWholga(date);
  const dn = cstDayNumber(date);
  let period = wholga.periods.find(p => dn >= cstDayNumber(p.start) && dn < cstDayNumber(p.end));

  if(!period){
    period = wholga.periods[wholga.periods.length-1];
  }

  const day = dn - cstDayNumber(period.start) + 1;
  const periodLength = cstDayNumber(period.end) - cstDayNumber(period.start);
  const isManewe = period.type === 'molo' && day > 28;
  const displayDay = isManewe ? day - 28 : day;
  const weekdayNumber = period.type === 'molo' && !isManewe ? ((day-1)%7)+1 : null;
  const holidays = [];

  if(dn === cstDayNumber(wholga.startDay)) holidays.push('Ardanna');
  if(period.type === 'elcetre' && day === periodLength) holidays.push('Arrovona');
  if(dn === cstDayNumber(wholga.carpanyaDay)) holidays.push('Carpanya');

  return {
    wholga: wholga.number,
    wholgaData: wholga,
    period,
    day,
    periodLength,
    displayDay,
    isManewe,
    manewe: isManewe ? MANEWE_DAYS[displayDay-1] : null,
    week: period.type === 'molo' && !isManewe ? Math.ceil(day/7) : null,
    weekday: weekdayNumber,
    weekdayName: weekdayNumber ? WEEKDAYS[weekdayNumber-1] : null,
    holidays,
    era: wholga.number >= 1 ? 'Wholga' : 'Morgra'
  };
}

function notation(s){
  const year = yearLabel(s.wholga);
  let base;

  if(s.period.type === 'elcetre') base = `${year}/Elcetre ${s.day}`;
  else if(s.isManewe) base = `${year}/${s.period.name}’${s.manewe.name}`;
  else base = `${year}/${s.period.name} ${s.day}`;

  return s.holidays.length ? `${base} — ${s.holidays.join(' · ')}` : base;
}

function detail(s){
  if(s.period.type === 'elcetre'){
    const holiday = s.holidays.length ? ` · Holiday: ${s.holidays.join(' · ')}` : '';
    return `Elcetre — ${s.period.animal} · Day ${s.day} of ${s.periodLength}${holiday}`;
  }

  if(s.isManewe){
    return `${s.manewe.name} · ${s.displayDay === 1 ? 'First' : 'Second'} Manewe day · Outside the weeks`;
  }

  const holiday = s.holidays.length ? ` · Holiday: ${s.holidays.join(' · ')}` : '';
  return `${s.period.name} — ${s.period.animal} · Week ${s.week} · ${s.weekdayName}${holiday}`;
}

function displayGlyph(s){ return s.isManewe ? s.manewe.glyph : s.period.glyph; }
function displayName(s){
  if(s.isManewe) return s.manewe.name.toUpperCase();
  if(s.holidays.length) return s.holidays.join(' · ').toUpperCase();
  return s.period.name.toUpperCase();
}

function nextCstMidnight(date){ const p = cstParts(date); return utcFromCst(p.y,p.m,p.d+1); }

function renderLive(){
  if(!window.Astronomy){ $('slitheDate').textContent='Astronomy library unavailable'; return; }

  const now = new Date();
  const s = slitheFor(now);

  $('slitheDate').textContent = notation(s);
  $('eraLabel').textContent = `${s.era.toUpperCase()} ERA`;
  $('periodDetail').textContent = detail(s);
  $('cstClock').textContent = formatCstDateTime(now);
  $('gregorianDate').textContent = formatCstDate(now);
  $('animalGlyph').textContent = displayGlyph(s);
  $('animalName').textContent = displayName(s);
  $('nextDay').textContent = formatDuration(nextCstMidnight(now)-now);

  const nextMoloEvent = firstNewMoonAfter(nextCstMidnight(now));
  const nextMoloStart = cstStartOfDay(nextMoloEvent);
  const nextMolo = slitheFor(nextMoloStart);
  $('nextMoon').textContent = `${nextMolo.period.glyph} ${nextMolo.period.name} · ${formatDuration(nextMoloStart-now)} · ${formatCstDate(nextMoloStart)}`;

  $('nextWholga').textContent = `Ardanna · ${formatDuration(s.wholgaData.endDay-now)} · ${formatCstDate(s.wholgaData.endDay)}`;
  renderPeriods(s);
}

let renderedWholga = null;
function renderPeriods(s){
  if(renderedWholga === s.wholga){
    document.querySelectorAll('.period').forEach(el => el.classList.toggle('current', el.dataset.name === s.period.name));
    return;
  }

  renderedWholga = s.wholga;
  $('wholgaHeading').textContent = `${yearLabel(s.wholga)} sequence`;
  $('periodList').innerHTML = s.wholgaData.periods.map(p =>
    `<div class="period ${p.name===s.period.name?'current':''}" data-name="${p.name}">` +
      `<span class="icon">${p.glyph}</span>` +
      `<div><strong>${p.name}</strong><br><small>${p.animal}${p.index?` · Molo ${p.index}`:' · Begins with Ardanna; ends with Arrovona'}</small></div>` +
      `<time>${formatCstDate(p.start)}</time>` +
    `</div>`
  ).join('');
}

function localInputNow(){
  const p = cstParts(new Date());
  return `${p.y}-${String(p.m).padStart(2,'0')}-${String(p.d).padStart(2,'0')}T${String(p.h).padStart(2,'0')}:${String(p.min).padStart(2,'0')}`;
}

$('converterInput').value = localInputNow();
$('converterForm').addEventListener('submit', e => {
  e.preventDefault();
  const raw = $('converterInput').value;

  try {
    const [datePart,timePart='00:00'] = raw.split('T');
    const [y,m,d] = datePart.split('-').map(Number);
    const [h,min] = timePart.split(':').map(Number);
    const dt = utcFromCst(y,m,d,h,min);
    const s = slitheFor(dt);
    $('converterResult').innerHTML = `<strong>${displayGlyph(s)} ${notation(s)}</strong><br>${detail(s)}<br><small>${formatCstDateTime(dt)}</small>`;
  } catch(err){
    $('converterResult').innerHTML = '<span class="error">The date could not be converted.</span>';
  }
});

try { renderLive(); setInterval(renderLive,1000); }
catch(err){
  console.error(err);
  $('slitheDate').textContent = 'Calendar calculation error';
  $('periodDetail').textContent = err.message;
}

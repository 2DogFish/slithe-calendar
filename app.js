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
const PERIOD_ABBREVIATIONS = {
  Elcetre: 'El',
  Clethra: 'Cl',
  Telo: 'Te',
  Maptra: 'Ma',
  Nepthor: 'Ne',
  Dini: 'Di',
  Melo: 'Me',
  Fova: 'Fo',
  Octon: 'Oc',
  Unuthru: 'Un',
  Glalgara: 'Gl',
  Ilia: 'Il',
  Benart: 'Be'
};

const ZEBARS = {
  3:  { name: 'Zebar Bala',     abbreviation: 'Zb' },
  6:  { name: 'Zebar Enoe',     abbreviation: 'Ze' },
  8:  { name: 'Zebar Clarmone', abbreviation: 'Zc' },
  11: { name: 'Zebar Zioda',    abbreviation: 'Zd' },
  14: { name: 'Zebar Onartra',  abbreviation: 'Zo' },
  17: { name: 'Zebar Ulecio',   abbreviation: 'Zu' },
  19: { name: 'Zebar Zihatta',  abbreviation: 'Zh' }
};
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
const formatCstDateTime = date => {
  const cst = new Date(date.getTime() + CST_OFFSET_MS);

  const year = cst.getUTCFullYear();
  const displayYear = year <= 0 ? `${1 - year} BC` : `${year} AD`;

  const month = cst.toLocaleString('en-US', {
    timeZone: 'UTC',
    month: 'short'
  });

  const day = cst.getUTCDate();

  const time = cst.toLocaleString('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return `${month} ${day}, ${displayYear} ${time} CST`;
};
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
  return n > 0 ? n : n - 1;
}

function eraForWholga(number){
  if(number >= 1){
    return {
      type: 'E',
      cycleName: 'Eoe',
      yearName: 'Wholga',
      cycle: Math.floor((number - 1) / 19) + 1,
      year: ((number - 1) % 19) + 1
    };
  }
  const distance = Math.abs(number);

  return {
    type: 'O',
    cycleName: 'Oeo',
    yearName: 'Morgra',
    cycle: Math.floor((distance - 1) / 19) + 1,
    year: 19 - ((distance - 1) % 19)
  };
}


function yearLabel(number){
  const era = eraForWholga(number);
  return `${era.type}${era.cycle}/${era.year}`;
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
  abbreviation: PERIOD_ABBREVIATIONS.Elcetre,
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
const era = eraForWholga(w.number);
const zebar = i === 12 ? ZEBARS[era.year] : null;
const periodName = zebar ? zebar.name : info[0];

periods.push({
  type: 'molo',
  index: i + 1,
  name: periodName,
  abbreviation: zebar
    ? zebar.abbreviation
    : PERIOD_ABBREVIATIONS[periodName],
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
   era: eraForWholga(wholga.number)
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
 $('eraLabel').textContent =
  `${s.era.cycleName.toUpperCase()} ${s.era.cycle} · ${s.era.yearName.toUpperCase()} ${s.era.year}`;
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

$('converterYear').value = cstParts(new Date()).y;
$('converterMonth').value = cstParts(new Date()).m;
$('converterDay').value = cstParts(new Date()).d;
$('converterHour').value = cstParts(new Date()).h;
$('converterMinute').value = cstParts(new Date()).min;
$('converterEra').value = 'AD';

$('converterForm').addEventListener('submit', e => {
  e.preventDefault();

  const year = Number($('converterYear').value);
  const era = $('converterEra').value;
  const month = Number($('converterMonth').value);
  const day = Number($('converterDay').value);
  const hour = Number($('converterHour').value);
  const minute = Number($('converterMinute').value);

  const astronomicalYear = era === 'BC'
    ? 1 - year
    : year;

  try {
    const dt = utcFromCst(
      astronomicalYear,
      month,
      day,
      hour,
      minute
    );

    const s = slitheFor(dt);

    $('converterResult').innerHTML =
      `<strong>${displayGlyph(s)} ${notation(s)}</strong><br>` +
      `${detail(s)}<br>` +
      `<small>${formatCstDateTime(dt)}</small>`;

  } catch(err){
    $('converterResult').innerHTML =
      '<span class="error">The date could not be converted.</span>';
  }
});

try { renderLive(); setInterval(renderLive,1000); }
catch(err){
  console.error(err);
  $('slitheDate').textContent = 'Calendar calculation error';
  $('periodDetail').textContent = err.message;
}

// Square calendar view
let calendarAnchor = new Date();

function addCstDays(date, days){
  return new Date(cstStartOfDay(date).getTime() + days * DAY_MS);
}

function shortGregorian(date){
  return new Intl.DateTimeFormat('en-US', {
    timeZone:'UTC', month:'short', day:'numeric'
  }).format(new Date(date.getTime() + CST_OFFSET_MS));
}

function inputValueForCstDate(date){
  const p = cstParts(date);
  return `${p.y}-${String(p.m).padStart(2,'0')}-${String(p.d).padStart(2,'0')}T12:00`;
}

function calendarDayButton(date, s, label){
  const isToday = cstDayNumber(date) === cstDayNumber(new Date());
  const holidayText = s.holidays.join(' · ');
  const classes = ['calendar-day'];
  if(isToday) classes.push('today');
  if(holidayText) classes.push('holiday');
  return `<button type="button" class="${classes.join(' ')}" data-calendar-date="${date.toISOString()}">` +
    `<span class="calendar-day-glyph">${displayGlyph(s)}</span>` +
    `<span class="calendar-day-number">${label}</span>` +
    `<span class="calendar-day-date">${shortGregorian(date)}</span>` +
    (holidayText ? `<span class="calendar-day-holiday">${holidayText}</span>` : '') +
  `</button>`;
}

function renderSquareCalendar(anchor = calendarAnchor){
  calendarAnchor = anchor;
  const s = slitheFor(anchor);
  const p = s.period;
  const year = yearLabel(s.wholga);
  const grid = $('calendarGrid');
  const weekdayRow = $('calendarWeekdays');
  const maneweRow = $('maneweRow');

  $('calendarHeading').textContent = p.type === 'molo'
    ? `${p.glyph} ${year} · ${p.name}`
    : `${p.glyph} ${year} · Elcetre`;

  $('calendarSubheading').textContent = p.type === 'molo'
    ? `${p.animal} · Molo ${p.index} · ${formatCstDate(p.start)}–${formatCstDate(addCstDays(p.end,-1))}`
    : `${p.animal} · Outside the weekly cycle · ${formatCstDate(p.start)}–${formatCstDate(addCstDays(p.end,-1))}`;

  if(p.type === 'molo'){
    weekdayRow.hidden = false;
    weekdayRow.innerHTML = WEEKDAYS.map(d => `<span>${d}</span>`).join('');
    grid.classList.remove('elcetre-grid');

    const regularDays = Math.min(28, s.periodLength);
    let html = '';
    for(let i=0;i<regularDays;i++){
      const date = addCstDays(p.start,i);
      html += calendarDayButton(date, slitheFor(date), i+1);
    }
    grid.innerHTML = html;

    const extra = Math.max(0, s.periodLength - 28);
    if(extra){
      maneweRow.hidden = false;
      maneweRow.innerHTML = Array.from({length:extra},(_,i) => {
        const date = addCstDays(p.start,28+i);
        const day = slitheFor(date);
        const today = cstDayNumber(date) === cstDayNumber(new Date()) ? ' today' : '';
        return `<button type="button" class="manewe-day${today}" data-calendar-date="${date.toISOString()}">` +
          `<strong>🐒 ${day.manewe.name}</strong>` +
          `<span>${shortGregorian(date)} · Outside the weekly cycle</span>` +
        `</button>`;
      }).join('');
    } else {
      maneweRow.hidden = true;
      maneweRow.innerHTML = '';
    }
  } else {
    weekdayRow.hidden = true;
    grid.classList.add('elcetre-grid');
    maneweRow.hidden = true;
    maneweRow.innerHTML = '';
    grid.innerHTML = Array.from({length:s.periodLength},(_,i) => {
      const date = addCstDays(p.start,i);
      const day = slitheFor(date);
      const label = day.holidays.includes('Arrovona') ? 'Arrovona' : i+1;
      return calendarDayButton(date, day, label);
    }).join('');
  }
}

function moveCalendarPeriod(direction){
  const s = slitheFor(calendarAnchor);
  const target = direction < 0 ? addCstDays(s.period.start,-1) : s.period.end;
  renderSquareCalendar(target);
}

$('calendarPrev').addEventListener('click', () => moveCalendarPeriod(-1));
$('calendarNext').addEventListener('click', () => moveCalendarPeriod(1));
$('calendarToday').addEventListener('click', () => renderSquareCalendar(new Date()));

function chooseCalendarDate(event){
  const button = event.target.closest('[data-calendar-date]');
  if(!button) return;
  const date = new Date(button.dataset.calendarDate);
  $('converterInput').value = inputValueForCstDate(date);
  const chosen = slitheFor(date);
  $('converterResult').innerHTML = `<strong>${displayGlyph(chosen)} ${notation(chosen)}</strong><br>${detail(chosen)}<br><small>${formatCstDateTime(date)}</small>`;
  $('converterResult').scrollIntoView({behavior:'smooth',block:'nearest'});
}

$('calendarGrid').addEventListener('click', chooseCalendarDate);
$('maneweRow').addEventListener('click', chooseCalendarDate);
renderSquareCalendar(calendarAnchor);

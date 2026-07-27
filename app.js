'use strict';

const CST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 86400000;
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
  return { y:shifted.getUTCFullYear(), m:shifted.getUTCMonth()+1, d:shifted.getUTCDate(), h:shifted.getUTCHours(), min:shifted.getUTCMinutes(), s:shifted.getUTCSeconds() };
};
const cstDayNumber = date => {
  const p = cstParts(date);
  return Math.floor(Date.UTC(p.y,p.m-1,p.d)/DAY_MS);
};
const utcFromCst = (y,m,d,h=0,min=0,s=0) => new Date(Date.UTC(y,m-1,d,h-9,min,s));
const cstStartOfDay = date => { const p=cstParts(date); return utcFromCst(p.y,p.m,p.d); };
const formatCstDate = date => new Intl.DateTimeFormat('en-US',{timeZone:'UTC',year:'numeric',month:'long',day:'numeric'}).format(new Date(date.getTime()+CST_OFFSET_MS));
const formatCstDateTime = date => new Intl.DateTimeFormat('en-US',{timeZone:'UTC',year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true}).format(new Date(date.getTime()+CST_OFFSET_MS))+' CST';
const formatDuration = ms => {
  ms=Math.max(0,ms); const days=Math.floor(ms/DAY_MS); const hrs=Math.floor(ms%DAY_MS/3600000); const mins=Math.floor(ms%3600000/60000);
  return days ? `${days}d ${hrs}h ${mins}m` : `${hrs}h ${mins}m`;
};

function decemberSolstice(year){ return Astronomy.Seasons(year).dec_solstice.date; }
function firstNewMoonAfter(date){
  let q=Astronomy.SearchMoonQuarter(date);
  while(q.quarter!==0) q=Astronomy.NextMoonQuarter(q);
  return q.time.date;
}
function nextNewMoonAfter(date){ return firstNewMoonAfter(new Date(date.getTime()+1000)); }
function wholgaNumber(startYear){
  const n=startYear-1943;
  return n>0?n:n-1; // no Wholga 0
}
function findWholgaBounds(date){
  const p=cstParts(date);
  let sol=decemberSolstice(p.y);
  let start = cstDayNumber(date)>=cstDayNumber(sol) ? sol : decemberSolstice(p.y-1);
  let startYear=cstParts(start).y;
  let end=decemberSolstice(startYear+1);
  return {startEvent:start,endEvent:end,startDay:cstStartOfDay(start),endDay:cstStartOfDay(end),startYear,number:wholgaNumber(startYear)};
}
function buildWholga(date){
  const w=findWholgaBounds(date);
  const periods=[];
  const firstMoon=firstNewMoonAfter(w.startEvent);
  periods.push({type:'elcetre',name:'Elcetre',animal:'Eel',glyph:'〰',start:w.startDay,end:cstStartOfDay(firstMoon)});
  let moon=firstMoon; let i=0;
  while(cstDayNumber(moon)<cstDayNumber(w.endEvent) && i<13){
    const next=nextNewMoonAfter(moon);
    const info=MOLOS[i];
    periods.push({type:'molo',index:i+1,name:info[0],animal:info[1],glyph:info[2],start:cstStartOfDay(moon),end:cstStartOfDay(next)});
    moon=next; i++;
  }
  return {...w,periods};
}
function slitheFor(date){
  const wholga=buildWholga(date);
  const dn=cstDayNumber(date);
  let period=wholga.periods.find(p=>dn>=cstDayNumber(p.start)&&dn<cstDayNumber(p.end));
  if(!period){
    // Rare boundary safety: rebuild against adjacent Wholga.
    period=wholga.periods[wholga.periods.length-1];
  }
  const day=dn-cstDayNumber(period.start)+1;
  const isManewe=period.type==='molo'&&day>28;
  const displayDay=isManewe?day-28:day;
  return {
    wholga:wholga.number, wholgaData:wholga, period, day, displayDay, isManewe,
    week:period.type==='molo'&&!isManewe?Math.ceil(day/7):null,
    weekday:period.type==='molo'&&!isManewe?((day-1)%7)+1:null,
    era:wholga.number>=1?'Nuclear Age':'Old World'
  };
}
function notation(s){
  if(s.period.type==='elcetre') return `Wholga ${s.wholga}/Elcetre ${s.day}`;
  if(s.isManewe) return `Wholga ${s.wholga}/${s.period.name}’Manewe ${s.displayDay}`;
  return `Wholga ${s.wholga}/${s.period.name} ${s.day}`;
}
function detail(s){
  if(s.period.type==='elcetre') return `Elcetre — ${s.period.animal} · Opening period`;
  if(s.isManewe) return `${s.period.name} — ${s.period.animal} · Manewe, outside the weeks`;
  return `${s.period.name} — ${s.period.animal} · Week ${s.week}, Day ${s.weekday}`;
}
function nextCstMidnight(date){ const p=cstParts(date); return utcFromCst(p.y,p.m,p.d+1); }

function renderLive(){
  if(!window.Astronomy){ $('slitheDate').textContent='Astronomy library unavailable'; return; }
  const now=new Date(); const s=slitheFor(now);
  $('slitheDate').textContent=notation(s); $('eraLabel').textContent=s.era.toUpperCase(); $('periodDetail').textContent=detail(s);
  $('cstClock').textContent=formatCstDateTime(now); $('gregorianDate').textContent=formatCstDate(now);
  $('animalGlyph').textContent=s.period.glyph; $('animalName').textContent=s.isManewe?'MANEWE':s.period.name.toUpperCase();
  $('nextDay').textContent=formatDuration(nextCstMidnight(now)-now);
  const nm=nextNewMoonAfter(now); $('nextMoon').textContent=`${formatDuration(nm-now)} · ${formatCstDateTime(nm)}`;
  $('nextWholga').textContent=`${formatDuration(s.wholgaData.endEvent-now)} · ${formatCstDateTime(s.wholgaData.endEvent)}`;
  renderPeriods(s);
}
let renderedWholga=null;
function renderPeriods(s){
  if(renderedWholga===s.wholga) {
    document.querySelectorAll('.period').forEach(el=>el.classList.toggle('current',el.dataset.name===s.period.name)); return;
  }
  renderedWholga=s.wholga; $('wholgaHeading').textContent=`Wholga ${s.wholga} sequence`;
  $('periodList').innerHTML=s.wholgaData.periods.map(p=>`<div class="period ${p.name===s.period.name?'current':''}" data-name="${p.name}"><span class="icon">${p.glyph}</span><div><strong>${p.name}</strong><br><small>${p.animal}${p.index?` · Molo ${p.index}`:''}</small></div><time>${formatCstDate(p.start)}</time></div>`).join('');
}
function localInputNow(){ const p=cstParts(new Date()); return `${p.y}-${String(p.m).padStart(2,'0')}-${String(p.d).padStart(2,'0')}T${String(p.h).padStart(2,'0')}:${String(p.min).padStart(2,'0')}`; }
$('converterInput').value=localInputNow();
$('converterForm').addEventListener('submit',e=>{
  e.preventDefault(); const raw=$('converterInput').value;
  try { const [datePart,timePart='00:00']=raw.split('T'); const [y,m,d]=datePart.split('-').map(Number); const [h,min]=timePart.split(':').map(Number); const dt=utcFromCst(y,m,d,h,min); const s=slitheFor(dt);
    $('converterResult').innerHTML=`<strong>${notation(s)}</strong><br>${detail(s)}<br><small>${formatCstDateTime(dt)}</small>`;
  } catch(err){ $('converterResult').innerHTML='<span class="error">The date could not be converted.</span>'; }
});

try { renderLive(); setInterval(renderLive,1000); }
catch(err){ console.error(err); $('slitheDate').textContent='Calendar calculation error'; $('periodDetail').textContent=err.message; }

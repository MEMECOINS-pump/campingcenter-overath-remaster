/**
 * Blocking first-paint boot: opening status, consent, a11y prefs, fav count, scroll solid.
 * Runs as is:inline so there is no flash of pending/wrong chrome.
 */
import { schedulePayload } from '@/lib/opening-hours';
import { holidaysAround } from '@/data/holidays';

export function buildBootScript(): string {
  const year = new Date().getFullYear();
  const payload = {
    schedule: schedulePayload(),
    holidays: holidaysAround(year)
      .concat(holidaysAround(year + 1))
      .filter((h, i, arr) => arr.findIndex((x) => x.date === h.date) === i),
  };
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');

  return `(function(){
var D=${json};
var html=document.documentElement;
html.classList.add('js');
try{
  var raw=localStorage.getItem('cco:consent');
  if(raw){var p=JSON.parse(raw);if(p&&p.v===1)html.classList.add('consent-known');else html.classList.add('needs-consent');}
  else html.classList.add('needs-consent');
}catch(e){html.classList.add('needs-consent');}
try{
  var a11yRaw=localStorage.getItem('cco:a11y')||localStorage.getItem('cco-a11y');
  if(a11yRaw){
    var a=JSON.parse(a11yRaw);
    if(a&&typeof a==='object'&&!Array.isArray(a)){
      var font=a.font==='sm'||a.font==='lg'?a.font:'md';
      html.dataset.a11yFont=font;
      html.classList.toggle('a11y-font-sm',font==='sm');
      html.classList.toggle('a11y-font-lg',font==='lg');
      if(a.contrast)html.classList.add('a11y-contrast');
      if(a.reduceMotion)html.classList.add('a11y-reduce-motion');
      if(a.readable)html.classList.add('a11y-readable');
      if(a.links)html.classList.add('a11y-links');
    }else if(Array.isArray(a)){
      if(a.indexOf('text-lg')>=0){html.classList.add('a11y-font-lg');html.dataset.a11yFont='lg';}
      if(a.indexOf('contrast')>=0)html.classList.add('a11y-contrast');
      if(a.indexOf('reduce-motion')>=0)html.classList.add('a11y-reduce-motion');
      if(a.indexOf('readable')>=0)html.classList.add('a11y-readable');
      if(a.indexOf('links')>=0)html.classList.add('a11y-links');
    }
  }
}catch(e){}
try{
  var favs=JSON.parse(localStorage.getItem('cco:favorites')||'[]');
  if(Array.isArray(favs)&&favs.length){html.dataset.favCount=String(favs.length);}
}catch(e){}
function berlin(){
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Berlin',weekday:'long',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
  var g=function(t){var x=parts.find(function(p){return p.type===t;});return x?x.value:'';};
  return{day:g('weekday'),minutes:Number(g('hour'))*60+Number(g('minute')),iso:g('year')+'-'+g('month')+'-'+g('day')};
}
function toMin(s){return Number(s.slice(0,2))*60+Number(s.slice(3,5));}
function addDays(iso,n){
  var p=iso.split('-').map(Number);
  var dt=new Date(p[0],p[1]-1,p[2]+n);
  return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0');
}
var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function nextOpen(fromIso,fromMin){
  for(var offset=0;offset<14;offset++){
    var iso=addDays(fromIso,offset);
    if(D.holidays.some(function(h){return h.date===iso;}))continue;
    var di=new Date(Number(iso.slice(0,4)),Number(iso.slice(5,7))-1,Number(iso.slice(8,10))).getDay();
    var day=days[di];
    var hours=null;
    for(var i=0;i<D.schedule.length;i++){if(D.schedule[i].d===day){hours=D.schedule[i].h;break;}}
    if(!hours||!hours[0])continue;
    if(offset===0){
      for(var j=0;j<hours.length;j++){if(toMin(hours[j][0])>fromMin)return 'öffnet heute um '+hours[j][0]+' Uhr';}
      continue;
    }
    var first=hours[0][0];
    if(offset===1)return 'öffnet morgen um '+first+' Uhr';
    var when=new Intl.DateTimeFormat('de-DE',{weekday:'long',day:'numeric',month:'long'}).format(new Date(Number(iso.slice(0,4)),Number(iso.slice(5,7))-1,Number(iso.slice(8,10))));
    return 'öffnet am '+when+' um '+first+' Uhr';
  }
  return '';
}
var now=berlin();
var hol=D.holidays.find(function(h){return h.date===now.iso;})||null;
var slot=null;
var dayHours=null;
for(var i=0;i<D.schedule.length;i++){
  if(D.schedule[i].d===now.day){dayHours=D.schedule[i].h;break;}
}
if(!hol&&dayHours){
  for(var j=0;j<dayHours.length;j++){
    var a=toMin(dayHours[j][0]),b=toMin(dayHours[j][1]);
    if(now.minutes>=a&&now.minutes<b){slot=dayHours[j];break;}
  }
}
var state,reason,label,sub='',alertName='';
var opensNext=nextOpen(now.iso,now.minutes);
if(hol){state='closed';reason='holiday';label='Geschlossen wegen Feiertag: '+hol.name;alertName=hol.name;sub='Gesetzlicher Feiertag (NRW)'+(opensNext?' · '+opensNext:'');}
else if(slot){state='open';reason='hours';label='Heute geöffnet · bis '+slot[1]+' Uhr';}
else{state='closed';reason=(now.day==='Sunday'||!dayHours)?'sunday':'outside';label='Aktuell geschlossen';sub=opensNext||'';}
/* Use cco* keys — never data-open-state on <html> (would match badges and wipe the document via textContent). */
html.dataset.ccoOpen=state;
html.dataset.ccoOpenReason=reason;
html.dataset.ccoOpenLabel=label;
html.dataset.ccoOpenAlert=alertName;
if(window.scrollY>24)html.classList.add('boot-scrolled');
function paint(){
  document.querySelectorAll('[data-opening-status]').forEach(function(root){
    root.dataset.state=state;root.dataset.reason=reason;
    root.querySelectorAll('[data-oh-line]').forEach(function(el){el.textContent=label;});
    root.querySelectorAll('[data-oh-sub]').forEach(function(el){
      if(sub){el.hidden=false;el.textContent=sub;}else{el.hidden=true;el.textContent='';}
    });
    root.querySelectorAll('[data-oh-open]').forEach(function(btn){btn.dataset.state=state;btn.dataset.reason=reason;});
    var alert=root.querySelector('[data-oh-alert]');
    if(alert){
      alert.hidden=reason!=='holiday';
      var nm=root.querySelector('[data-oh-alert-name]');
      if(nm)nm.textContent=alertName;
      var h=(reason==='holiday'&&!alert.hidden)?Math.ceil(alert.getBoundingClientRect().height):0;
      html.style.setProperty('--header-alert-h',h+'px');
    }
  });
  document.querySelectorAll('span[data-open-state], .open-state[data-open-state]').forEach(function(el){
    el.dataset.state=state;el.dataset.reason=reason;
    el.textContent=reason==='holiday'?'Feiertag · Geschlossen':(state==='open'?'Jetzt geöffnet':'Aktuell geschlossen');
  });
  if(html.classList.contains('needs-consent')){
    var banner=document.querySelector('[data-consent-banner]');
    if(banner)banner.hidden=false;
  }
  var header=document.querySelector('[data-header][data-overlay]');
  if(header&&html.classList.contains('boot-scrolled'))header.classList.add('is-solid');
  var n=html.dataset.favCount;
  if(n){document.querySelectorAll('[data-fav-count]').forEach(function(el){el.textContent=n;el.hidden=false;});}
}
if(document.body)paint();
else document.addEventListener('DOMContentLoaded',paint);
})();`;
}

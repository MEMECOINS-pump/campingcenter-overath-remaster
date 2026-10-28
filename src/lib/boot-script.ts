/**
 * Blocking first-paint boot: opening status, consent, a11y prefs, fav count, scroll solid.
 * Runs as is:inline so there is no flash of pending/wrong chrome.
 *
 * Opening status is recomputed from Europe/Berlin wall time (not SSR text):
 * - first paint
 * - every minute boundary
 * - tab visibility restore
 * - View Transitions (cco:refresh-open / window.__ccoRefreshOpen)
 * Precedence: manual > special > holiday policy > weekly.
 * Pill, hours sheet banner, companion dataset, and open-state badges stay in sync.
 */
import { openingBootPayload } from '@/lib/opening-hours';

export function buildBootScript(): string {
  const year = new Date().getFullYear();
  const payload = openingBootPayload(year);
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
      var font=a.font==='sm'||a.font==='lg'||a.font==='xl'?a.font:'md';
      html.dataset.a11yFont=font;
      html.classList.toggle('a11y-font-sm',font==='sm');
      html.classList.toggle('a11y-font-lg',font==='lg');
      html.classList.toggle('a11y-font-xl',font==='xl');
      if(a.contrast)html.classList.add('a11y-contrast');
      if(a.reduceMotion)html.classList.add('a11y-reduce-motion');
      if(a.readable)html.classList.add('a11y-readable');
      if(a.links)html.classList.add('a11y-links');
      if(a.focus)html.classList.add('a11y-focus-strong');
    }else if(Array.isArray(a)){
      if(a.indexOf('text-lg')>=0){html.classList.add('a11y-font-lg');html.dataset.a11yFont='lg';}
      if(a.indexOf('contrast')>=0)html.classList.add('a11y-contrast');
      if(a.indexOf('reduce-motion')>=0)html.classList.add('a11y-reduce-motion');
      if(a.indexOf('readable')>=0)html.classList.add('a11y-readable');
      if(a.indexOf('links')>=0)html.classList.add('a11y-links');
      if(a.indexOf('focus')>=0)html.classList.add('a11y-focus-strong');
    }
  }
}catch(e){}
try{
  var favs=JSON.parse(localStorage.getItem('cco:favorites')||'[]');
  if(Array.isArray(favs)&&favs.length){html.dataset.ccoFavCount=String(favs.length);}
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
function dayHoursFor(day){
  for(var i=0;i<D.schedule.length;i++){if(D.schedule[i].d===day)return D.schedule[i].h;}
  return null;
}
function findOverride(list,iso){
  if(!list)return null;
  for(var i=0;i<list.length;i++){if(list[i].date===iso)return list[i];}
  return null;
}
/** Precedence: manual > special > holiday policy > weekly */
function resolveHours(iso,day){
  var man=findOverride(D.manual,iso);
  if(man){
    if(man.closed||!man.hours||!man.hours.length)return{kind:'closed',reason:'manual',label:man.label,hours:null};
    return{kind:'hours',reason:'manual',label:man.label,hours:man.hours};
  }
  var spe=findOverride(D.special,iso);
  if(spe){
    if(spe.closed||!spe.hours||!spe.hours.length)return{kind:'closed',reason:'special',label:spe.label,hours:null};
    return{kind:'hours',reason:'special',label:spe.label,hours:spe.hours};
  }
  var hol=D.holidays.find(function(h){return h.date===iso;})||null;
  var policy=D.holidayPolicy||'closed';
  if(hol&&policy==='closed')return{kind:'closed',reason:'holiday',label:hol.name,hours:null,holiday:hol};
  var hours=dayHoursFor(day);
  if(!hours||!hours.length)return{kind:'closed',reason:'sunday',label:'Planmäßig geschlossen',hours:null,holiday:hol};
  return{kind:'hours',reason:'hours',label:'',hours:hours,holiday:policy==='weekly'?hol:null};
}
function clockLabel(hhmm){
  var p=String(hhmm||'').split(':');
  var h=p[0],m=p[1];
  if(!h)return String(hhmm||'');
  if(!m||m==='00')return String(Number(h));
  return String(Number(h))+':'+m;
}
function openPill(closes){
  var c=clockLabel(closes);
  return{label:'Heute geöffnet bis '+c+' Uhr',shortLabel:'Geöffnet bis '+c+' Uhr',compactLabel:'Bis '+c+' Uhr geöffnet'};
}
function closedPill(reason,planLabel,holidayName){
  if(reason==='holiday'){
    var name=holidayName||planLabel||'Feiertag';
    return{label:'Heute geschlossen – '+name,shortLabel:'Feiertag · Geschlossen',compactLabel:'Feiertag'};
  }
  if(reason==='manual'||reason==='special'){
    var text=planLabel||'Sonderöffnungszeiten';
    return{label:text,shortLabel:text.length>22?'Sonderöffnungszeiten':text,compactLabel:text.length>16?'Sonderzeiten':text};
  }
  if(reason==='sunday')return{label:'Heute geschlossen',shortLabel:'Geschlossen',compactLabel:'Geschlossen'};
  return{label:'Aktuell geschlossen',shortLabel:'Geschlossen',compactLabel:'Geschlossen'};
}
function nextOpen(fromIso,fromMin){
  for(var offset=0;offset<14;offset++){
    var iso=addDays(fromIso,offset);
    var di=new Date(Number(iso.slice(0,4)),Number(iso.slice(5,7))-1,Number(iso.slice(8,10))).getDay();
    var day=days[di];
    var plan=resolveHours(iso,day);
    if(plan.kind!=='hours'||!plan.hours||!plan.hours[0])continue;
    if(offset===0){
      for(var j=0;j<plan.hours.length;j++){if(toMin(plan.hours[j][0])>fromMin)return 'Öffnet heute um '+plan.hours[j][0]+' Uhr';}
      continue;
    }
    var first=plan.hours[0][0];
    if(offset===1)return 'Öffnet morgen um '+first+' Uhr';
    var when=new Intl.DateTimeFormat('de-DE',{weekday:'long',day:'numeric',month:'long'}).format(new Date(Number(iso.slice(0,4)),Number(iso.slice(5,7))-1,Number(iso.slice(8,10))));
    return 'Öffnet am '+when+' um '+first+' Uhr';
  }
  return '';
}
function todayHoursLabel(hours){
  if(!hours||!hours.length)return 'Heute planmäßig geschlossen';
  return 'Regulär heute: '+hours.map(function(h){return h[0]+'\u2013'+h[1];}).join(' \u00b7 ')+' Uhr';
}
function overrideHoursLabel(plan){
  return plan.label+': '+plan.hours.map(function(h){return h[0]+'\u2013'+h[1];}).join(' \u00b7 ')+' Uhr';
}
function compute(){
  var now=berlin();
  var plan=resolveHours(now.iso,now.day);
  var opensNext=nextOpen(now.iso,now.minutes);
  var state,reason,label,shortLabel,compactLabel,sub='',alertName='',bannerTitle,nextLine='',todayLabel;
  if(plan.kind==='closed'){
    state='closed';reason=plan.reason;
    var closed=closedPill(reason,plan.label,plan.label);
    label=closed.label;shortLabel=closed.shortLabel;compactLabel=closed.compactLabel;
    if(reason==='holiday'){
      alertName=plan.label;
      sub='Gesetzlicher Feiertag (NRW)'+(opensNext?' \u00b7 '+opensNext:'');
      todayLabel='Heute Feiertag: '+plan.label+' \u2013 wir haben geschlossen';
      bannerTitle=label;
    }else if(reason==='manual'||reason==='special'){
      todayLabel=plan.label;
      sub=opensNext||'';
      bannerTitle=label;
    }else{
      todayLabel=plan.label||todayHoursLabel(null);
      sub=opensNext||'';
      bannerTitle=label;
    }
    nextLine=opensNext||'';
  }else{
    var slot=null;
    for(var j=0;j<plan.hours.length;j++){
      var a=toMin(plan.hours[j][0]),b=toMin(plan.hours[j][1]);
      if(now.minutes>=a&&now.minutes<b){slot=plan.hours[j];break;}
    }
    todayLabel=(plan.reason==='manual'||plan.reason==='special')?overrideHoursLabel(plan):todayHoursLabel(plan.hours);
    if(slot){
      state='open';reason=plan.reason;
      var open=openPill(slot[1]);
      label=open.label;shortLabel=open.shortLabel;compactLabel=open.compactLabel;
      bannerTitle=label;
      nextLine='';
      sub='';
    }else{
      state='closed';
      reason=(plan.reason==='manual'||plan.reason==='special')?plan.reason:((now.day==='Sunday'||!dayHoursFor(now.day))?'sunday':'outside');
      var closedOutside=closedPill(reason,plan.label,null);
      label=closedOutside.label;shortLabel=closedOutside.shortLabel;compactLabel=closedOutside.compactLabel;
      sub=opensNext||'';
      bannerTitle=label;
      nextLine=opensNext||'';
    }
  }
  return{state:state,reason:reason,label:label,shortLabel:shortLabel,compactLabel:compactLabel,sub:sub,alertName:alertName,todayLabel:todayLabel,bannerTitle:bannerTitle,nextLine:nextLine};
}
function paintOpen(status){
  var state=status.state,reason=status.reason,label=status.label,shortLabel=status.shortLabel,compactLabel=status.compactLabel,sub=status.sub,alertName=status.alertName;
  html.dataset.ccoOpen=state;
  html.dataset.ccoOpenReason=reason;
  html.dataset.ccoOpenLabel=label;
  html.dataset.ccoOpenAlert=alertName;
  document.querySelectorAll('[data-opening-status]').forEach(function(root){
    root.dataset.state=state;root.dataset.reason=reason;
    root.querySelectorAll('[data-oh-line-full]').forEach(function(el){el.textContent=label;});
    root.querySelectorAll('[data-oh-line-short]').forEach(function(el){el.textContent=shortLabel;});
    root.querySelectorAll('[data-oh-line-compact]').forEach(function(el){el.textContent=compactLabel;});
    root.querySelectorAll('[data-oh-sub]').forEach(function(el){
      if(sub){el.hidden=false;el.textContent=sub;}else{el.hidden=true;el.textContent='';}
    });
    root.querySelectorAll('[data-oh-open]').forEach(function(btn){
      btn.dataset.state=state;btn.dataset.reason=reason;
      btn.setAttribute('aria-label',label+(sub?' · '+sub:''));
    });
    root.querySelectorAll('[data-oh-banner]').forEach(function(banner){
      banner.dataset.state=state;banner.dataset.reason=reason;
    });
    root.querySelectorAll('[data-oh-banner-title]').forEach(function(el){el.textContent=status.bannerTitle;});
    root.querySelectorAll('[data-oh-today]').forEach(function(el){el.textContent=status.todayLabel;});
    root.querySelectorAll('[data-oh-next]').forEach(function(el){
      if(status.nextLine){el.hidden=false;el.textContent=status.nextLine;}
      else{el.hidden=true;el.textContent='';}
    });
    var alert=root.querySelector('[data-oh-alert]');
    if(alert){
      alert.hidden=reason!=='holiday';
      var nm=root.querySelector('[data-oh-alert-name]');
      if(nm)nm.textContent=alertName;
      /* --header-alert-h comes from CSS :has([data-oh-alert]:not([hidden])). */
    }
  });
  document.querySelectorAll('span[data-open-state], .open-state[data-open-state]').forEach(function(el){
    el.dataset.state=state;el.dataset.reason=reason;
    el.textContent=reason==='holiday'?'Feiertag \u00b7 Geschlossen':(state==='open'?'Jetzt geöffnet':'Aktuell geschlossen');
  });
  try{window.dispatchEvent(new CustomEvent('cco:open-status',{detail:status}));}catch(e){}
}
function refreshOpen(){
  paintOpen(compute());
}
function msToNextMinute(){
  var now=new Date();
  var ms=60000-((now.getSeconds()*1000)+now.getMilliseconds());
  return ms<250?ms+60000:ms;
}
var openTimer=0;
function armOpenTimer(){
  if(openTimer)clearTimeout(openTimer);
  openTimer=setTimeout(function(){
    refreshOpen();
    armOpenTimer();
  },msToNextMinute());
}
function paintChrome(){
  if(html.dataset.favCount){
    if(!html.dataset.ccoFavCount)html.dataset.ccoFavCount=html.dataset.favCount;
    delete html.dataset.favCount;
  }
  refreshOpen();
  if(html.classList.contains('needs-consent')){
    var banner=document.querySelector('[data-consent-banner]');
    if(banner)banner.hidden=false;
  }
  var header=document.querySelector('[data-header][data-overlay]');
  if(header&&html.classList.contains('boot-scrolled'))header.classList.add('is-solid');
  var n=html.dataset.ccoFavCount;
  if(n){
    document.querySelectorAll('[data-fav-count]').forEach(function(el){
      if(el===html||el===document.documentElement)return;
      el.textContent=n;el.hidden=false;
    });
  }
}
if(window.scrollY>24)html.classList.add('boot-scrolled');
window.__ccoRefreshOpen=refreshOpen;
window.addEventListener('cco:refresh-open',refreshOpen);
document.addEventListener('visibilitychange',function(){
  if(document.visibilityState==='visible')refreshOpen();
});
armOpenTimer();
if(document.body)paintChrome();
else document.addEventListener('DOMContentLoaded',paintChrome);
})();`;
}

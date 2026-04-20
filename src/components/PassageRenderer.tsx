'use client';
import React, { useMemo } from 'react';
import { Highlight } from '@/store/testStore';
import { HighlightableText } from './HighlightableText';

/* ── palette & shared style ─────────────────────────────── */
const PAL = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#0ea5e9','#f97316'];
const HDR: React.CSSProperties = { background: 'linear-gradient(135deg,#1e1b4b 0%,#4338ca 100%)' };

/* ── SVG layout ─────────────────────────────────────────── */
const VW=600, VH=270, ML=60, MR=16, MT=22, MB=62;
const CW=VW-ML-MR, CH=VH-MT-MB;

/* ── types ──────────────────────────────────────────────── */
interface Props {
  text:string; highlights:Highlight[];
  onAddHighlight:(h:Omit<Highlight,'id'>)=>void;
  onRemoveHighlight:(id:string)=>void;
  onUpdateHighlight:(id:string,u:Partial<Highlight>)=>void;
  isHighlightModeActive:boolean; className?:string;
}
interface S { name:string; values:(number|null)[]; color:string }
type Seg =
  | { kind:'text';  content:string; offset:number }
  | { kind:'table'; title:string; header:string[]; rows:string[][] }
  | { kind:'line';  title:string; xLabels:string[]; series:S[]; unit:string }
  | { kind:'bar';   title:string; categories:string[]; series:S[]; unit:string };

/* ── utils ───────────────────────────────────────────────── */
const f=(n:number)=>n.toFixed(1);
function pNum(s:string):number|null{
  const c=s.replace(/[~,\s]/g,'').replace(/%$/,'');
  if(!c||!/\d/.test(c))return null;
  const n=parseFloat(c); return isNaN(n)?null:n;
}
function niceScale(mn:number,mx:number,n=5){
  const ext=mx-mn||1, raw=ext/n, mag=Math.pow(10,Math.floor(Math.log10(raw)));
  const step=Math.ceil(raw/mag)*mag;
  const min=Math.floor(mn/step)*step, max=Math.ceil(mx/step)*step;
  const ticks:number[]=[];
  for(let t=min;t<=max+step*0.001;t=Math.round((t+step)*1e6)/1e6)ticks.push(t);
  return {min,max,step,ticks};
}
function lbl(n:number,u:string){
  if(u==='%')return`${n}%`;
  if(Math.abs(n)>=100000)return`${(n/1000).toFixed(0)}k`;
  if(Math.abs(n)>=1000)return`${(n/1000).toFixed(1)}k`;
  return n%1!==0?n.toFixed(1):String(n);
}
function crPath(pts:[number,number][]){
  if(pts.length<2)return'';
  let d=`M ${f(pts[0][0])} ${f(pts[0][1])}`;
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
    const c1x=p1[0]+(p2[0]-p0[0])/6, c1y=p1[1]+(p2[1]-p0[1])/6;
    const c2x=p2[0]-(p3[0]-p1[0])/6, c2y=p2[1]-(p3[1]-p1[1])/6;
    d+=` C ${f(c1x)} ${f(c1y)},${f(c2x)} ${f(c2y)},${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/* ── parsing ─────────────────────────────────────────────── */
function parseTable(body:string,fallbackTitle:string):Extract<Seg,{kind:'table'}>{
  const lines=body.split(/\r?\n/).map(l=>l.trim()).filter(l=>l&&!l.startsWith('__'));
  let title=fallbackTitle; const rows:string[][]=[];
  for(const l of lines){
    if(l.includes('|'))rows.push(l.split('|').map(c=>c.trim()));
    else if(!title)title=l;
  }
  const [header=[],...rest]=rows;
  return {kind:'table',title,header,rows:rest};
}

function tbl2chart(t:Extract<Seg,{kind:'table'}>):Seg{
  const{title,header,rows}=t;
  if(!header.length||!rows.length)return t;
  const cols=header.slice(1);
  const unit=rows.flat().some(c=>c.includes('%'))?'%':'';
  // years → rows are series (line chart)
  if(cols.length>=2&&cols.every(h=>/^(18|19|20)\d{2}$/.test(h.trim()))){
    return{kind:'line',title,xLabels:cols,unit,
      series:rows.map((r,i)=>({name:r[0],values:r.slice(1).map(pNum),color:PAL[i%PAL.length]}))};
  }
  // numeric first col → cols are series (line chart)
  const fc=rows.map(r=>r[0]);
  if(fc.every(c=>/^~?[\d,.]+/.test(c.replace(/[°%][a-zA-Z]*/g,'').trim()))&&cols.length>=2){
    return{kind:'line',title,xLabels:fc,unit,
      series:cols.map((name,i)=>({name,values:rows.map(r=>pNum(r[i+1])),color:PAL[i%PAL.length]}))};
  }
  // grouped bar
  return{kind:'bar',title,categories:fc,unit,
    series:cols.map((name,i)=>({name,values:rows.map(r=>pNum(r[i+1])),color:PAL[i%PAL.length]}))};
}

function bulletLine(title:string,lines:string[]):Seg{
  const allY=new Set<number>();
  const raw:Array<{name:string;pts:Map<number,number>}>=[];
  for(const bl of lines){
    const l=bl.replace(/^-\s*/,''); const ci=l.indexOf(':'); if(ci<0)continue;
    const name=l.slice(0,ci).trim(), rest=l.slice(ci+1);
    const pts=new Map<number,number>();
    const yr=/\b((19|20)\d{2})(?:[–-]\d{4})?\b/g; let ym:RegExpExecArray|null;
    while((ym=yr.exec(rest))!==null){
      const year=parseInt(ym[1]);
      const win=rest.slice(Math.max(0,ym.index-22),ym.index);
      const vm=win.match(/~?(\d+(?:\.\d+)?)\s+\w+\s*$/);
      if(vm){pts.set(year,parseFloat(vm[1]));allY.add(year);}
    }
    if(pts.size)raw.push({name,pts});
  }
  const sortY=Array.from(allY).sort((a,b)=>a-b);
  const series:S[]=raw.map(({name,pts},i)=>{
    const e=Array.from(pts.entries()).sort((a,b)=>a[0]-b[0]);
    const values=sortY.map(y=>{
      if(pts.has(y))return pts.get(y)!;
      const bef=e.filter(([ey])=>ey<y); const b=bef[bef.length-1];
      const a=e.find(([ey])=>ey>y);
      if(b&&a){const t=(y-b[0])/(a[0]-b[0]);return b[1]+t*(a[1]-b[1]);}
      return b?.[1]??a?.[1]??null;
    });
    return{name,values,color:PAL[i%PAL.length]};
  });
  return{kind:'line',title,xLabels:sortY.map(String),series,unit:''};
}

function bulletBar(title:string,lines:string[]):Seg{
  const cats:string[]=[]; const sm=new Map<string,number[]>(); const so:string[]=[];
  for(const bl of lines){
    const l=bl.replace(/^-\s*/,''); const ci=l.indexOf(':'); if(ci<0)continue;
    const cat=l.slice(0,ci).trim(), rest=l.slice(ci+1);
    // Match "~3 pursuing" or "~1 escaping" — label is 1+ word(s) up to comma+tilde or end
    const re=/~?(\d+(?:\.\d+)?)\s+([a-zA-Z][a-zA-Z-]*(?:\s+[a-zA-Z][a-zA-Z-]*)?)(?=\s*,\s*~|\s*$)/g;
    const pairs:Array<{v:number;lb:string}>=[];
    let m:RegExpExecArray|null;
    while((m=re.exec(rest))!==null)pairs.push({v:parseFloat(m[1]),lb:m[2].trim()});
    if(pairs.length){
      cats.push(cat);
      for(const{v,lb}of pairs){
        if(!sm.has(lb)){sm.set(lb,[]);so.push(lb);}
        sm.get(lb)!.push(v);
      }
    }
  }
  return{kind:'bar',title,categories:cats,unit:'',
    series:so.map((name,i)=>({name,values:sm.get(name)!,color:PAL[i%PAL.length]}))};
}

function parsePassage(raw:string):Seg[]{
  type Blk={start:number;end:number;type:'chart'|'table';body:string};
  const blks:Blk[]=[];
  let m:RegExpExecArray|null;
  const chartRe=/__CHART__[\r\n]+([\s\S]*?)__ENDCHART__/g;
  while((m=chartRe.exec(raw))!==null)blks.push({start:m.index,end:m.index+m[0].length,type:'chart',body:m[1]});
  const tableRe=/__TABLE__[\r\n]+([\s\S]*?)__ENDTABLE__/g;
  while((m=tableRe.exec(raw))!==null){
    const s=m.index,e=m.index+m[0].length;
    if(!blks.some(b=>b.type==='chart'&&s>=b.start&&e<=b.end))
      blks.push({start:s,end:e,type:'table',body:m[1]});
  }
  blks.sort((a,b)=>a.start-b.start);
  const segs:Seg[]=[]; let idx=0,off=0;
  for(const blk of blks){
    const before=raw.slice(idx,blk.start).trim();
    if(before){segs.push({kind:'text',content:before,offset:off});off+=before.length+1;}
    if(blk.type==='table'){
      segs.push(parseTable(blk.body,''));
    } else {
      const lines=blk.body.split(/\r?\n/).map(l=>l.trim());
      const title=lines[0]||'';
      const tm=/__TABLE__[\r\n]+([\s\S]*?)__ENDTABLE__/.exec(blk.body);
      if(tm){segs.push(tbl2chart(parseTable(tm[1],title)));}
      else{
        const bul=lines.slice(1).filter(l=>l.startsWith('-'));
        if(bul.length){
          const hasY=bul.some(l=>/\b(19|20)\d{2}\b/.test(l));
          segs.push(hasY?bulletLine(title,bul):bulletBar(title,bul));
        }
      }
    }
    idx=blk.end;
  }
  const tail=raw.slice(idx).trim();
  if(tail)segs.push({kind:'text',content:tail,offset:off});
  return segs;
}

/* ── LINE CHART ─────────────────────────────────────────── */
function LineChart({seg,uid}:{seg:Extract<Seg,{kind:'line'}>;uid:number}){
  const{title,xLabels,series,unit}=seg;
  const vals=series.flatMap(s=>s.values.filter((v):v is number=>v!==null));
  if(!vals.length)return null;
  const sc=niceScale(Math.min(0,...vals),Math.max(...vals));
  const xS=(i:number)=>xLabels.length<2?CW/2:(i/(xLabels.length-1))*CW;
  const yS=(v:number)=>CH-((v-sc.min)/((sc.max-sc.min)||1))*CH;
  const id=`lc${uid}`;
  return(
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl bg-white">
      <div style={HDR} className="px-5 py-3.5 flex items-center gap-2.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <span className="text-[13px] font-bold text-white tracking-wide leading-tight">{title||'Line Graph'}</span>
      </div>
      <div className="bg-white px-1 pt-2 pb-0">
        <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{display:'block'}}>
          <defs>
            {series.map((s,i)=>(
              <linearGradient key={i} id={`${id}a${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.22"/>
                <stop offset="100%" stopColor={s.color} stopOpacity="0.01"/>
              </linearGradient>
            ))}
          </defs>
          <rect x={ML} y={MT} width={CW} height={CH} fill="#fafafa" rx="4"/>
          {/* grid + y-labels */}
          {sc.ticks.map((t,i)=>{
            const y=MT+yS(t);
            return(
              <g key={i}>
                <line x1={ML} y1={y} x2={ML+CW} y2={y}
                  stroke={t===0?'#94a3b8':'#e2e8f0'} strokeWidth={t===0?1:0.8}
                  strokeDasharray={t===0?undefined:'3 3'}/>
                <text x={ML-7} y={y+3.5} textAnchor="end" fill="#94a3b8" fontSize="9.5" fontFamily="system-ui">
                  {lbl(t,unit)}
                </text>
              </g>
            );
          })}
          {/* x-labels */}
          {xLabels.map((lb,i)=>(
            <g key={i}>
              <line x1={ML+xS(i)} y1={MT+CH} x2={ML+xS(i)} y2={MT+CH+4} stroke="#94a3b8" strokeWidth="1"/>
              <text x={ML+xS(i)} y={MT+CH+16} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="system-ui" fontWeight="500">{lb}</text>
            </g>
          ))}
          {/* area + line + dots */}
          {series.map((s,si)=>{
            const px=s.values.map((v,i)=>v!==null?[ML+xS(i),MT+yS(v)] as [number,number]:null)
              .filter((p):p is [number,number]=>p!==null);
            if(px.length<2)return null;
            const lp=crPath(px);
            const last=px[px.length-1],first=px[0];
            const ap=`${lp} L ${f(last[0])} ${f(MT+CH)} L ${f(first[0])} ${f(MT+CH)} Z`;
            return(
              <g key={si}>
                <path d={ap} fill={`url(#${id}a${si})`}/>
                <path d={lp} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                {px.map(([cx,cy],pi)=>(
                  <circle key={pi} cx={cx} cy={cy} r="4" fill="white" stroke={s.color} strokeWidth="2.5"/>
                ))}
              </g>
            );
          })}
          <line x1={ML} y1={MT} x2={ML} y2={MT+CH} stroke="#cbd5e1" strokeWidth="1.5"/>
          <line x1={ML} y1={MT+CH} x2={ML+CW} y2={MT+CH} stroke="#cbd5e1" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
        {series.map((s,i)=>(
          <div key={i} className="flex items-center gap-2">
            <div className="w-6 h-[3px] rounded-full flex-shrink-0" style={{background:s.color}}/>
            <span className="text-[11.5px] font-medium text-slate-600 leading-tight">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── BAR CHART ──────────────────────────────────────────── */
function BarChart({seg,uid}:{seg:Extract<Seg,{kind:'bar'}>;uid:number}){
  const{title,categories,series,unit}=seg;
  const vals=series.flatMap(s=>s.values.filter((v):v is number=>v!==null));
  if(!vals.length)return null;
  const sc=niceScale(0,Math.max(...vals));
  const yS=(v:number)=>CH-((v-sc.min)/((sc.max-sc.min)||1))*CH;
  const nG=categories.length,nS=series.length;
  const gW=CW/nG,pad=Math.max(gW*0.15,5),usable=gW-pad*2;
  const gap=Math.max(usable*0.06,1.5),bW=Math.max((usable-gap*(nS-1))/nS,2);
  const id=`bc${uid}`;

  function catLabel(cat:string,cx:number){
    const clean=cat.replace(/\s*\([^)]*\)/g,'').trim();
    const par=cat.match(/\(([^)]*)\)/)?.[1]??'';
    if(cat.length<=13){
      return<text x={cx} y={MT+CH+17} textAnchor="middle" fill="#64748b" fontSize="9.5" fontFamily="system-ui" fontWeight="500">{cat}</text>;
    }
    const ws=clean.split(' '),half=Math.ceil(ws.length/2);
    const l1=ws.slice(0,half).join(' '), l2=par?`(${par})`:ws.slice(half).join(' ');
    return(
      <text textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui" fontWeight="500">
        <tspan x={cx} y={MT+CH+13}>{l1}</tspan>
        <tspan x={cx} dy="12">{l2}</tspan>
      </text>
    );
  }

  return(
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl bg-white">
      <div style={HDR} className="px-5 py-3.5 flex items-center gap-2.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round">
          <path d="M4 20V10M8 20V4M12 20v-6M16 20V8M20 20v-2"/>
        </svg>
        <span className="text-[13px] font-bold text-white tracking-wide leading-tight">{title||'Bar Chart'}</span>
      </div>
      <div className="bg-white px-1 pt-2 pb-0">
        <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{display:'block'}}>
          <defs>
            {series.map((s,i)=>(
              <linearGradient key={i} id={`${id}g${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.93"/>
                <stop offset="100%" stopColor={s.color} stopOpacity="0.68"/>
              </linearGradient>
            ))}
          </defs>
          <rect x={ML} y={MT} width={CW} height={CH} fill="#fafafa" rx="4"/>
          {sc.ticks.map((t,i)=>{
            const y=MT+yS(t);
            return(
              <g key={i}>
                <line x1={ML} y1={y} x2={ML+CW} y2={y}
                  stroke={t===0?'#94a3b8':'#e2e8f0'} strokeWidth={t===0?1:0.8}
                  strokeDasharray={t===0?undefined:'3 3'}/>
                <text x={ML-7} y={y+3.5} textAnchor="end" fill="#94a3b8" fontSize="9.5" fontFamily="system-ui">
                  {lbl(t,unit)}
                </text>
              </g>
            );
          })}
          {categories.map((cat,gi)=>{
            const gx=ML+gi*gW+pad;
            return(
              <g key={gi}>
                {series.map((s,si)=>{
                  const v=s.values[gi];
                  if(v===null||v===undefined)return null;
                  const bx=gx+si*(bW+gap);
                  const bh=Math.max(yS(sc.min)-yS(v),2);
                  const by=MT+yS(v);
                  return<rect key={si} x={f(bx)} y={f(by)} width={f(bW)} height={f(bh)} fill={`url(#${id}g${si})`} rx="3" ry="3"/>;
                })}
                {catLabel(cat,ML+gi*gW+gW/2)}
              </g>
            );
          })}
          {categories.map((_,gi)=>gi>0?(
            <line key={gi} x1={ML+gi*gW} y1={MT} x2={ML+gi*gW} y2={MT+CH} stroke="#f1f5f9" strokeWidth="1"/>
          ):null)}
          <line x1={ML} y1={MT} x2={ML} y2={MT+CH} stroke="#cbd5e1" strokeWidth="1.5"/>
          <line x1={ML} y1={MT+CH} x2={ML+CW} y2={MT+CH} stroke="#cbd5e1" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
        {series.map((s,i)=>(
          <div key={i} className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-[3px] flex-shrink-0" style={{background:s.color}}/>
            <span className="text-[11.5px] font-medium text-slate-600 leading-tight">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PREMIUM TABLE ──────────────────────────────────────── */
function PremiumTable({seg}:{seg:Extract<Seg,{kind:'table'}>}){
  const{title,header,rows}=seg;
  if(!header.length&&!rows.length)return null;
  return(
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl bg-white">
      {title&&(
        <div style={HDR} className="px-5 py-3.5">
          <span className="text-[13px] font-bold text-white tracking-wide">{title}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-[13.5px] border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
              {header.map((c,i)=>(
                <th key={i} className="px-4 py-3 text-left font-bold text-slate-600 border-b-2 border-slate-200 whitespace-nowrap text-[11.5px] tracking-widest uppercase">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row,ri)=>(
              <tr key={ri} className={`transition-colors duration-75 ${ri%2===0?'bg-white':'bg-slate-50/70'} hover:bg-indigo-50/40`}>
                {row.map((cell,ci)=>{
                  const nd=cell.toLowerCase().includes('not detected');
                  return(
                    <td key={ci} className={`px-4 py-2.5 border-b border-slate-100 whitespace-nowrap ${
                      ci===0?'font-semibold text-slate-800'
                      :nd?'text-slate-400 italic text-[12px]'
                      :'text-slate-600 tabular-nums'}`}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── MAIN EXPORT ────────────────────────────────────────── */
export function PassageRenderer({text,highlights,onAddHighlight,onRemoveHighlight,onUpdateHighlight,isHighlightModeActive,className}:Props){
  const segs=useMemo(()=>parsePassage(text),[text]);
  return(
    <div className={className}>
      {segs.map((seg,i)=>{
        if(seg.kind==='table')return<PremiumTable key={i} seg={seg}/>;
        if(seg.kind==='line') return<LineChart key={i} seg={seg} uid={i}/>;
        if(seg.kind==='bar')  return<BarChart key={i} seg={seg} uid={i}/>;
        const off=seg.offset;
        const hl=highlights
          .filter(h=>h.start>=off&&h.start<off+seg.content.length)
          .map(h=>({...h,start:h.start-off,end:h.end-off}));
        return(
          <HighlightableText key={i} text={seg.content}
            className="text-[16px] leading-[1.9] text-slate-700"
            highlights={hl}
            onAddHighlight={h=>onAddHighlight({...h,start:h.start+off,end:h.end+off})}
            onRemoveHighlight={onRemoveHighlight}
            onUpdateHighlight={onUpdateHighlight}
            isHighlightModeActive={isHighlightModeActive}/>
        );
      })}
    </div>
  );
}

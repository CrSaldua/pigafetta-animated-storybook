import { useState, useEffect } from "react";
import pigafettaPortrait from "./assets/antonio-pigafetta-portrait.png";
import fallOfMagellanImage from "./assets/fall-of-magellan-facebook.jpg";
import pigafettaVideo from "../MicrosoftTeams-video (1).mp4";

// ── Photo data keyed by topic ──────────────────────────────────────────────
const PHOTOS = {
  ship1:       "https://images.unsplash.com/photo-1775733894506-e0fcfa4405f2?w=600&h=400&fit=crop&auto=format",
  ship2:       "https://images.unsplash.com/photo-1775733888894-7b7969e72d8a?w=600&h=400&fit=crop&auto=format",
  shipSilho:   "https://images.unsplash.com/photo-1775733899893-f9baa5d75c0f?w=600&h=400&fit=crop&auto=format",
  ph1:         "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&h=400&fit=crop&auto=format",
  ph2:         "https://images.unsplash.com/photo-1632307918787-8cb52566dd35?w=600&h=400&fit=crop&auto=format",
  warriors:    "https://images.unsplash.com/photo-1483119107169-31558642c29c?w=600&h=400&fit=crop&auto=format",
  statue:      fallOfMagellanImage,
  hut1:        "https://images.unsplash.com/photo-1681279043605-aedc72e27731?w=600&h=400&fit=crop&auto=format",
  hut2:        "https://images.unsplash.com/photo-1543125274-403616012d4f?w=600&h=400&fit=crop&auto=format",
  parchment:   "https://images.unsplash.com/photo-1522442676585-c751dab71864?w=600&h=400&fit=crop&auto=format",
  manuscript:  "https://images.unsplash.com/photo-1561812938-f6e60cbf95e3?w=600&h=400&fit=crop&auto=format",
};

// ── Types ──────────────────────────────────────────────────────────────────
type Screen = "title" | "ch1" | "ch2" | "ch3" | "ch4" | "epilogue" | "video";
const SCREENS: Screen[] = ["title","ch1","ch2","ch3","ch4","epilogue","video"];
const SCREEN_TITLES = ["","I","II","III","IV","∎","▶"];
const SCREEN_NAMES  = ["","Magellan's Arrival","Battle of Mactan","Filipino Communities","Pigafetta's Legacy","Epilogue","Pigafetta Video"];
const PAGE_EXIT_MS = 760;
const PAGE_ENTER_MS = 820;

// ── Shared styles ──────────────────────────────────────────────────────────
const GOLD = "#c8a84b";
const GOLD2 = "#f0cc70";
const BLOOD = "#a01515";
const DARK = "rgba(10,5,0,0.9)";
const PANEL: React.CSSProperties = {
  background: "var(--theme-panel, rgba(10,5,0,0.9))",
  border:"1px solid var(--theme-border, #4a3010)", borderRadius:"6px", padding:"clamp(8px, 1.2vh, 12px)",
};

// ── Helpers ────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="divider" />;
}

function GoldTitle({ children, size="clamp(20px,4vw,28px)", style={} }: { children:React.ReactNode; size?:string; style?:React.CSSProperties }) {
  return (
    <h2 className="font-display gold-text" style={{ fontSize:size, lineHeight:1.2, margin:"4px 0", ...style }}>
      {children}
    </h2>
  );
}

function ChapterLabel({ label, color="#7a5e1a" }: { label:string; color?:string }) {
  return <p className="font-heading" style={{ fontSize:"9px", letterSpacing:"0.4em", color, margin:0 }}>{label}</p>;
}

function Quote({ text, color=GOLD }: { text:string; color?:string }) {
  return (
    <p className="font-fell" style={{
      fontStyle:"italic", fontSize:"11px", lineHeight:1.75,
      color:"#f5e6c8", borderLeft:`3px solid ${color}`, paddingLeft:"12px", margin:0,
    }}>{text}</p>
  );
}

function Pill({ text, color=GOLD }: { text:string; color?:string }) {
  return (
    <span className="font-heading" style={{
      fontSize:"8px", letterSpacing:"0.12em", padding:"2px 8px",
      borderRadius:"3px", background:`${color}1a`, border:`1px solid ${color}55`, color,
      display:"inline-block", margin:"2px",
    }}>{text}</span>
  );
}

// ── Photo strip (2–3 images side by side with gold overlay) ───────────────
function PhotoStrip({ photos, captions }: { photos: string[]; captions: string[] }) {
  return (
    <div className="photo-strip" style={{ display:"flex", gap:"6px" }}>
      {photos.map((src, i) => (
        <div key={i} style={{ flex:1, position:"relative", borderRadius:"5px", overflow:"hidden",
          border:"1px solid #4a3010", background:"#1a0c00" }}>
          <img
            src={src}
            alt={captions[i]}
            loading="lazy"
            style={{ width:"100%", height:"90px", objectFit:"cover", display:"block",
              filter:"saturate(0.7) brightness(0.75)" }}
          />
          {/* Gold overlay tint */}
          <div style={{ position:"absolute", inset:0,
            background:"linear-gradient(180deg,transparent 40%,rgba(10,5,0,0.85) 100%)" }}/>
          <p className="font-heading" style={{
            position:"absolute", bottom:"4px", left:"5px", right:"5px",
            fontSize:"7px", letterSpacing:"0.08em", color:GOLD, margin:0, lineHeight:1.3,
          }}>{captions[i]}</p>
        </div>
      ))}
    </div>
  );
}

// ── Large single photo card with caption ──────────────────────────────────
function PhotoCard({
  src, caption, height=120, fit="cover", position="center", imageFilter="saturate(0.65) brightness(0.7)",
}: {
  src:string; caption:string; height?:number; fit?:"cover"|"contain"; position?:string; imageFilter?:string;
}) {
  return (
    <div className="photo-card" style={{ position:"relative", borderRadius:"5px", overflow:"hidden",
      border:"1px solid #4a3010", background:"#1a0c00", flexShrink:0 }}>
      <img src={src} alt={caption} loading="lazy"
        style={{ width:"100%", height:`${height}px`, objectFit:fit, objectPosition:position, display:"block",
          filter:imageFilter }}/>
      <div style={{ position:"absolute", inset:0,
        background:"linear-gradient(180deg,transparent 50%,rgba(10,5,0,0.9) 100%)" }}/>
      <p className="font-fell" style={{
        position:"absolute", bottom:"6px", left:"8px", right:"8px",
        fontSize:"9px", color:GOLD, margin:0, fontStyle:"italic", lineHeight:1.4,
      }}>{caption}</p>
    </div>
  );
}

function ClickCard({
  icon, title, short, color, active, onClick,
}: {
  icon:string; title:string; short:string; color:string; active:boolean; onClick:()=>void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      className="chapter-card"
      onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background: active||hov ? `${color}22` : "rgba(20,8,0,0.88)",
        border:`1px solid ${active||hov ? color : "#4a3010"}`,
        borderRadius:"6px", padding:"10px 9px", cursor:"pointer", textAlign:"left",
        transition:"all 0.2s", width:"100%",
      }}
    >
      <span style={{ fontSize:"18px", display:"block", marginBottom:"4px" }}>{icon}</span>
      <p className="font-heading" style={{ fontSize:"9px", letterSpacing:"0.1em", color, margin:"0 0 3px" }}>{title}</p>
      <p className="font-body" style={{ fontSize:"9px", color:"#7a5e1a", margin:0, lineHeight:1.45 }}>{short}</p>
    </button>
  );
}

// ── Particles ──────────────────────────────────────────────────────────────
function Particles({ count=14, color=GOLD }: { count?:number; color?:string }) {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {[...Array(count)].map((_,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${(i*83.7+7)%100}%`, bottom:0,
          width:`${2+(i%3)}px`, height:`${2+(i%3)}px`,
          borderRadius:"50%", background:color, opacity:0,
          animation:`particleDrift ${5+(i*1.4)%9}s linear ${(i*0.65)%5}s infinite`,
        }}/>
      ))}
    </div>
  );
}

// ── Walking Character (CSS animated SVG) ───────────────────────────────────
function WalkingFigure({
  dir="right", type="soldier", speed="6s", delay="0s", bottom="12%",
}: {
  dir?:"right"|"left"; type?:"soldier"|"warrior"|"scholar"; speed?:string; delay?:string; bottom?:string;
}) {
  const colors = {
    soldier:  { body:"#8a8a8a", skin:"#c8a84b", accent:"#a01515" },
    warrior:  { body:"#4a2800", skin:"#7a4a1a", accent:"#c8a84b" },
    scholar:  { body:"#2d1a5a", skin:"#d4a57a", accent:"#c8a84b" },
  }[type];

  const anim = dir==="right"
    ? `walkAcross ${speed} ${delay} linear infinite`
    : `walkAcrossRev ${speed} ${delay} linear infinite`;

  return (
    <div className="walking-figure" style={{
      position:"absolute", bottom, zIndex:4,
      animation: anim,
      transform: dir==="left" ? "scaleX(-1)" : undefined,
    }}>
      <svg width="50" height="72" viewBox="0 0 50 72" aria-hidden="true">
        {/* Head */}
        <g style={{ animation:"headBob 0.5s ease-in-out infinite", transformOrigin:"25px 10px" }}>
          <circle cx="25" cy="10" r="8" fill={colors.skin}/>
          {type==="warrior" && (
            <>
              <path d="M17 8 Q15 2 18 0 Q22 5 20 8" fill={colors.accent}/>
              <path d="M25 6 Q25 0 28 -1 Q30 4 27 8" fill={GOLD}/>
              <path d="M33 8 Q35 2 32 0 Q28 5 30 8" fill={colors.accent}/>
            </>
          )}
          {type==="soldier" && (
            <path d="M17 10 Q17 2 25 0 Q33 2 33 10" fill="#9a9a9a"/>
          )}
          {type==="scholar" && (
            <rect x="17" y="2" width="16" height="8" rx="2" fill="#1a1a3a"/>
          )}
        </g>
        {/* Torso */}
        <rect x="17" y="19" width="16" height="18" rx="3" fill={colors.body}/>
        {type==="warrior" && (
          <path d="M19 21 Q25 28 31 21" stroke={GOLD} strokeWidth="1" fill="none"/>
        )}
        {/* Left arm */}
        <g style={{ transformOrigin:"17px 22px", animation:`armSwingFwd 0.5s ease-in-out infinite` }}>
          <rect x="10" y="22" width="7" height="16" rx="3" fill={colors.body}/>
          {type==="soldier" && <line x1="7" y1="36" x2="3" y2="52" stroke="#6a6a6a" strokeWidth="2" strokeLinecap="round"/>}
          {type==="warrior" && <line x1="7" y1="36" x2="3" y2="52" stroke="#7a5e1a" strokeWidth="2.5" strokeLinecap="round"/>}
        </g>
        {/* Right arm */}
        <g style={{ transformOrigin:"33px 22px", animation:`armSwingBack 0.5s ease-in-out infinite` }}>
          <rect x="33" y="22" width="7" height="16" rx="3" fill={colors.body}/>
          {type==="scholar" && <rect x="36" y="33" width="6" height="9" rx="1" fill="#f5e6c8"/>}
        </g>
        {/* Left leg */}
        <g style={{ transformOrigin:"20px 38px", animation:`legSwingFwd 0.5s ease-in-out infinite` }}>
          <rect x="17" y="38" width="8" height="20" rx="3" fill={colors.body}/>
          <rect x="15" y="55" width="10" height="5" rx="2" fill={colors.skin}/>
        </g>
        {/* Right leg */}
        <g style={{ transformOrigin:"30px 38px", animation:`legSwingBack 0.5s ease-in-out infinite` }}>
          <rect x="25" y="38" width="8" height="20" rx="3" fill={colors.body}/>
          <rect x="23" y="55" width="10" height="5" rx="2" fill={colors.skin}/>
        </g>
      </svg>
    </div>
  );
}

// ── Torch flame ────────────────────────────────────────────────────────────
function Torch({ style={} }: { style?: React.CSSProperties }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", ...style }}>
      <div style={{
        width:"14px", height:"20px",
        background:"radial-gradient(ellipse at 50% 80%, #ff8c00, #ff4400 60%, transparent)",
        borderRadius:"50% 50% 30% 30%",
        animation:"torchFlicker 1.4s ease-in-out infinite",
        boxShadow:"0 0 18px 8px rgba(255,120,0,0.4)",
      }}/>
      <div style={{ width:"6px", height:"2px", background:"#ff6600", opacity:0.6 }}/>
      <div style={{ width:"8px", height:"50px", background:"linear-gradient(#4a2800,#2d1a00)", borderRadius:"0 0 3px 3px" }}/>
    </div>
  );
}

// ── Animated Ship ──────────────────────────────────────────────────────────
function AnimShip({ style={} }: { style?: React.CSSProperties }) {
  return (
    <div className="voyage-ship" style={style} role="img" aria-label="Magellan, Pigafetta, and crew sailing toward an island">
      <svg viewBox="0 0 300 170" width="300" height="170">
        <title>Magellan, Pigafetta, and their crew aboard a ship at sea</title>
        {/* Waves */}
        <path d="M8 151 Q54 139 100 149 Q146 159 192 147 Q238 137 292 148" stroke="#7ab5cf" strokeWidth="3" fill="none" opacity="0.85"/>
        <path d="M0 160 Q75 149 150 157 Q225 148 300 157" stroke="#1a4a70" strokeWidth="3" fill="none" opacity="0.75"/>
        {/* Hull */}
        <path d="M38 123 Q60 147 150 148 Q240 145 263 119 L247 103 L54 103 Z" fill="#2d1a00" stroke={GOLD} strokeWidth="2"/>
        <path d="M48 119 Q150 137 254 116" stroke="#70441d" strokeWidth="3" fill="none" opacity="0.9"/>
        <path d="M58 129 Q150 145 244 126" stroke="#70441d" strokeWidth="2" fill="none" opacity="0.75"/>
        <rect x="52" y="94" width="198" height="12" rx="2" fill="#4f2b08" stroke={GOLD} strokeWidth="1.2"/>
        <path d="M42 105 L57 94 L57 114 Z" fill="#3d2200" stroke={GOLD} strokeWidth="1"/>
        <path d="M250 94 L272 105 L249 111 Z" fill="#3d2200" stroke={GOLD} strokeWidth="1"/>

        {/* Idle crew on deck — all sway with the ship */}
        <g className="idle-crew">
          {/* Magellan looking toward land */}
          <g transform="translate(211 66)">
            <circle cx="8" cy="7" r="5.5" fill="#d4a57a"/>
            <path d="M2 6 Q8 -1 14 6 L13 3 L5 1 Z" fill="#7a1515"/>
            <path d="M4 13 L12 13 L15 30 L1 30 Z" fill="#711515" stroke={GOLD} strokeWidth="0.7"/>
            <path d="M11 16 L21 11" stroke="#d4a57a" strokeWidth="3" strokeLinecap="round"/>
            <path d="M20 10 L31 7" stroke="#d9c17b" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="30.5" cy="7" r="2" fill="#d9c17b"/>
            <path d="M5 30 L4 36 M11 30 L13 36" stroke="#21120a" strokeWidth="3" strokeLinecap="round"/>
            <text x="8" y="47" textAnchor="middle" fontSize="6" fill={GOLD2} fontFamily="Cinzel">MAGELLAN</text>
          </g>

          {/* Pigafetta recording the voyage */}
          <g transform="translate(73 68)">
            <circle cx="9" cy="7" r="5.5" fill="#d4a57a"/>
            <path d="M3 5 Q9 0 15 5 L14 8 L3 8 Z" fill="#24213d"/>
            <path d="M4 13 L14 13 L16 29 L2 29 Z" fill="#2d315b" stroke={GOLD} strokeWidth="0.7"/>
            <rect x="13" y="19" width="10" height="7" rx="1" fill="#efe0b9" transform="rotate(8 18 22)"/>
            <path d="M13 18 Q21 12 24 8" stroke="#f3e6c5" strokeWidth="1.2" fill="none"/>
            <path d="M6 29 L5 35 M12 29 L14 35" stroke="#17142e" strokeWidth="3" strokeLinecap="round"/>
            <text x="10" y="46" textAnchor="middle" fontSize="6" fill={GOLD2} fontFamily="Cinzel">PIGAFETTA</text>
          </g>

        </g>

        {/* Mast */}
        <line x1="150" y1="96" x2="150" y2="10" stroke="#4a2800" strokeWidth="5" strokeLinecap="round"/>
        <line x1="103" y1="41" x2="197" y2="41" stroke="#4a2800" strokeWidth="3"/>
        {/* Sails */}
        <path d="M153 12 L153 86 L196 65 L196 35 Z" fill="#f5e6c8" stroke={GOLD} strokeWidth="1"/>
        <path d="M147 12 L147 86 L104 65 L104 35 Z" fill="#e8d5b0" stroke={GOLD} strokeWidth="1"/>
        {/* Cross on sail */}
        <line x1="146" y1="40" x2="146" y2="79" stroke={BLOOD} strokeWidth="2"/>
        <line x1="125" y1="57" x2="146" y2="57" stroke={BLOOD} strokeWidth="2"/>
        {/* Top sail */}
        <path d="M153 12 L153 40 L194 35 Z" fill="#f5e6c8" stroke={GOLD} strokeWidth="1"/>
        <path d="M147 12 L147 40 L106 35 Z" fill="#e8d5b0" stroke={GOLD} strokeWidth="1"/>
        {/* Flag */}
        <line x1="150" y1="12" x2="150" y2="-2" stroke="#4a2800" strokeWidth="1.5"/>
        <path d="M150 -2 L170 4 L150 10 Z" fill={BLOOD} className="ship-flag"/>
        {/* Sailors remain visible in front of the lower sails */}
        {[112, 151, 181].map((x, index) => (
          <g key={x} transform={`translate(${x} ${76 + (index % 2) * 3})`}>
            <circle cx="5" cy="4" r="4" fill={index === 1 ? "#a8754c" : "#c08d62"}/>
            <path d="M1 3 Q5 -1 9 3" stroke={index === 1 ? "#c8a84b" : "#78421d"} strokeWidth="2" fill="none"/>
            <path d="M1 9 L9 9 L11 22 L0 22 Z" fill={index === 1 ? "#4b5a68" : "#6b3b20"}/>
            <path d="M3 22 L2 28 M8 22 L9 28" stroke="#24140a" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
        ))}
        {/* Portholes */}
        {[91,130,169,208].map(x=><circle key={x} cx={x} cy={124} r="4" fill="#1a0c00" stroke={GOLD} strokeWidth="1"/>)}
      </svg>
    </div>
  );
}

function VoyageIsland() {
  return (
    <svg className="voyage-island" viewBox="0 0 250 145" role="img" aria-label="Tropical island on the right horizon">
      <title>Tropical island on the horizon</title>
      <defs>
        <linearGradient id="islandSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9b65b"/>
          <stop offset="1" stopColor="#7f5420"/>
        </linearGradient>
      </defs>
      <ellipse cx="138" cy="124" rx="103" ry="12" fill="#091f32" opacity="0.7"/>
      <path d="M35 119 Q73 94 113 99 Q150 72 181 94 Q212 98 238 119 Z" fill="url(#islandSand)" stroke="#c8a84b" strokeWidth="1.4"/>
      <path d="M70 105 Q98 75 124 92 Q143 60 174 92 Q192 86 216 108 Z" fill="#203d22"/>
      <path d="M151 94 Q144 67 151 43" stroke="#56351a" strokeWidth="6" fill="none"/>
      <path d="M151 47 Q132 36 115 45 Q128 26 151 39 Q168 20 180 33 Q177 43 153 48 Q178 43 192 54 Q170 60 151 50" fill="#386b36" stroke="#203d22" strokeWidth="1"/>
      <path d="M96 99 Q92 81 98 65" stroke="#56351a" strokeWidth="4" fill="none"/>
      <path d="M98 67 Q83 57 71 65 Q82 48 98 59 Q111 43 120 55 Q114 66 99 68" fill="#315d30"/>
      <path d="M42 126 Q82 118 122 125 Q164 132 210 123 Q229 119 247 125" stroke="#85c2da" strokeWidth="2" fill="none" opacity="0.8"/>
      <text x="158" y="138" textAnchor="middle" fontSize="8" fill={GOLD2} fontFamily="Cinzel" letterSpacing="2">HOMONHON</text>
    </svg>
  );
}

// ── Animated Map with route drawing ───────────────────────────────────────
function AnimMap({ style={} }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 300 190" style={style} aria-hidden="true">
      <rect width="300" height="190" rx="6" fill="#2d1a00" stroke={GOLD} strokeWidth="2"/>
      <rect x="5" y="5" width="290" height="180" rx="4" fill="#0d2a45" opacity="0.7"/>
      {[55,110,165,220,265].map(x=><line key={x} x1={x} y1="5" x2={x} y2="185" stroke="#1a4a70" strokeWidth="0.4" opacity="0.4"/>)}
      {[50,95,140].map(y=><line key={y} x1="5" y1={y} x2="295" y2={y} stroke="#1a4a70" strokeWidth="0.4" opacity="0.4"/>)}
      {/* Landmasses */}
      <path d="M22 40 Q42 32 68 37 Q86 42 82 60 Q78 73 60 76 Q42 73 28 60 Z" fill="#3d2200" stroke={GOLD} strokeWidth="1.2"/>
      <text x="50" y="57" fontSize="5" fill={GOLD} textAnchor="middle" fontFamily="Cinzel">ESPAÑA</text>
      <path d="M95 72 Q115 62 132 76 Q146 94 137 125 Q128 152 115 156 Q101 152 95 128 Q89 102 95 72 Z" fill="#3d2200" stroke={GOLD} strokeWidth="1.2"/>
      <path d="M42 86 Q56 80 66 90 Q75 108 69 142 Q63 165 52 165 Q41 158 38 138 Q34 112 42 86 Z" fill="#3d2200" stroke={GOLD} strokeWidth="1.2"/>
      <path d="M22 78 Q35 72 38 86" fill="#2d1800" stroke={GOLD} strokeWidth="0.8"/>
      {/* Philippines highlighted */}
      <ellipse cx="240" cy="95" rx="11" ry="20" fill={GOLD} opacity="0.85" stroke={GOLD2} strokeWidth="2"/>
      <ellipse cx="229" cy="108" rx="7" ry="12" fill={GOLD} opacity="0.7" stroke={GOLD2} strokeWidth="1.2"/>
      <ellipse cx="250" cy="112" rx="6" ry="10" fill={GOLD} opacity="0.65" stroke={GOLD2} strokeWidth="1"/>
      <text x="239" y="132" fontSize="6" fill={GOLD2} textAnchor="middle" fontFamily="Cinzel">FILIPINAS</text>
      {/* Animated route */}
      <path
        d="M60 58 Q95 80 120 130 Q148 175 180 170 Q215 165 233 142 Q238 122 238 102"
        stroke={BLOOD} strokeWidth="2" strokeDasharray="600" fill="none" opacity="0.95"
        style={{ animation:"routeDraw 3s ease-out 0.5s forwards", strokeDashoffset:"600" }}
      />
      <text x="182" y="174" fontSize="12" fill={GOLD} style={{ animation:"floatY 3s ease-in-out infinite" }}>⛵</text>
      {/* Compass */}
      <g transform="translate(268,42)">
        <circle cx="0" cy="0" r="16" fill="#1a0c00" stroke={GOLD} strokeWidth="1.2"/>
        <line x1="0" y1="-13" x2="0" y2="13" stroke={GOLD} strokeWidth="0.8"/>
        <line x1="-13" y1="0" x2="13" y2="0" stroke={GOLD} strokeWidth="0.8"/>
        <polygon points="0,-13 2.5,-5 0,-8 -2.5,-5" fill={BLOOD}/>
        <text x="0" y="-15" fontSize="5" fill={GOLD} textAnchor="middle">N</text>
      </g>
    </svg>
  );
}

// ── Animated Battle Scene ─────────────────────────────────────────────────
function BattleScene({ style={} }: { style?: React.CSSProperties }) {
  return (
    <div className="battle-scene" style={{ position:"relative", ...style }}>
      <svg viewBox="0 0 320 180" width="100%" aria-hidden="true">
        <defs>
          <radialGradient id="bsky2" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#4a0a0a"/>
            <stop offset="100%" stopColor="#050005"/>
          </radialGradient>
        </defs>
        <rect width="320" height="180" fill="url(#bsky2)"/>
        {/* Blood moon */}
        <circle cx="160" cy="38" r="26" fill="#6b1010" opacity="0.8" style={{ animation:"pulseGlow 3s ease-in-out infinite" } as React.CSSProperties}/>
        <circle cx="160" cy="38" r="36" fill={BLOOD} opacity="0.1"/>
        {/* Smoke */}
        <path d="M50 100 Q70 80 100 92 Q130 104 150 82" stroke="#222" strokeWidth="4" fill="none" opacity="0.4"/>
        <path d="M180 92 Q220 72 260 86 Q290 98 310 78" stroke="#222" strokeWidth="4" fill="none" opacity="0.35"/>
        {/* Ground */}
        <path d="M0 148 Q80 136 160 142 Q240 136 320 146 L320 180 L0 180 Z" fill="#2d1a00"/>
        <path d="M0 158 Q80 150 160 155 Q240 150 320 158 L320 180 L0 180 Z" fill="#3d2200"/>
        {/* Water edge */}
        <path d="M0 152 Q55 144 110 149 Q165 154 220 146 Q275 138 320 146" stroke="#0d2a45" strokeWidth="2.5" fill="none" opacity="0.6"/>
        {/* Spanish soldiers */}
        <g transform="translate(52,118)">
          <path d="M0 -28 Q0 -38 9 -38 Q18 -38 18 -28 L18 -22 L0 -22 Z" fill="#7a7a7a"/>
          <rect x="2" y="-22" width="14" height="22" fill="#8a8a8a"/>
          <rect x="-4" y="-16" width="26" height="10" fill="#7a7a7a" opacity="0.8"/>
          <line x1="20" y1="-42" x2="20" y2="18" stroke="#4a2800" strokeWidth="2.5" strokeLinecap="round"/>
          <polygon points="20,-42 17,-31 23,-31" fill="#9a9a9a"/>
        </g>
        <g transform="translate(80,122)">
          <path d="M0 -28 Q0 -38 9 -38 Q18 -38 18 -28 L18 -22 L0 -22 Z" fill="#7a7a7a"/>
          <rect x="2" y="-22" width="14" height="22" fill="#8a8a8a"/>
          <line x1="18" y1="-40" x2="18" y2="16" stroke="#4a2800" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="18,-40 15,-29 21,-29" fill="#9a9a9a"/>
        </g>
        {/* Warriors */}
        <g transform="translate(228,114)">
          <circle cx="9" cy="-34" r="8" fill="#5a2800"/>
          <rect x="3" y="-26" width="12" height="20" fill="#4a1a00"/>
          <line x1="-4" y1="-48" x2="-4" y2="14" stroke="#2d1400" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="-4,-48 -7,-37 -1,-37" fill={GOLD}/>
          <path d="M14 -23 Q18 -14 14 -3 Q8 2 2 -3 Q-2 -14 2 -23 Z" fill="#4a2800" stroke={GOLD} strokeWidth="1.2"/>
          <path d="M7 -44 Q3 -56 -2 -59 Q4 -53 5 -44" fill={BLOOD}/>
          <path d="M12 -42 Q16 -55 18 -56 Q14 -50 11 -42" fill={GOLD}/>
        </g>
        <g transform="translate(255,118)">
          <circle cx="9" cy="-34" r="9" fill="#5a2800"/>
          <rect x="3" y="-25" width="13" height="22" fill="#4a1a00"/>
          <line x1="-2" y1="-50" x2="-2" y2="13" stroke="#2d1400" strokeWidth="2.5" strokeLinecap="round"/>
          <polygon points="-2,-50 -5,-38 1,-38" fill={GOLD2}/>
          <path d="M5 -46 Q1 -57 -4 -60 Q2 -54 4 -46" fill={GOLD}/>
          <path d="M10 -44 Q14 -56 16 -57 Q12 -51 10 -44" fill={BLOOD}/>
        </g>
        <g transform="translate(282,110)">
          <circle cx="10" cy="-36" r="10" fill="#5a2800"/>
          <rect x="4" y="-26" width="14" height="24" fill="#4a1a00"/>
          <line x1="-1" y1="-52" x2="-1" y2="14" stroke="#2d1400" strokeWidth="3" strokeLinecap="round"/>
          <polygon points="-1,-52 -5,-39 3,-39" fill={GOLD2}/>
          <path d="M6 -46 Q2 -60 -3 -64 Q4 -56 5 -46" fill={GOLD}/>
          <path d="M12 -44 Q18 -58 22 -59 Q17 -52 12 -44" fill={BLOOD}/>
          <path d="M18 -42 Q25 -52 28 -52 Q23 -46 18 -42" fill={GOLD}/>
        </g>
        {/* Clash sparks */}
        <circle cx="165" cy="100" r="3" fill={GOLD2} opacity="0.9" style={{ animation:"torchFlicker 0.8s ease-in-out infinite" } as React.CSSProperties}/>
        <circle cx="172" cy="95" r="2" fill="#ff8c00" opacity="0.7" style={{ animation:"torchFlicker 0.6s ease-in-out infinite 0.2s" } as React.CSSProperties}/>
        <circle cx="158" cy="106" r="2" fill={GOLD2} opacity="0.6" style={{ animation:"torchFlicker 1s ease-in-out infinite 0.4s" } as React.CSSProperties}/>
      </svg>
      {/* Animated arrows */}
      <div style={{ position:"absolute", top:"30%", left:0, right:0,
        animation:"arrowFly 2.4s ease-in-out 0.5s infinite", pointerEvents:"none" }}>
        <svg width="60" height="16" viewBox="0 0 60 16" aria-hidden="true">
          <line x1="0" y1="8" x2="52" y2="8" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/>
          <polygon points="52,4 60,8 52,12" fill={GOLD}/>
          <path d="M0 6 L8 8 L0 10" fill={GOLD} opacity="0.5"/>
        </svg>
      </div>
      <div style={{ position:"absolute", top:"42%", left:0, right:0,
        animation:"arrowFly2 3.2s ease-in-out 1.2s infinite", pointerEvents:"none" }}>
        <svg width="48" height="14" viewBox="0 0 48 14" aria-hidden="true">
          <line x1="0" y1="7" x2="40" y2="7" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
          <polygon points="40,3 48,7 40,11" fill={GOLD} opacity="0.8"/>
        </svg>
      </div>
    </div>
  );
}

// ── Village Scene ─────────────────────────────────────────────────────────
function VillageScene({ style={} }: { style?: React.CSSProperties }) {
  return (
    <svg className="village-scene" viewBox="0 0 320 180" style={style} aria-hidden="true">
      <rect width="320" height="180" fill="#0d1a0d"/>
      <circle cx="270" cy="28" r="22" fill={GOLD} opacity="0.22"/>
      {[...Array(22)].map((_,i)=>(
        <circle key={i} cx={(Math.sin(i*137.5)*145+160)} cy={(Math.cos(i*97.3)*44+38)}
          r="1.1" fill="#f5e6c8" opacity={0.35+(i%4)*0.15}/>
      ))}
      {/* Hills */}
      <path d="M0 120 Q55 75 110 100 Q165 72 220 98 Q275 68 320 92 L320 180 L0 180 Z" fill="#0a1a0a"/>
      <path d="M0 135 Q80 112 160 130 Q240 108 320 125 L320 180 L0 180 Z" fill="#0d2a0d"/>
      {/* Palm */}
      <line x1="44" y1="152" x2="42" y2="98" stroke="#2d1a00" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M42 100 Q26 85 12 88 Q26 98 29 110" fill="#1a3a0a"/>
      <path d="M42 100 Q44 82 58 78 Q51 92 45 106" fill="#1a3a0a"/>
      <path d="M42 100 Q59 93 65 104 Q53 104 45 110" fill="#1a3a0a"/>
      {/* Hut 1 */}
      <rect x="88" y="136" width="44" height="26" fill="#4a2800" stroke="#7a5e1a" strokeWidth="1"/>
      <path d="M80 138 L110 110 L140 138 Z" fill="#3d2200" stroke="#7a5e1a" strokeWidth="1.2"/>
      <rect x="103" y="146" width="10" height="16" fill="#1a0c00" stroke="#7a5e1a" strokeWidth="0.5"/>
      {[96,108,120,132].map(x=><line key={x} x1={x} y1="162" x2={x} y2={x===108?175:x===120?175:174} stroke="#3d2200" strokeWidth="2"/>)}
      {/* Hut 2 */}
      <rect x="170" y="133" width="48" height="28" fill="#4a2800" stroke="#7a5e1a" strokeWidth="1"/>
      <path d="M162 136 L194 104 L226 136 Z" fill="#3d2200" stroke="#7a5e1a" strokeWidth="1.2"/>
      <rect x="186" y="143" width="12" height="18" fill="#1a0c00" stroke="#7a5e1a" strokeWidth="0.5"/>
      {[178,192,207,218].map(x=><line key={x} x1={x} y1="161" x2={x} y2={174} stroke="#3d2200" strokeWidth="2"/>)}
      {/* Torches */}
      {[80,142,162,228].map((x,i)=>(
        <g key={x}>
          <circle cx={x} cy={135} r={5} fill="#ff8c00" opacity="0.75" style={{ animation:`torchFlicker ${1.2+i*0.3}s ease-in-out ${i*0.4}s infinite` } as React.CSSProperties}/>
          <circle cx={x} cy={135} r={9} fill="#ff8c00" opacity="0.15"/>
        </g>
      ))}
      {/* People silhouettes */}
      <ellipse cx="154" cy="172" rx="4" ry="8" fill="#1a0c00"/>
      <circle cx="154" cy="161" r="4" fill="#1a0c00"/>
      <ellipse cx="140" cy="173" rx="3.5" ry="7.5" fill="#1a0c00"/>
      <circle cx="140" cy="162" r="3.5" fill="#1a0c00"/>
    </svg>
  );
}

// ── Scholar Writing Animation ──────────────────────────────────────────────
function ScholarFigure({ style={} }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 90 100" style={{ ...style }} aria-hidden="true">
      {/* Candle */}
      <rect x="68" y="68" width="6" height="20" fill="#f5e6c8" rx="1"/>
      <ellipse cx="71" cy="68" rx="3" ry="2" fill="#e8d5a0"/>
      <ellipse cx="71" cy="64" rx="5" ry="8" fill="#ff8c00" opacity="0.8" style={{ animation:"torchFlicker 1.3s ease-in-out infinite" } as React.CSSProperties}/>
      <ellipse cx="71" cy="64" rx="8" ry="12" fill="#ff8c00" opacity="0.12"/>
      {/* Desk */}
      <rect x="20" y="72" width="55" height="5" rx="2" fill="#3d2200"/>
      <line x1="22" y1="77" x2="22" y2="92" stroke="#2d1a00" strokeWidth="3"/>
      <line x1="73" y1="77" x2="73" y2="92" stroke="#2d1a00" strokeWidth="3"/>
      {/* Parchment */}
      <rect x="24" y="62" width="38" height="12" rx="1" fill="#f5e6c8" stroke={GOLD} strokeWidth="0.8"/>
      {/* Lines on parchment */}
      {[65,68,71].map(y=><line key={y} x1="27" y1={y} x2="58" y2={y} stroke="#c8a84b" strokeWidth="0.5" opacity="0.5"/>)}
      {/* Body */}
      <rect x="32" y="38" width="18" height="24" rx="3" fill="#2d1a5a"/>
      {/* Head */}
      <g style={{ animation:"headBob 1.2s ease-in-out infinite", transformOrigin:"41px 28px" }}>
        <circle cx="41" cy="28" r="10" fill="#d4a57a"/>
        <rect x="31" y="20" width="20" height="10" rx="2" fill="#1a1a3a"/>
        {/* Face */}
        <circle cx="37" cy="28" r="1.5" fill="#2d1000"/>
        <circle cx="45" cy="28" r="1.5" fill="#2d1000"/>
        <path d="M37 33 Q41 36 45 33" stroke="#7a4a1a" strokeWidth="1" fill="none"/>
      </g>
      {/* Writing arm */}
      <g style={{ transformOrigin:"32px 45px", animation:"armSwingFwd 1.2s ease-in-out infinite" }}>
        <rect x="20" y="45" width="12" height="8" rx="3" fill="#2d1a5a"/>
        {/* Quill */}
        <line x1="20" y1="52" x2="14" y2="62" stroke="#f5e6c8" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M14 62 Q10 56 16 54 Q18 60 14 62" fill="#f5e6c8"/>
      </g>
    </svg>
  );
}

// ── Typewriter hook ────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 28, start = true) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!start) { setDisplayed(""); return; }
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, start]);
  return displayed;
}

// ── TITLE SCREEN ──────────────────────────────────────────────────────────
function TitleScreen({ goNext }: { goNext: () => void }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div className="theme-title" style={{
      width:"100%", height:"100%", position:"relative", overflow:"hidden",
      background:"radial-gradient(ellipse at 50% 35%, #1a0c00 0%, #0a0500 65%, #000 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    }}>
      <Particles count={18} color={GOLD}/>
      <Particles count={8} color={BLOOD}/>

      {/* Torches */}
      <div style={{ position:"absolute", left:"20px", top:"50%", transform:"translateY(-50%)" }}>
        <Torch/>
      </div>
      <div style={{ position:"absolute", right:"20px", top:"50%", transform:"translateY(-50%)" }}>
        <Torch style={{ animationDelay:"0.7s" }}/>
      </div>

      {/* Walking figures across the background */}
      <WalkingFigure type="soldier" dir="right" speed="14s" delay="0s" bottom="5%"/>
      <WalkingFigure type="warrior" dir="left"  speed="11s" delay="3s" bottom="5%"/>
      <WalkingFigure type="scholar" dir="right" speed="18s" delay="6s" bottom="5%"/>

      {/* Ship */}
      <div style={{ position:"absolute", bottom:"1%", left:"50%", transform:"translateX(-50%)", opacity:0.15 }}>
        <AnimShip/>
      </div>

      {/* Main card */}
      <div className="ornament-box" style={{
        position:"relative", maxWidth:"480px", width:"calc(100% - 88px)",
        background:"linear-gradient(155deg,#1a0c00,#0d0700)", borderRadius:"8px",
        padding:"34px 30px", textAlign:"center", zIndex:5,
        transition:"opacity 0.8s, transform 0.8s",
        opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(16px)",
      }}>
        {/* Corner stars */}
        {(["8px,8px","8px,auto,auto,8px","auto,8px,8px","auto,auto,8px,8px"] as const).map((pos,i)=>{
          const [top,right,bottom,left] = pos.split(",");
          return <span key={i} style={{ position:"absolute", top, right, bottom, left, color:"#7a5e1a", fontSize:"9px" }}>✦</span>;
        })}

        <p className="font-heading" style={{ fontSize:"9px", letterSpacing:"0.35em", color:"#7a5e1a", marginBottom:"10px" }}>
          ANNO DOMINI MDXXI · A CHRONICLE OF DISCOVERY
        </p>
        <Divider/>
        <GoldTitle size="clamp(20px,4.4vw,29px)">
          The Contributions of<br/>Antonio Pigafetta
        </GoldTitle>
        <p className="font-heading" style={{ fontSize:"10px", letterSpacing:"0.2em", color:GOLD, marginBottom:"12px" }}>
          TO PHILIPPINE HISTORY
        </p>
        <p className="font-fell" style={{ fontStyle:"italic", fontSize:"10px", letterSpacing:"0.02em", color:"#7a5e1a", marginBottom:"12px" }}>
          A Glimpse into the 16th-Century Philippines Through a European Lens
        </p>
        <Divider/>
        <p className="font-fell" style={{ fontStyle:"italic", fontSize:"11px", lineHeight:1.7, color:GOLD, marginBottom:"10px" }}>
          "This presentation explores three major contributions of Antonio Pigafetta's chronicle, answering key
          guide questions about what he recorded, what it reveals about pre-colonial Philippines, and its
          historical significance."
        </p>

        {/* Contribution badges */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"4px", marginBottom:"18px" }}>
          {["Contribution 1: Magellan's Arrival","Contribution 2: Filipino Communities","Contribution 3: Battle of Mactan","Bonus Questions"].map(b=>(
            <Pill key={b} text={b} color={GOLD}/>
          ))}
        </div>

        <button
          onClick={goNext}
          className="font-heading"
          style={{
            fontSize:"11px", letterSpacing:"0.2em", padding:"12px 28px",
            borderRadius:"4px", cursor:"pointer",
            background:"linear-gradient(135deg,#7a5e1a,#c8a84b,#7a5e1a)", color:"#1a0c00",
            border:"none", boxShadow:"0 2px 20px rgba(200,168,75,0.3)",
            transition:"filter 0.2s, transform 0.15s",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.filter="brightness(1.2)"; e.currentTarget.style.transform="scale(1.05)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.filter="brightness(1)"; e.currentTarget.style.transform="scale(1)"; }}
        >⟶ OPEN THE CHRONICLE ⟵</button>
      </div>
    </div>
  );
}

// ── CHAPTER 1: Magellan's Arrival ─────────────────────────────────────────
const CH1_CARDS = [
  {
    id:"voyage", icon:"⛵", color:"#1a4a70",
    title:"The Voyage West",
    short:"About 270 men and 5 ships departed Sanlúcar de Barrameda in September 1519.",
    quote:`"After passing the equinoctial line, we lost the north star. We made a course to the southwest... the sea is so vast that I doubt whether the mind of man can conceive it."`,
    content:`Antonio Pigafetta carefully documented the dates and locations of Magellan's expedition as it reached the Philippine archipelago, including Homonhon and Mazaua (Limasawa), in March 1521.

His chronicle provides one of the most important primary-source accounts for establishing the timeline of the first recorded Spanish expedition to the Philippines.`,
    facts:["Exact dates recorded","Homonhon documented","Limasawa documented","March 1521 arrival"],
  },
  {
    id:"landing", icon:"🏝️", color:"#2d4a1a",
    title:"First Philippine Landing",
    short:"March 17, 1521 — Homonhon Island, Eastern Samar; later Mazaua (Limasawa).",
    quote:`"We ate only old biscuit reduced to powder, full of grubs, and stinking from the dirt which the rats had made on it when eating the good biscuit."`,
    content:`Pigafetta recorded the expedition's first landing at Homonhon and its encounters with the local people. He later described their encounter with local leaders, including Rajah Kolambu, at Mazaua.

He also described the Easter Sunday Mass and the planting of the cross at Mazaua, identified by the NHCP as Limasawa. This distinction matters: Homonhon was the first landing, while Limasawa is the officially recognized site of the 31 March 1521 Mass.`,
    facts:["Homonhon first anchorage","Mazaua (Limasawa)","Rajah Kolambu","Easter Mass, 31 March"],
  },
  {
    id:"compact", icon:"🤝", color:"#4a3a00",
    title:"Alliance & Exchange",
    short:"Rajah Humabon of Cebu and Magellan exchange gifts and pledges of friendship.",
    quote:`"The Captain-General told them that if they were his friend, he was their friend; and if they were his enemy, he was their enemy."`,
    content:`Pigafetta recorded diplomatic meetings, gift-giving, and pledges of friendship between Magellan and Cebu's Rajah Humabon.

These encounters are sometimes associated with the idea of a "sandugo" or blood compact, but Pigafetta's account mainly describes ceremonies of peace, friendship, and gift exchange. The episode shows that local communities already practiced diplomacy, hospitality, and exchange.`,
    facts:["Gift exchange recorded","Diplomacy and alliances","Hospitality","Sandugo label is later"],
  },
  {
    id:"economy", icon:"⚖️", color:"#6b4a00",
    title:"Trade & Diplomacy",
    short:"Pre-colonial Filipinos had established trade networks.",
    quote:`"The people of this place say that there is gold in this island in great quantities, found in pieces as large as a walnut and an egg — the country also produces ginger."`,
    content:`Politics and economy: Pigafetta's account reveals that pre-colonial Filipinos already had established trade networks, a system of diplomacy, and concepts of hospitality and alliances.

Society was welcoming but cautious and engaged in barter and gift-giving as a standard political protocol. Historians use this evidence to map the initial stages of Spanish colonization and understand the diplomatic strategies of our early ancestors.`,
    facts:["Established trade networks","Political diplomacy","Barter and gift-giving","Early Filipino strategy"],
  },
];

function Chapter1() {
  const [active, setActive] = useState<string|null>(null);
  const card = CH1_CARDS.find(c=>c.id===active);

  return (
    <div className="theme-voyage" style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden",
      background:"linear-gradient(180deg,#0d2a45 0%,#1a0c00 55%,#0a0500 100%)", position:"relative" }}>
      <Particles count={10} color={GOLD}/>

      {/* Animated ocean wave */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"28%", overflow:"hidden", opacity:0.4 }}>
        <div style={{ display:"flex", animation:"waveScroll 8s linear infinite", width:"200%" }}>
          {[0,1].map(k=>(
            <svg key={k} viewBox="0 0 640 60" style={{ width:"50%", flexShrink:0 }} aria-hidden="true">
              <path d="M0 40 Q80 20 160 40 Q240 60 320 40 Q400 20 480 40 Q560 60 640 40 L640 60 L0 60 Z" fill="#0d2a45" opacity="0.7"/>
            </svg>
          ))}
        </div>
      </div>

      {/* Destination island */}
      <VoyageIsland/>

      {/* The ship and its onboard crew share the same wave motion */}
      <div className="voyage-ship-wrap">
        <AnimShip/>
      </div>

      <div className="story-page-content" style={{ position:"relative", zIndex:5, display:"flex", flexDirection:"column", height:"100%", padding:"16px 20px" }}>
        <div>
          <ChapterLabel label="CONTRIBUTION 1 · DOCUMENTATION OF MAGELLAN'S ARRIVAL"/>
          <GoldTitle>The Voyage to Filipinas</GoldTitle>
          <Divider/>
        </div>

        <div className="chapter-layout chapter-layout--sidebar" style={{ flex:1, display:"grid", gridTemplateColumns:"200px 1fr", gridTemplateRows:"1fr auto", gap:"10px", minHeight:0 }}>

          {/* Pigafetta profile */}
          <aside className="pigafetta-profile" style={{ ...PANEL, gridRow:"1/3" }}>
            <p className="font-heading pigafetta-profile__eyebrow">✦ THE CHRONICLER ✦</p>
            <div className="pigafetta-profile__portrait-frame">
              <img
                src={pigafettaPortrait}
                alt="Engraved portrait of Antonio Pigafetta"
                className="pigafetta-profile__portrait"
              />
              <div className="pigafetta-profile__portrait-shade"/>
              <p className="font-display pigafetta-profile__portrait-name">Antonio Pigafetta</p>
            </div>

            <div className="pigafetta-profile__facts">
              <p className="font-body"><span>Name</span><strong>Antonio Pigafetta</strong></p>
              <p className="font-body"><span>Born</span><strong>around 1491</strong><small>or between 1490 and 1492</small></p>
              <p className="font-body"><span>Died</span><strong>around 1531–1534</strong><small>Vicenza, Italy</small></p>
              <p className="font-body"><span>Known for</span><strong>Official chronicler of Ferdinand Magellan's expedition</strong></p>
            </div>
            <p className="font-fell pigafetta-profile__caption">Eyewitness to the first voyage around the world</p>
          </aside>

          {/* Detail panel */}
          <div className="chapter1-detail" style={{ ...PANEL, border:`1px solid ${card ? card.color : "#4a3010"}`, transition:"border-color 0.3s", overflow:"auto" }}>
            {card ? (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
                  <span style={{ fontSize:"22px" }}>{card.icon}</span>
                  <p className="font-heading" style={{ fontSize:"11px", letterSpacing:"0.12em", color:card.color, margin:0 }}>{card.title}</p>
                </div>
                {/* Contextual photo per card */}
                <PhotoCard
                  src={card.id==="voyage" ? PHOTOS.ship2 : card.id==="landing" ? PHOTOS.ph2 : card.id==="compact" ? PHOTOS.ph1 : PHOTOS.ship1}
                  caption={card.id==="voyage" ? "A wooden sailing vessel of the era — Magellan commanded five such ships" : card.id==="landing" ? "Tropical Philippine coastline — similar to Homonhon Island where the fleet first anchored" : card.id==="compact" ? "The Visayan coast of Cebu where the blood compact (sandugo) was performed" : "Gold and trade goods traveled these seas for centuries before Spanish arrival"}
                  height={100}
                />
                <Divider/>
                <Quote text={card.quote} color={card.color}/>
                <Divider/>
                <p className="font-body" style={{ fontSize:"10px", lineHeight:1.75, color:GOLD, whiteSpace:"pre-line" }}>{card.content}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginTop:"8px" }}>
                  {card.facts.map(f=><Pill key={f} text={f} color={card.color}/>)}
                </div>
                <button onClick={()=>setActive(null)}
                  className="font-heading"
                  style={{ marginTop:"10px", fontSize:"9px", letterSpacing:"0.15em", padding:"5px 12px",
                    background:"rgba(200,168,75,0.1)", border:"1px solid #7a5e1a", borderRadius:"3px", color:GOLD, cursor:"pointer" }}>
                  ← Back
                </button>
              </>
            ) : (
              <>
                <p className="font-heading" style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#7a5e1a", margin:"0 0 8px" }}>✦ CLICK A CARD TO READ ✦</p>
                <PhotoStrip
                  photos={[PHOTOS.shipSilho, PHOTOS.ph2]}
                  captions={["Magellan's fleet — 5 ships, 270 men, September 1519", "Philippine shores — first sighted March 16, 1521"]}
                />
                <Divider/>
                <Quote text='"It provides the exact chronological starting point of Spanish contact and the introduction of Christianity to the Philippines." — NHCP'/>
                <Divider/>
                <p className="font-body" style={{ fontSize:"10px", color:GOLD, lineHeight:1.7 }}>
                  Pigafetta's chronicle is the primary source historians use to reconstruct Magellan's arrival.
                  Select any card below to read his full account.
                </p>
                <div style={{ background:"rgba(200,168,75,0.06)", border:"1px solid #4a3010", borderRadius:"4px", padding:"8px", marginTop:"8px" }}>
                  <p className="font-heading" style={{ fontSize:"8px", color:"#7a5e1a", margin:"0 0 3px" }}>✦ SOURCE</p>
                  <p className="font-body" style={{ fontSize:"9px", color:GOLD, lineHeight:1.6, margin:0 }}>
                    <em>First Voyage Around the World by Magellan</em>, by Antonio Pigafetta (trans. Lord Stanley of Alderley / James Alexander Robertson) — primary source used by the National Historical Commission of the Philippines (NHCP).
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Cards row */}
          <div style={{ gridColumn:"2/3", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
            {CH1_CARDS.map(c=>(
              <ClickCard key={c.id} icon={c.icon} title={c.title} short={c.short}
                color={c.color} active={active===c.id} onClick={()=>setActive(c.id)}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CHAPTER 2: Battle of Mactan ───────────────────────────────────────────
const CH2_MOMENTS = [
  {
    id:"prelude", icon:"📜", color:"#8b6914",
    title:"The Prelude",
    short:"Magellan refuses Humabon's warriors to prove Spanish might.",
    quote:`"The Captain-General decided to go thither with three boats — we were sixty men armed with corselets and helmets."`,
    content:`Pigafetta's account reveals the decentralized nature of local governance. Different islands and communities had their own leaders, such as Rajah Humabon in Cebu and Lapulapu, one of the chiefs of Mactan. These leaders had their own interests and rivalries and were not under a single ruler.

The account also highlights the independence of some local leaders. Lapulapu, for example, refused to recognize the authority of the Spanish king and Rajah Humabon over Mactan.`,
    facts:["Decentralized governance","Cebu and Mactan rivalries","Independent chiefdoms","Foreign tribute refused"],
  },
  {
    id:"coral", icon:"🪸", color:"#2d5a3a",
    title:"The Coral Reef Trap",
    short:"Shallow reef forces armored men to wade through water.",
    quote:`"Forty-nine of us leaped into the water up to our thighs and walked through water for more than two crossbow flights before we could reach the shore."`,
    content:`Pigafetta documented the tactics and local weaponry used at Mactan, including bamboo spears, arrows, stones, and large cutlasses. He also recorded that Magellan was wounded by a poisoned arrow.

His eyewitness account shows how the shallow waters and the large number of Mactan warriors affected the battle, making it difficult for Magellan's forces to fight effectively.`,
    facts:["Bamboo spears","Poisoned arrows","Cutlasses and kampilan","Local tactics documented"],
  },
  {
    id:"battle", icon:"⚔️", color:"#a01515",
    title:"The Battle",
    short:"Pigafetta reports about 1,500 Mactan warriors against a small Spanish force.",
    quote:`"The islanders, who numbered fifteen hundred, attacked us. They fired at us with their artillery, arrows, and lances — so that we could do nothing."`,
    content:`Pigafetta provides the surviving expedition's fullest eyewitness account of the Battle of Mactan on April 27, 1521. He recorded the tactics, weapons, reported numbers, and events leading to Ferdinand Magellan's death.

The battle is an early documented example of local resistance to a Spanish-led expedition. Pigafetta's numbers and descriptions should be read as his report, not as independently verified totals.`,
    facts:["April 27, 1521","Fullest surviving eyewitness account","Local tactics recorded","Reported numbers qualified"],
  },
  {
    id:"fall", icon:"🩸", color:"#6b1010",
    title:"The Fall of Magellan",
    short:"Magellan is struck down defending his retreating men.",
    quote:`"Thus they slew our mirror, our light, our comfort, and our true guide. When they wounded him, he turned back many times to see whether we had all got into the boats."`,
    content:`Pigafetta documented the specific events that led to Ferdinand Magellan's death and preserved the historical record of Lapulapu's victory.

This account helped make Lapulapu a major modern symbol of Filipino resistance. Calling him the “first Filipino hero” is a later nationalist interpretation, not a title used by Pigafetta himself.`,
    facts:["Magellan's death recorded","Mactan victory","Modern hero symbol","Later nationalist interpretation"],
  },
];

function Chapter2() {
  const [active, setActive] = useState<string|null>(null);
  const card = CH2_MOMENTS.find(c=>c.id===active);

  return (
    <div className="theme-battle" style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden",
      background:"linear-gradient(160deg,#0d0500 0%,#1a0500 40%,#0a0000 100%)", position:"relative" }}>
      <Particles count={14} color={BLOOD}/>
      <Particles count={6} color={GOLD}/>

      {/* Walking warriors */}
      <WalkingFigure type="warrior" dir="right" speed="10s" delay="0s" bottom="3%"/>
      <WalkingFigure type="soldier" dir="left"  speed="13s" delay="5s" bottom="3%"/>
      <WalkingFigure type="warrior" dir="right" speed="16s" delay="9s" bottom="3%"/>

      <div className="story-page-content" style={{ position:"relative", zIndex:5, display:"flex", flexDirection:"column", height:"100%", padding:"16px 20px" }}>
        <div>
          <ChapterLabel label="CONTRIBUTION 3 · ACCOUNT OF THE BATTLE OF MACTAN" color="#6b1010"/>
          <h2 className="blood-text font-display" style={{ fontSize:"clamp(18px,4vw,26px)", lineHeight:1.2, margin:"4px 0" }}>
            The Battle of Mactan
          </h2>
          <Divider/>
        </div>

        <div className="chapter-layout chapter-layout--battle battle-layout" style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", minHeight:0 }}>
          {/* Left: battle scene + stats */}
          <div className="battle-visual-column" style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {/* Combatants */}
            <div style={{ ...PANEL, border:"1px solid #4a1010", display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:"6px", alignItems:"center", padding:"10px" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"28px" }}>🛡️</div>
                <p className="font-heading" style={{ fontSize:"9px", color:"#8a8a8a", margin:"2px 0" }}>MAGELLAN</p>
                <Pill text="~50 armored" color="#8a8a8a"/>
              </div>
              <div className="font-display" style={{ fontSize:"24px", color:BLOOD, animation:"torchFlicker 2s ease-in-out infinite" }}>⚔</div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"28px" }}>🪃</div>
                <p className="font-heading" style={{ fontSize:"9px", color:GOLD, margin:"2px 0" }}>LAPU-LAPU</p>
                <Pill text="~1,500 warriors" color="#4a8a1a"/>
              </div>
            </div>

            <BattleScene style={{ borderRadius:"6px", overflow:"hidden", border:"1px solid #4a1010", flex:1 }}/>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
              {[
                { label:"Date", val:"April 27, 1521", color:"#8b6914" },
                { label:"Location", val:"Mactan Island, Cebu", color:"#8b6914" },
                { label:"Obstacle", val:"Coral reef — boats stuck", color:"#6b1010" },
                { label:"Outcome", val:"Spanish defeat · Magellan slain", color:BLOOD },
              ].map(s=>(
                <div key={s.label} style={{ background:"rgba(26,4,0,0.75)", border:`1px solid ${s.color}33`, borderRadius:"4px", padding:"6px 8px" }}>
                  <p className="font-heading" style={{ fontSize:"8px", color:s.color, margin:"0 0 2px" }}>{s.label}</p>
                  <p className="font-body" style={{ fontSize:"9px", color:GOLD, margin:0 }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: click moments */}
          <div className="battle-content-column" style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            <p className="font-heading" style={{ fontSize:"8px", letterSpacing:"0.25em", color:"#6b1010", margin:0 }}>
              ✦ CLICK A MOMENT TO READ PIGAFETTA'S EYEWITNESS ACCOUNT ✦
            </p>

            {!card && (
              <>
                <PhotoStrip
                  photos={[PHOTOS.warriors, PHOTOS.statue]}
                  captions={["Medieval armored soldiers — similar to the Spanish forces Magellan commanded", "Battle of Mactan commemoration — honoring the conflict remembered five centuries later"]}
                />
                <div style={{ height:"6px" }}/>
                {CH2_MOMENTS.map(m=>(
                  <ClickCard key={m.id} icon={m.icon} title={m.title} short={m.short}
                    color={m.color} active={active===m.id} onClick={()=>setActive(m.id)}/>
                ))}
              </>
            )}

            {card && (
              <div className="battle-event-detail" style={{ ...PANEL, border:`1px solid ${card.color}`, flex:1, overflow:"auto" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
                  <span style={{ fontSize:"22px" }}>{card.icon}</span>
                  <p className="font-heading" style={{ fontSize:"11px", letterSpacing:"0.1em", color:card.color, margin:0 }}>{card.title}</p>
                </div>
                <PhotoCard
                  src={card.id==="fall" ? fallOfMagellanImage : card.id==="battle" ? PHOTOS.statue : card.id==="coral" ? PHOTOS.ph2 : PHOTOS.warriors}
                  caption={card.id==="fall" ? "Commemoration of the Battle of Mactan — Embassy of Spain in the Philippines" : card.id==="coral" ? "Philippine coastal reef — the coral shallows that trapped Magellan's boats offshore" : card.id==="battle" ? "Battle of Mactan commemoration — recalling the clash between Magellan's force and Mactan's defenders" : "Mactan Island warriors prepared to defend their homeland"}
                  height={90}
                  fit="cover"
                  position={card.id==="fall" ? "center 42%" : "center"}
                  imageFilter={card.id==="fall" ? "saturate(0.82) brightness(0.88) contrast(1.04)" : undefined}
                />
                <Divider/>
                <Quote text={card.quote} color={card.color}/>
                <Divider/>
                <p className="font-body" style={{ fontSize:"10px", lineHeight:1.75, color:GOLD, whiteSpace:"pre-line" }}>{card.content}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginTop:"8px" }}>
                  {card.facts.map(f=><Pill key={f} text={f} color={card.color}/>)}
                </div>
                <button onClick={()=>setActive(null)} className="font-heading"
                  style={{ marginTop:"10px", fontSize:"9px", letterSpacing:"0.15em", padding:"5px 12px",
                    background:"rgba(200,168,75,0.1)", border:"1px solid #7a5e1a", borderRadius:"3px", color:GOLD, cursor:"pointer" }}>
                  ← All Moments
                </button>
              </div>
            )}

            {/* Historical importance box */}
            {!card && (
              <div style={{ ...PANEL, border:"1px solid #6b1010", padding:"10px" }}>
                <p className="font-heading" style={{ fontSize:"8px", letterSpacing:"0.18em", color:BLOOD, margin:"0 0 6px" }}>
                  ✦ WHY IT IS HISTORICALLY IMPORTANT ✦
                </p>
                <p className="font-body" style={{ fontSize:"10px", lineHeight:1.7, color:GOLD, margin:0 }}>
                  It is an early detailed record of local resistance to a Spanish-led expedition in the archipelago.
                  Lapu-Lapu later became a major Filipino symbol of resistance; the “first Filipino hero” label is a modern interpretation. <em>(NHCP — Recognized historical archives
                  regarding the Quincentennial Commemorations in the Philippines)</em>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CHAPTER 3: Filipino Communities ──────────────────────────────────────
const CH3_TABS = [
  {
    id:"society", label:"👑 Society", color:GOLD,
    photos:[PHOTOS.hut1, PHOTOS.hut2],
    captions:["Traditional stilt house — the bahay kubo Pigafetta described", "Nipa hut community — similar to pre-colonial Filipino villages"],
    quote:`"The King came to the ships girt with a cloth of Moro silk fringed with gold, with gold ornaments in his ears and a covering of embroidered silk on his head."`,
    body:`Pigafetta's records provide important evidence that pre-colonial Filipinos had developed and organized societies. He described rich cultural practices, metalworking, distinct clothing and body art, and active trade and exchange.

His descriptions provide historians with important evidence for reconstructing aspects of Visayan and Mindanao societies during the early 16th century and for understanding their cultures before extensive Spanish colonization.`,
    pills:["Complex society","Rich cultural practices","Metallurgy and body art","Thriving local economy"],
  },
  {
    id:"language", label:"📖 Language", color:"#8b6914",
    photos:[PHOTOS.manuscript, PHOTOS.parchment],
    captions:["Handwritten records preserve Pigafetta's early Cebuano vocabulary", "Parchment represents the written language evidence that survived"],
    quote:`"This king is the most handsome person we saw among these nations. He had a very beautiful and large golden dagger, and he spoke to us in the Moro language."`,
    body:`Pigafetta left vital records about language, including one of the earliest known European transcriptions of Cebuano vocabulary.

This record is critical primary evidence of pre-colonial Visayan language and helps historians understand Philippine society before widespread European influence.`,
    pills:["Early Cebuano vocabulary","Vital language record","Primary historical evidence","Pre-colonial Visayan language"],
  },
  {
    id:"customs", label:"🪔 Customs & Faith", color:"#6b4a1a",
    photos:[PHOTOS.warriors, PHOTOS.hut1],
    captions:["Visayan communities preserved rich traditions, dress, and ritual life", "Village life connected homes, feasts, music, and spiritual practice"],
    quote:`"They worship fire — but I showed them the cross and the image of Our Lady, which they kissed with clasped hands, lifting them toward the sky. And they asked that we leave them the cross."`,
    body:`Pigafetta recorded clothing, animistic beliefs, tattoos known through the Pintados, music, boat-making technology, and the environment.

His observations give insight into early animism—the worship of nature and anitos—before the widespread conversion to Catholicism.`,
    pills:["Animistic beliefs","Nature and anitos","Pintados tattoos","Music and boat-making"],
  },
  {
    id:"economy", label:"🥇 Gold & Trade", color:"#7a5e1a",
    photos:[PHOTOS.ph1, PHOTOS.ship1],
    captions:["Island settlements participated in established regional trade networks", "Ships carried gold, ceramics, food, and other goods across the seas"],
    quote:`"There is gold in this island in great quantities found in pieces as large as a walnut — the inhabitants gather ginger green and sell it for food. There is also rice, millet, and coconuts."`,
    body:`Pigafetta documented the abundance of gold worn by locals, agricultural practices involving rice and coconuts, and the consumption of palm wine or tuba.

This evidence reveals an understanding of metallurgy and a thriving local economy. It also helps debunk colonial myths that the Spanish brought civilization to a primitive land.`,
    pills:["Abundant gold","Rice and coconuts","Palm wine or tuba","Thriving local economy"],
  },
];

function Chapter3() {
  const [tab, setTab] = useState(0);
  const t = CH3_TABS[tab];

  return (
    <div className="theme-communities" style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden",
      background:"linear-gradient(160deg,#0a1a0a 0%,#1a0c00 45%,#0d0500 100%)", position:"relative" }}>
      <Particles count={12} color={GOLD}/>
      <Particles count={6} color="#4a8a1a"/>

      {/* Walking villagers */}
      <WalkingFigure type="warrior" dir="right" speed="15s" delay="0s"  bottom="3%"/>
      <WalkingFigure type="scholar" dir="left"  speed="20s" delay="7s"  bottom="3%"/>

      <div className="story-page-content" style={{ position:"relative", zIndex:5, display:"flex", flexDirection:"column", height:"100%", padding:"16px 20px" }}>
        <div>
          <ChapterLabel label="CONTRIBUTION 2 · DESCRIPTIONS OF FILIPINO COMMUNITIES (VISAYAS & MINDANAO)"/>
          <GoldTitle>The People of the Islands</GoldTitle>
          <Divider/>
        </div>

        {/* Tab bar */}
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"10px" }}>
          {CH3_TABS.map((tt,i)=>(
            <button key={tt.id} onClick={()=>setTab(i)}
              className="font-heading"
              style={{
                fontSize:"9px", letterSpacing:"0.08em", padding:"6px 12px",
                borderRadius:"4px 4px 0 0", cursor:"pointer",
                background: tab===i ? `${tt.color}22` : "rgba(20,8,0,0.85)",
                border:`1px solid ${tab===i ? tt.color : "#4a3010"}`,
                color: tab===i ? tt.color : "#7a5e1a", transition:"all 0.2s",
              }}
              onMouseEnter={e=>{ e.currentTarget.style.background=`${tt.color}18`; e.currentTarget.style.borderColor=tt.color; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=tab===i?`${tt.color}22`:"rgba(20,8,0,0.85)"; e.currentTarget.style.borderColor=tab===i?tt.color:"#4a3010"; }}
            >{tt.label}</button>
          ))}
        </div>

        <div className="chapter-layout chapter-layout--sidebar communities-layout" style={{ flex:1, display:"grid", gridTemplateColumns:"200px 1fr", gap:"10px", minHeight:0 }}>
          {/* Village scene + pills */}
          <div className="communities-visual" style={{ ...PANEL, border:`1px solid ${t.color}55`, display:"flex", flexDirection:"column" }}>
            <p className="font-heading" style={{ fontSize:"8px", letterSpacing:"0.2em", color:"#7a5e1a", margin:"0 0 6px" }}>✦ VISAYAS c. 1521 ✦</p>
            <VillageScene style={{ width:"100%", borderRadius:"4px" }}/>
            <div style={{ marginTop:"6px" }}>
              <PhotoStrip
                photos={t.photos}
                captions={t.captions}
              />
            </div>
            <Divider/>
            <p className="font-heading" style={{ fontSize:"8px", letterSpacing:"0.15em", color:"#7a5e1a", margin:"0 0 5px" }}>KEY FINDINGS</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
              {t.pills.map(p=><Pill key={p} text={p} color={t.color}/>)}
            </div>
            <Divider/>
            <div style={{ background:"rgba(200,168,75,0.06)", border:"1px solid #4a3010", borderRadius:"4px", padding:"8px" }}>
              <p className="font-heading" style={{ fontSize:"8px", color:BLOOD, margin:"0 0 4px" }}>✦ WHY IT MATTERS</p>
              <p className="font-body" style={{ fontSize:"9px", color:GOLD, lineHeight:1.6, margin:0 }}>
                It debunks colonial myths that the Spanish brought civilization to a primitive land.
                Historians heavily rely on these ethnographical notes to reconstruct what Visayan and Mindanaoan
                societies looked like before European influence altered them forever. <em>(NHCP)</em>
              </p>
            </div>
          </div>

          {/* Chronicle text */}
          <div className="communities-journal" style={{ ...PANEL, border:`1px solid ${t.color}55`, overflow:"auto" }}>
            <p className="font-heading" style={{ fontSize:"8px", letterSpacing:"0.2em", color:"#7a5e1a", margin:"0 0 8px" }}>✦ FROM THE JOURNAL OF PIGAFETTA ✦</p>
            <Quote text={t.quote} color={t.color}/>
            <Divider/>
            <p className="font-body" style={{ fontSize:"11px", lineHeight:1.78, color:GOLD, whiteSpace:"pre-line" }}>{t.body}</p>
            <Divider/>
            <p className="font-body" style={{ fontSize:"8px", color:"#4a3010", margin:0 }}>
              Source: Pigafetta, Antonio. <em>Journal of Magellan's Voyage</em>, 1522–1525.{" "}
              <a href="https://www.loc.gov/item/2021667606/" target="_blank" rel="noreferrer"
                style={{ color:"#7a5e1a", textDecoration:"underline", textUnderlineOffset:"2px" }}>
                Library of Congress ↗
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CHAPTER 4: Bonus Questions ─────────────────────────────────────────
const CH4_CARDS = [
  {
    id:"nochron", icon:"❓", color:"#8b6914",
    title:"What If He Never Wrote?",
    short:"Without his account, 16th-century Philippine history is nearly a blank.",
    quote:`"If Pigafetta's account did not exist, our knowledge of the 16th-century Philippines would be much more limited."`,
    content:`If Pigafetta's account did not exist, our knowledge of the 16th-century Philippines would be much more limited.

We would lack an important primary source on early Visayan languages, customs, beliefs, and social practices. We would also have less detailed information about the Battle of Mactan and Magellan's death. Pigafetta's eyewitness account helps historians understand and verify important events and aspects of Philippine society during the early 16th century.`,
    facts:["Only eyewitness account of Battle of Mactan","Oldest Cebuano vocabulary list","Primary source for NHCP research","Reconstructs pre-colonial Visayan society"],
  },
  {
    id:"bias", icon:"🔍", color:"#4a2a7a",
    title:"How Did His Identity Shape His Account?",
    short:"A 16th-century Catholic scholar loyal to the Spanish crown.",
    quote:`"His account therefore reflects a European and Christian perspective."`,
    content:`Pigafetta was a 16th-century European and Catholic, which influenced the way he described the people and cultures he encountered. His account therefore reflects a European and Christian perspective.

He sometimes described unfamiliar local customs and religious practices using European Christian ideas and terminology. Because of this perspective, his descriptions may not fully represent how local people understood their own beliefs and traditions. Pigafetta also greatly admired Magellan and portrayed him in a heroic light, especially in his account of Magellan's death at the Battle of Mactan.`,
    facts:["Eurocentric perspective throughout","Called animism 'pagan' and 'demonic'","Framed Magellan as heroic","Must be read critically alongside oral tradition"],
  },
];

function Chapter4() {
  const [active, setActive] = useState<string|null>(null);
  const card = CH4_CARDS.find(c=>c.id===active);

  return (
    <div className="theme-legacy" style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden",
      background:"linear-gradient(160deg,#0a0a1a 0%,#1a0c00 50%,#0a0500 100%)", position:"relative" }}>
      <Particles count={14} color={GOLD}/>

      <WalkingFigure type="scholar" dir="right" speed="20s" delay="0s" bottom="3%"/>
      <WalkingFigure type="scholar" dir="left"  speed="25s" delay="10s" bottom="3%"/>

      <div className="story-page-content" style={{ position:"relative", zIndex:5, display:"flex", flexDirection:"column", height:"100%", padding:"16px 20px" }}>
        <div>
          <ChapterLabel label="SECTION 4 · BONUS QUESTIONS"/>
          <GoldTitle>Beyond the Chronicle</GoldTitle>
          <Divider/>
        </div>

        <div className="chapter-layout chapter-layout--sidebar legacy-layout" style={{ flex:1, display:"grid", gridTemplateColumns:"200px 1fr", gridTemplateRows:"1fr auto", gap:"10px", minHeight:0 }}>

          {/* Scholar figure + source info */}
          <div className="legacy-source-panel" style={{ ...PANEL, display:"flex", flexDirection:"column", alignItems:"center", gridRow:"1/3" }}>
            <p className="font-heading" style={{ fontSize:"8px", letterSpacing:"0.2em", color:"#7a5e1a", margin:"0 0 6px" }}>✦ THE CHRONICLER ✦</p>
            <ScholarFigure style={{ width:"80px", marginBottom:"8px" }}/>
            <p className="font-heading" style={{ fontSize:"10px", letterSpacing:"0.1em", color:GOLD, textAlign:"center" }}>
              António Pigafetta
            </p>
            <div style={{ width:"100%", marginTop:"6px" }}>
              <PhotoCard src={PHOTOS.parchment} caption="Ancient parchment — Pigafetta wrote his chronicle c. 1524" height={80}/>
            </div>
            <p className="font-fell" style={{ fontStyle:"italic", fontSize:"9px", color:"#7a5e1a", textAlign:"center", marginBottom:"10px" }}>
              c. 1491–1531<br/>Italian scholar & explorer
            </p>
            <Divider/>
            <p className="font-heading" style={{ fontSize:"8px", letterSpacing:"0.15em", color:"#7a5e1a", margin:"0 0 5px" }}>PRIMARY SOURCE</p>
            <p className="font-body" style={{ fontSize:"9px", color:GOLD, lineHeight:1.65, textAlign:"center" }}>
              <a href="https://www.loc.gov/item/2021667606/" target="_blank" rel="noreferrer"
                style={{ color:GOLD, textDecoration:"underline", textUnderlineOffset:"2px" }}>
                <em>Journal of Magellan's Voyage</em> ↗
              </a><br/>
              Antonio Pigafetta (1522–1525)<br/><br/>
              Digitized manuscript · Library of Congress
            </p>
            <Divider/>
            <p className="font-heading" style={{ fontSize:"8px", letterSpacing:"0.15em", color:"#7a5e1a", margin:"0 0 5px" }}>OFFICIAL REFERENCE</p>
            <p className="font-body" style={{ fontSize:"9px", color:GOLD, lineHeight:1.6, textAlign:"center" }}>
              National Historical Commission of the Philippines (NHCP)<br/>
              “Antonio Pigafetta” Historical Marker (2021)
            </p>
          </div>

          {/* Detail panel */}
          <div className="legacy-detail-panel" style={{ ...PANEL, border:`1px solid ${card ? card.color : "#4a3010"}`, transition:"border-color 0.3s", overflow:"auto" }}>
            {card ? (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
                  <span style={{ fontSize:"22px" }}>{card.icon}</span>
                  <p className="font-heading" style={{ fontSize:"11px", letterSpacing:"0.1em", color:card.color, margin:0 }}>{card.title}</p>
                </div>
                <PhotoCard
                  src={card.id==="nochron" ? PHOTOS.manuscript : PHOTOS.parchment}
                  caption={card.id==="nochron" ? "Without Pigafetta's handwritten chronicle, this history would be lost to myth" : "A 16th-century European Catholic perspective shaped every word of the account"}
                  height={85}
                />
                <Divider/>
                <Quote text={card.quote} color={card.color}/>
                <Divider/>
                <p className="font-body" style={{ fontSize:"10px", lineHeight:1.78, color:GOLD, whiteSpace:"pre-line" }}>{card.content}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginTop:"8px" }}>
                  {card.facts.map(f=><Pill key={f} text={f} color={card.color}/>)}
                </div>
                <button onClick={()=>setActive(null)} className="font-heading"
                  style={{ marginTop:"10px", fontSize:"9px", letterSpacing:"0.15em", padding:"5px 12px",
                    background:"rgba(200,168,75,0.1)", border:"1px solid #7a5e1a", borderRadius:"3px", color:GOLD, cursor:"pointer" }}>
                  ← Back
                </button>
              </>
            ) : (
              <>
                <p className="font-heading" style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#7a5e1a", margin:"0 0 8px" }}>✦ SELECT A QUESTION TO EXPLORE ✦</p>
                <PhotoStrip
                  photos={[PHOTOS.parchment, PHOTOS.manuscript]}
                  captions={["Ancient parchment — the medium of Pigafetta's chronicle c. 1524", "Handwritten manuscript — preserved at Yale's Beinecke Library"]}
                />
                <Divider/>
                <Quote text={"\"What if Antonio Pigafetta had never written his account? How might his identity and perspective have influenced his descriptions?\""}/>
                <Divider/>
                <p className="font-body" style={{ fontSize:"10px", color:GOLD, lineHeight:1.7 }}>
                  Two guiding bonus questions close out this chronicle — select either card to read the full answer.
                </p>
              </>
            )}
          </div>

          {/* Cards */}
          <div style={{ gridColumn:"2/3", display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"8px" }}>
            {CH4_CARDS.map(c=>(
              <ClickCard key={c.id} icon={c.icon} title={c.title} short={c.short}
                color={c.color} active={active===c.id} onClick={()=>setActive(c.id)}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EPILOGUE ──────────────────────────────────────────────────────────────
const EPI_ITEMS = [
  { icon:"A", title:"What Did Pigafetta Contribute?", color:GOLD, body:"Pigafetta kept a detailed eyewitness record of the Magellan–Elcano expedition. He documented its route and dates, the places it visited, meetings with local leaders, Filipino words and customs, trade, religious practices, and the events surrounding the Battle of Mactan and Magellan's death.", sourceLinks:[] },
  { icon:"B", title:"What Does It Tell Us About the Philippines?", color:"#5ba9ae", body:"His account shows that Philippine communities in 1521 had organized leadership, diplomacy, regional trade, skilled boat-making, agriculture, goldworking, and distinct languages and customs. It also describes local beliefs, clothing, food, settlements, natural resources, and the political independence of communities such as Cebu and Mactan.", sourceLinks:[] },
  { icon:"C", title:"Why Is It Historically Important?", color:"#d16b5c", body:"Pigafetta's chronicle is one of the most detailed surviving eyewitness sources for the Philippines in 1521. Historians and students use it to reconstruct the expedition's timeline, study early Visayan society, language, and culture, and compare later interpretations of the Battle of Mactan. Because it reflects a sixteenth-century European viewpoint, it must also be read critically alongside other evidence.", sourceLinks:[] },
  { icon:"D", title:"What Source Supports Your Answer?", color:"#a889cf", body:"The main primary source is Antonio Pigafetta's First Voyage Around the World, also published in English as The First Voyage Round the World. The references below provide access to Pigafetta's chronicle and accounts of the Battle of Mactan.", sourceLinks:[
    { label:"Philippine Diary Project — Pigafetta's Journal", url:"https://philippinediaryproject.com/1521/04/26/26th-of-april-1521/" },
    { label:"The Battle of Mactan by Pigafetta — Scribd", url:"https://www.scribd.com/document/397900752/The-Battle-of-Mactan-by-Pigafetta" },
    { label:"Pigafetta's Chronicle — Library of Congress", url:"https://www.loc.gov/resource/gdcwdl.wdl_03082/?st=gallery" },
  ] },
];

function Epilogue({ onPlayVideo }: { onPlayVideo: () => void }) {
  const [open, setOpen] = useState<number|null>(null);

  return (
    <div className="theme-epilogue" style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden",
      background:"radial-gradient(ellipse at 50% 60%,#0a1a0a 0%,#0a0800 40%,#000 100%)", position:"relative" }}>
      <Particles count={22} color={GOLD}/>
      <Particles count={8} color="#4a8a1a"/>

      {/* Stars */}
      {[...Array(40)].map((_,i)=>(
        <div key={i} style={{
          position:"absolute", borderRadius:"50%",
          width:`${1+(i%3)}px`, height:`${1+(i%3)}px`, background:"#f5e6c8",
          top:`${(i*7.3+3)%55}%`, left:`${(i*13.7+5)%100}%`,
          opacity:0.2+(i%5)*0.1, animation:`torchFlicker ${2+(i%4)}s ease-in-out ${(i*0.35)%3}s infinite`,
        }}/>
      ))}

      <WalkingFigure type="warrior" dir="right" speed="18s" delay="0s"  bottom="2%"/>
      <WalkingFigure type="soldier" dir="left"  speed="22s" delay="9s"  bottom="2%"/>

      <div className="story-page-content epilogue-content" style={{ position:"relative", zIndex:5, display:"flex", flexDirection:"column", height:"100%", padding:"16px 20px", overflow:"auto" }}>
        <div>
          <ChapterLabel label="FINIS · END OF CHRONICLE"/>
          <GoldTitle>Ang Katapusan · The End</GoldTitle>
          <Divider/>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"6px", marginBottom:"12px" }}>
          {[
            { num:"1519", label:"Year of Departure" },
            { num:"270", label:"Men Sailed" },
            { num:"18", label:"Men Returned" },
            { num:"1521", label:"Battle of Mactan" },
            { num:"1522", label:"Circumnavigation" },
          ].map(s=>(
            <div key={s.num} style={{ background:"rgba(20,12,0,0.9)", border:"1px solid #4a3010", borderRadius:"5px", padding:"9px 6px", textAlign:"center" }}>
              <p className="font-display gold-text" style={{ fontSize:"18px", margin:"0 0 2px" }}>{s.num}</p>
              <p className="font-body" style={{ fontSize:"8px", color:"#7a5e1a", margin:0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Photo strip */}
        <div style={{ marginBottom:"10px" }}>
          <PhotoStrip
            photos={[PHOTOS.shipSilho, PHOTOS.ph1, PHOTOS.statue]}
            captions={["The Victoria — sole ship to complete the first circumnavigation, 1522", "The Philippine archipelago — 7,641 islands, home long before Magellan arrived", "Lapu-Lapu — first Filipino hero, defender of Mactan Island"]}
          />
        </div>

        {/* Closing quote */}
        <div style={{ ...PANEL, border:"1px solid #4a3010", marginBottom:"12px" }}>
          <p className="font-fell" style={{ fontStyle:"italic", fontSize:"12px", lineHeight:1.8, color:"#f5e6c8", margin:"0 0 8px" }}>
            "Magellan's voyage irrevocably connected the Philippines to the wider world. Though his expedition
            sought to claim the islands for Spain, he encountered peoples with rich cultures, sophisticated governance,
            and the will to defend their sovereignty. The Battle of Mactan stands as testimony: the islands were
            never passive, never empty. <strong style={{ color:GOLD }}>They were home.</strong>"
          </p>
          <p className="font-heading" style={{ fontSize:"8px", letterSpacing:"0.2em", color:"#7a5e1a", margin:0 }}>
            ✦ NHCP · QUINCENTENNIAL COMMEMORATIONS ✦
          </p>
        </div>

        {/* Accordion legacy items */}
        <p className="font-heading" style={{ fontSize:"8px", letterSpacing:"0.25em", color:"#7a5e1a", margin:"0 0 8px" }}>
          ✦ LASTING LEGACY — CLICK EACH TO EXPAND ✦
        </p>
        <div className="legacy-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"7px" }}>
          {EPI_ITEMS.map((item,i)=>(
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={()=>setOpen(open===i?null:i)}
              onKeyDown={e=>{ if (e.key==="Enter" || e.key===" ") { e.preventDefault(); setOpen(open===i?null:i); } }}
              style={{
                background: open===i ? `${item.color}18` : "rgba(14,7,0,0.9)",
                border:`1px solid ${open===i ? item.color : "#4a3010"}`,
                borderRadius:"5px", padding:"9px 11px", cursor:"pointer", textAlign:"left",
                transition:"all 0.22s",
              }}
              onMouseEnter={e=>{ e.currentTarget.style.background=`${item.color}12`; e.currentTarget.style.borderColor=item.color; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=open===i?`${item.color}18`:"rgba(14,7,0,0.9)"; e.currentTarget.style.borderColor=open===i?item.color:"#4a3010"; }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom: open===i?"7px":"0" }}>
                <span style={{ fontSize:"16px" }}>{item.icon}</span>
                <p className="font-heading" style={{ fontSize:"9px", letterSpacing:"0.08em", color:item.color, margin:0, flex:1 }}>{item.title}</p>
                <span className="font-heading" style={{ fontSize:"10px", color:item.color, transform: open===i?"rotate(90deg)":"rotate(0deg)", transition:"transform 0.2s", flexShrink:0 }}>▶</span>
              </div>
              {open===i && (
                <>
                  <p className="font-body" style={{ fontSize:"9px", lineHeight:1.65, color:GOLD, margin:0 }}>{item.body}</p>
                  {item.sourceLinks.length > 0 && (
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"5px", marginTop:"7px" }}>
                      {item.sourceLinks.map(source=>(
                        <a key={source.url} href={source.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
                          className="font-body" style={{ color:"#b9e4df", fontSize:"9px", textDecoration:"underline", textUnderlineOffset:"3px" }}>
                          {source.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onPlayVideo}
          className="font-heading"
          aria-label="Play the Pigafetta video"
          style={{
            alignSelf:"center", display:"flex", alignItems:"center", gap:"10px", marginTop:"14px",
            padding:"10px 22px", borderRadius:"999px", cursor:"pointer",
            background:"linear-gradient(135deg,#7a5e1a,#f0cc70,#7a5e1a)",
            border:"1px solid #f0cc70", color:"#140900", fontSize:"10px", letterSpacing:"0.16em",
            boxShadow:"0 0 22px rgba(240,204,112,0.28)",
          }}
        >
          <span aria-hidden="true" style={{ display:"grid", placeItems:"center", width:"28px", height:"28px", borderRadius:"50%", background:"#140900", color:GOLD2, fontSize:"13px", paddingLeft:"2px" }}>▶</span>
          PLAY PIGAFETTA VIDEO
        </button>

        <p className="font-fell" style={{ fontStyle:"italic", fontSize:"10px", color:"#2d1a00", textAlign:"center", marginTop:"10px" }}>
          "Sa lahat ng mga bayani ng ating bansa, si Lapu-Lapu ang pinakauna."
          <br/><span style={{ fontSize:"9px" }}>Among all the heroes of our nation, Lapu-Lapu was the first.</span>
        </p>
      </div>
    </div>
  );
}

function VideoScreen() {
  return (
    <div style={{
      width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(14px, 3vw, 34px)", boxSizing:"border-box", position:"relative", overflow:"hidden",
      background:"radial-gradient(ellipse at 50% 45%,#172414 0%,#07110d 48%,#020504 100%)",
    }}>
      <Particles count={18} color={GOLD}/>
      <div style={{ width:"min(1100px, 94vw)", position:"relative", zIndex:2 }}>
        <div style={{ textAlign:"center", marginBottom:"12px" }}>
          <GoldTitle>Antonio Pigafetta</GoldTitle>
        </div>
        <div style={{
          padding:"8px", borderRadius:"10px", background:"rgba(9,4,16,0.94)",
          border:"1px solid #7b5aa6", boxShadow:"0 18px 60px rgba(0,0,0,0.55)",
        }}>
          <video
            src={pigafettaVideo}
            controls
            autoPlay
            playsInline
            preload="metadata"
            style={{ display:"block", width:"100%", maxHeight:"68vh", borderRadius:"6px", background:"#000" }}
          >
            Your browser does not support the video element.
          </video>
        </div>
      </div>
    </div>
  );
}

// ── Navigation ─────────────────────────────────────────────────────────────
function NavBar({ screen, onNav }: { screen: Screen; onNav: (s: Screen, dir: "next"|"prev") => void }) {
  const idx = SCREENS.indexOf(screen);
  const canPrev = idx > 1;
  const canNext = idx < SCREENS.length - 1;

  const navBtn = (dir: "prev"|"next") => {
    const ni = dir==="next" ? idx+1 : idx-1;
    if (ni<1||ni>=SCREENS.length) return;
    onNav(SCREENS[ni], dir);
  };

  return (
    <div className="storybook-nav" style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"8px 18px", background:"rgba(6,3,0,0.97)", borderTop:"1px solid #2d1a00", flexShrink:0,
    }}>
      <button
        className="storybook-nav__button font-heading"
        onClick={()=>navBtn("prev")}
        style={{
          fontSize:"10px", letterSpacing:"0.15em", padding:"7px 16px", borderRadius:"4px",
          cursor: canPrev ? "pointer" : "not-allowed",
          background: canPrev ? "rgba(200,168,75,0.12)" : "rgba(26,12,0,0.4)",
          border:"1px solid #7a5e1a", color: canPrev ? GOLD : "#2d1a00",
          transition:"all 0.2s",
        }}
        onMouseEnter={e=>{ if(canPrev) e.currentTarget.style.background="rgba(200,168,75,0.22)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.background=canPrev?"rgba(200,168,75,0.12)":"rgba(26,12,0,0.4)"; }}
      >◀ PREV PAGE</button>

      {/* Chapter dots */}
      <div style={{ display:"flex", gap:"5px", alignItems:"center" }}>
        {SCREENS.slice(1).map((s,i)=>{
          const isAct = screen===s;
          return (
            <button key={s} title={SCREEN_NAMES[i+1]}
              onClick={()=>onNav(s, SCREENS.indexOf(s)>idx?"next":"prev")}
              className="font-heading"
              style={{
                width:"30px", height:"30px", borderRadius:"50%", fontSize:"10px", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                background: isAct ? "rgba(200,168,75,0.28)" : "rgba(20,10,0,0.8)",
                border:`1px solid ${isAct ? GOLD : "#4a3010"}`,
                color: isAct ? GOLD : "#7a5e1a", transition:"all 0.2s",
              }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(200,168,75,0.18)"; e.currentTarget.style.borderColor=GOLD; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=isAct?"rgba(200,168,75,0.28)":"rgba(20,10,0,0.8)"; e.currentTarget.style.borderColor=isAct?GOLD:"#4a3010"; }}
            >{SCREEN_TITLES[i+1]}</button>
          );
        })}
      </div>

      <button
        className="storybook-nav__button font-heading"
        onClick={()=>navBtn("next")}
        style={{
          fontSize:"10px", letterSpacing:"0.15em", padding:"7px 16px", borderRadius:"4px",
          cursor: canNext ? "pointer" : "not-allowed",
          background: canNext ? "linear-gradient(135deg,#7a5e1a,#c8a84b,#7a5e1a)" : "rgba(26,12,0,0.4)",
          border:`1px solid ${canNext ? GOLD : "#4a3010"}`,
          color: canNext ? "#1a0c00" : "#2d1a00",
          transition:"all 0.2s",
        }}
        onMouseEnter={e=>{ if(canNext) e.currentTarget.style.filter="brightness(1.15)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.filter="brightness(1)"; }}
      >NEXT PAGE ▶</button>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("title");
  const [anim, setAnim] = useState<"idle"|"exit"|"enter">("idle");
  const [dir, setDir] = useState<"next"|"prev">("next");
  const [pending, setPending] = useState<Screen|null>(null);

  const navigate = (to: Screen, d: "next"|"prev" = "next") => {
    if (anim !== "idle" || to === screen) return;
    setDir(d);
    setPending(to);
    setAnim("exit");
  };

  useEffect(() => {
    const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (anim === "exit") {
      const t = setTimeout(() => {
        setScreen(pending!);
        setAnim("enter");
      }, reducedMotion ? 180 : PAGE_EXIT_MS);
      return () => clearTimeout(t);
    }
    if (anim === "enter") {
      const t = setTimeout(() => {
        setAnim("idle");
        setPending(null);
      }, reducedMotion ? 180 : PAGE_ENTER_MS);
      return () => clearTimeout(t);
    }
  }, [anim, pending]);

  const exitClass = dir==="next" ? "page-exit" : "page-exit-rev";
  const enterClass = dir==="next" ? "page-enter" : "page-enter-rev";
  const animClass = anim==="exit" ? exitClass : anim==="enter" ? enterClass : "";

  return (
    <div className="storybook-app" style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", background:"#000" }}>
      <div className={`storybook-stage ${animClass}`} style={{ flex:1, position:"relative", overflow:"hidden" }}>
        {screen === "title"    && <TitleScreen goNext={()=>navigate("ch1","next")}/>}
        {screen === "ch1"      && <Chapter1/>}
        {screen === "ch2"      && <Chapter2/>}
        {screen === "ch3"      && <Chapter3/>}
        {screen === "ch4"      && <Chapter4/>}
        {screen === "epilogue" && <Epilogue onPlayVideo={()=>navigate("video","next")}/>}
        {screen === "video"    && <VideoScreen/>}
      </div>

      {screen !== "title" && (
        <NavBar screen={screen} onNav={navigate}/>
      )}
    </div>
  );
}

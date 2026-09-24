"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, PlusCircle, History, BarChart2,
  CalendarDays, Star, Settings, ChevronDown, AlertTriangle,
  CheckCircle2, Lightbulb, Plus, Scan,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────
interface NavItem { label: string; icon: React.ReactNode; active?: boolean; }
interface TopicBar { name: string; pct: number; color: string; }
interface ActivityItem {
  title: string; category: string; time: string;
  status: "Mistake" | "Correct"; equationLines: string[];
}

// ─── DATA ─────────────────────────────────────────────────
const navItems: NavItem[] = [
  { label: "Dashboard",    icon: <LayoutDashboard size={16}/>, active: true },
  { label: "New Problem",  icon: <PlusCircle size={16}/> },
  { label: "History",      icon: <History size={16}/> },
  { label: "Statistics",   icon: <BarChart2 size={16}/> },
  { label: "Study Plan",   icon: <CalendarDays size={16}/> },
  { label: "Achievements", icon: <Star size={16}/> },
  { label: "Settings",     icon: <Settings size={16}/> },
];

const weakTopics: TopicBar[] = [
  { name: "Linear Equations",    pct: 40, color: "#FF4D4D" },
  { name: "Quadratic Equations", pct: 60, color: "#FF9500" },
  { name: "Inequalities",        pct: 70, color: "#FFD60A" },
  { name: "Functions",           pct: 80, color: "#22C55E" },
];

const activities: ActivityItem[] = [
  { title: "2(x+3) = 3x + 5",        category: "Linear Equations",    time: "2 min ago",  status: "Mistake",  equationLines: ["2(x+3)=3x+5","2x+6=3x+5"] },
  { title: "(a+b)² = a² + 2ab + b²", category: "Algebra",             time: "1 hour ago", status: "Correct",  equationLines: ["(a+b)²=","a²+2ab+b²"] },
  { title: "Solve: x² − 5x + 6 = 0", category: "Quadratic Equations", time: "Yesterday",  status: "Correct",  equationLines: ["Solve:","x²−5x+6=0"] },
];

// ─── CIRCULAR PROGRESS ───────────────────────────────────
function CircularProgress({ pct = 75 }: { pct?: number }) {
  const r = 32, circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg width={80} height={80} viewBox="0 0 80 80">
        <circle cx={40} cy={40} r={r} fill="none" stroke="#EAEDF3" strokeWidth={7}/>
        <motion.circle
          cx={40} cy={40} r={r} fill="none"
          stroke="#6C4DFF" strokeWidth={7} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
          transform="rotate(-90 40 40)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-gray-900 leading-none">{pct}%</span>
        <span className="text-[9px] text-gray-400 mt-0.5">Correct</span>
      </div>
    </div>
  );
}

// ─── ANIMATED BAR ────────────────────────────────────────
function AnimatedBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-[5px] bg-gray-100 rounded-full overflow-hidden border border-gray-200">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
      />
    </div>
  );
}

// ─── NOTEBOOK SVG ─────────────────────────────────────────
function NotebookMath() {
  const lines = Array.from({ length: 14 }, (_, i) => (i + 1) * 20);
  const cols  = Array.from({ length: 13 }, (_, i) => (i + 1) * 20);
  return (
    <svg viewBox="0 0 260 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="260" height="280" fill="#f0ede5"/>
      <g stroke="#c8c0a8" strokeWidth="0.6" opacity="0.7">
        {lines.map(y => <line key={y} x1="0" y1={y} x2="260" y2={y}/>)}
        {cols.map(x  => <line key={x} x1={x} y1="0" x2={x} y2="280"/>)}
      </g>
      {[
        { y: 38,  text: "Solve for x:" },
        { y: 78,  text: "2(x + 3) = 3x + 5" },
        { y: 118, text: "2x + 6 = 3x + 5" },
        { y: 158, text: "2x − 3x = 5 − 6" },
        { y: 198, text: "  −x = −1" },
        { y: 238, text: "   x = 1" },
      ].map(({ y, text }) => (
        <text key={y} fontFamily="Georgia, serif" fontStyle="italic"
          fill="#2a2520" fontSize={y === 38 ? 15 : 17} x="25" y={y}>
          {text}
        </text>
      ))}
    </svg>
  );
}

// ─── MINI NOTEBOOK THUMB ─────────────────────────────────
function MiniThumb({ lines }: { lines: string[] }) {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"
      className="rounded-lg border border-gray-200">
      <rect width="40" height="40" fill="#f0ede5"/>
      <g stroke="#c8c0a8" strokeWidth="0.5">
        <line x1="0" y1="10" x2="40" y2="10"/>
        <line x1="0" y1="20" x2="40" y2="20"/>
        <line x1="0" y1="30" x2="40" y2="30"/>
      </g>
      {lines.map((l, i) => (
        <text key={i} fontFamily="serif" fontStyle="italic" fill="#333"
          fontSize="5.5" x="2" y={9 + i * 10}>{l}</text>
      ))}
    </svg>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────
export default function MathMentorDashboard() {
  const [activeTab, setActiveTab] = useState<"Analysis"|"Steps"|"Explanation">("Analysis");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#F4F5FB]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300 relative z-10"
        style={{
          width: sidebarOpen ? 228 : 64,
          background: "linear-gradient(170deg, #141825 0%, #0D1020 100%)",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          padding: "24px 14px",
          gap: 6,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2.5 pb-4 mb-1">
          <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-base shrink-0"
            style={{ background: "linear-gradient(135deg, #6C4DFF, #9B6DFF)", boxShadow: "0 4px 14px rgba(108,77,255,0.45)" }}>
            🧮
          </div>
          {sidebarOpen && (
            <span className="text-white font-bold text-[14.5px] tracking-tight whitespace-nowrap">
              MathMentor AI
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map((item) => (
            <div key={item.label}
              className="flex items-center gap-2.5 rounded-[10px] cursor-pointer transition-all duration-150 relative"
              style={{
                padding: "9px 12px",
                fontSize: "13.5px",
                fontWeight: 500,
                background: item.active ? "rgba(108,77,255,0.22)" : "transparent",
                color: item.active ? "#fff" : "rgba(255,255,255,0.45)",
              }}
              onMouseEnter={e => {
                if (!item.active) {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                }
              }}
              onMouseLeave={e => {
                if (!item.active) {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }
              }}
            >
              {item.active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-sm bg-[#6C4DFF]"/>
              )}
              <span className="opacity-80 shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </div>
          ))}
        </nav>

        {/* Upgrade card */}
        {sidebarOpen && (
          <div className="rounded-[14px] p-4 my-2"
            style={{
              background: "linear-gradient(135deg, rgba(108,77,255,0.25), rgba(155,109,255,0.12))",
              border: "1px solid rgba(108,77,255,0.3)",
            }}>
            <h4 className="text-white text-[13px] font-bold mb-1">Upgrade to Pro</h4>
            <p className="text-white/50 text-[11.5px] leading-[1.5] mb-3">
              Unlock unlimited scans and advanced AI explanations.
            </p>
            <button className="w-full rounded-lg py-2 text-white text-[12.5px] font-semibold transition-all"
              style={{ background: "linear-gradient(135deg, #6C4DFF, #9B6DFF)", boxShadow: "0 4px 14px rgba(108,77,255,0.4)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
              Upgrade Now
            </button>
          </div>
        )}

        {/* User */}
        <div className="flex items-center gap-2.5 pt-3 border-t border-white/[0.06] cursor-pointer rounded-[10px] px-2 py-2 hover:bg-white/[0.04] transition-colors">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #6C4DFF, #FF6B6B)" }}>
            A
          </div>
          {sidebarOpen && (
            <>
              <div className="flex-1">
                <div className="text-white text-[12.5px] font-semibold">Aibek</div>
                <div className="text-white/40 text-[11px]">Student</div>
              </div>
              <ChevronDown size={14} className="text-white/30"/>
            </>
          )}
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-8 pt-7 pb-5 shrink-0">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
              Welcome back, Таир! 👋
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Let's continue your learning journey.</p>
          </motion.div>
          <motion.button
            className="flex items-center gap-2 text-white rounded-[12px] px-5 py-[11px] text-[13.5px] font-semibold"
            style={{ background: "linear-gradient(135deg, #6C4DFF, #9B6DFF)", boxShadow: "0 6px 20px rgba(108,77,255,0.38)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ translateY: -2, boxShadow: "0 10px 28px rgba(108,77,255,0.5)" }}
          >
            <Plus size={15} strokeWidth={2.5}/>
            New Problem
          </motion.button>
        </header>

        {/* Content grid */}
        <div className="grid gap-5 flex-1 overflow-hidden min-h-0 px-8 pb-6"
          style={{ gridTemplateColumns: "1fr 310px" }}>

          {/* ── LEFT ────────────────────────────────────── */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-1 min-h-0">

            {/* Problem Analysis Card */}
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible"
              className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 pt-5 pb-0 text-[15px] font-bold text-gray-900 tracking-tight">
                Problem Analysis
              </div>
              <div className="grid gap-0 p-4 pb-5" style={{ gridTemplateColumns: "1fr 1fr" }}>

                {/* Notebook */}
                <div className="relative rounded-xl overflow-hidden bg-[#f0ede5] border border-gray-200 aspect-square max-h-[280px]">
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 text-[10.5px] font-semibold text-purple-600 rounded-full px-2.5 py-1 z-10"
                    style={{
                      background: "rgba(108,77,255,0.12)",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(108,77,255,0.25)",
                    }}>
                    <Scan size={10}/>
                    Scanned
                  </div>
                  <NotebookMath/>
                </div>

                {/* Analysis */}
                <div className="pl-4 flex flex-col gap-3">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-100 -mb-1">
                    {(["Analysis","Steps","Explanation"] as const).map(tab => (
                      <button key={tab}
                        className="px-3 pb-2.5 text-[12.5px] font-medium border-b-2 -mb-px transition-all"
                        style={{
                          color: activeTab === tab ? "#6C4DFF" : "#9CA3AF",
                          borderBottomColor: activeTab === tab ? "#6C4DFF" : "transparent",
                          fontWeight: activeTab === tab ? 600 : 500,
                        }}
                        onClick={() => setActiveTab(tab)}>
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Error box */}
                  <div className="rounded-xl p-3.5 bg-red-50 border border-red-100">
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-800 mb-2">
                      <AlertTriangle size={14} className="text-red-500"/>
                      Detected Errors
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-red-500 mb-1">
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">1</span>
                      Sign Error
                    </div>
                    <p className="text-[11.5px] text-gray-500 mb-2 leading-relaxed">There is a mistake in the subtraction step.</p>
                    <div className="flex items-center gap-2 text-[11px] mt-1">
                      <span className="text-gray-400 min-w-[72px]">You wrote:</span>
                      <span className="font-mono text-gray-700">2x − 3x = 5 − 6</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] mt-1.5">
                      <span className="text-gray-400 min-w-[72px]">Correct is:</span>
                      <span className="font-mono text-gray-700">2x − 3x = 5 − 6 →</span>
                      <span className="font-mono text-green-600 font-semibold">−x = −1</span>
                    </div>
                  </div>

                  {/* Solution box */}
                  <div className="rounded-xl p-3.5 bg-green-50 border border-green-100">
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-800 mb-2.5">
                      <CheckCircle2 size={14} className="text-green-500"/>
                      Correct Solution
                    </div>
                    <div className="font-mono text-[11px] text-gray-500 leading-[1.9]">
                      <div>2(x+3) = 3x + 5</div>
                      <div>2x + 6 = 3x + 5</div>
                      <div>2x − 3x = 5 − 6</div>
                      <div>−x = −1</div>
                      <div className="text-green-600 font-semibold">x = 1</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tip card */}
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible"
              className="flex items-center gap-4 rounded-[16px] p-4 border"
              style={{
                background: "linear-gradient(135deg, #F5F0FF, #EEF0FF)",
                borderColor: "rgba(108,77,255,0.12)",
              }}>
              <Lightbulb size={20} className="text-purple-500 shrink-0"/>
              <div className="flex-1">
                <div className="text-[12px] font-bold text-purple-600 mb-1">Personalized Tip</div>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  When moving terms with variables from one side to another, make sure to change the sign.
                </p>
                <div className="font-mono text-[11.5px] text-purple-500 mt-1.5">
                  Remember: &nbsp; a − b = −(b − a)
                </div>
              </div>
              <button className="text-white rounded-[10px] px-4 py-2.5 text-[12px] font-semibold whitespace-nowrap shrink-0 transition-all"
                style={{ background: "linear-gradient(135deg, #6C4DFF, #9B6DFF)", boxShadow: "0 4px 14px rgba(108,77,255,0.35)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                Practice Similar Problems
              </button>
            </motion.div>
          </div>

          {/* ── RIGHT ───────────────────────────────────── */}
          <div className="flex flex-col gap-4 overflow-y-auto min-h-0">

            {/* Progress */}
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible"
              className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-[18px]">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[14px] font-bold text-gray-900 tracking-tight">Your Progress</span>
                <span className="text-[11.5px] text-purple-500 font-semibold cursor-pointer">This Week ▾</span>
              </div>
              <div className="flex items-center gap-4">
                <CircularProgress pct={75}/>
                <div className="flex flex-col gap-2">
                  {[
                    { num: 12, color: "#6C4DFF", label: "Solved" },
                    { num: 9,  color: "#22C55E", label: "Correct" },
                    { num: 3,  color: "#FF4D4D", label: "Mistakes" },
                  ].map(({ num, color, label }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <span className="text-[18px] font-extrabold text-gray-900 w-6">{num}</span>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }}/>
                      <span className="text-[11.5px] text-gray-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Weak Topics */}
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible"
              className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-[18px]">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[14px] font-bold text-gray-900 tracking-tight">Weak Topics</span>
                <span className="text-[11.5px] text-purple-500 font-semibold cursor-pointer">View all</span>
              </div>
              <div className="flex flex-col gap-3">
                {weakTopics.map(({ name, pct, color }) => (
                  <div key={name}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="text-gray-500 font-medium">{name}</span>
                      <span className="text-gray-500 font-semibold">{pct}%</span>
                    </div>
                    <AnimatedBar pct={pct} color={color}/>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible"
              className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-[18px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[14px] font-bold text-gray-900 tracking-tight">Recent Activity</span>
                <span className="text-[11.5px] text-purple-500 font-semibold cursor-pointer">View all</span>
              </div>
              <div className="flex flex-col">
                {activities.map((a, i) => (
                  <div key={a.title}
                    className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-gray-50/70 transition-colors rounded-lg px-1"
                    style={{ borderBottom: i < activities.length - 1 ? "1px solid #EAEDF3" : "none" }}>
                    <MiniThumb lines={a.equationLines}/>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-gray-900 truncate">{a.title}</div>
                      <div className="text-[10.5px] text-gray-400">{a.category}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{a.time}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      a.status === "Mistake"
                        ? "bg-red-50 text-red-500"
                        : "bg-green-50 text-green-600"
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}

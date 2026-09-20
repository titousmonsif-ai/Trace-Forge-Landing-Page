import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  FileCode2,
  Film,
  Gauge,
  LogIn,
  Menu,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";

type Screen = "landing" | "cockpit" | "processing" | "result";

type StyleCard = {
  name: string;
  eyebrow: string;
  description: string;
  image: string;
  fallback: string;
  accent: string;
  slot: string;
  score: string;
};

const AMBIENT_VIDEO_URL =
  "/__mockup/images/trace-forge/workflow/cosmic-warp.mp4";
const RESULT_VIDEO_URL =
  "/__mockup/images/trace-forge/workflow/result-preview.mp4";

const styles: StyleCard[] = [
  {
    name: "Hardstyle",
    eyebrow: "High impact",
    description: "Snap-cut pacing, bass-led energy, no dead air.",
    image: "/__mockup/images/trace-forge/styles/hardstyle.jpg",
    fallback: "linear-gradient(135deg, #2b1553 0%, #100b1e 52%, #09090b 100%)",
    accent: "#A855F7",
    slot: "01",
    score: "94%",
  },
  {
    name: "Flow Style",
    eyebrow: "Natural rhythm",
    description: "A fluid sequence that follows the thought, not the clock.",
    image: "/__mockup/images/trace-forge/styles/flow.jpg",
    fallback: "linear-gradient(140deg, #47218c 0%, #19102c 48%, #09090b 100%)",
    accent: "#C084FC",
    slot: "02",
    score: "91%",
  },
  {
    name: "Jugg Style",
    eyebrow: "Fast cuts",
    description: "Keep attention moving with playful, precise interruption.",
    image: "/__mockup/images/trace-forge/styles/jugg.jpg",
    fallback: "linear-gradient(135deg, #662e91 0%, #231039 50%, #09090b 100%)",
    accent: "#A855F7",
    slot: "03",
    score: "88%",
  },
  {
    name: "Block Style",
    eyebrow: "Clean structure",
    description: "A confident grid of moments, captions, and clean silence.",
    image: "/__mockup/images/trace-forge/styles/block.jpg",
    fallback: "linear-gradient(135deg, #54206b 0%, #1d1028 52%, #09090b 100%)",
    accent: "#C084FC",
    slot: "04",
    score: "86%",
  },
  {
    name: "Hormozi Style",
    eyebrow: "Clarity first",
    description: "Make the idea impossible to miss. Then make it memorable.",
    image: "/__mockup/images/trace-forge/styles/hormozi.jpg",
    fallback: "linear-gradient(135deg, #7d35c7 0%, #2e164d 52%, #09090b 100%)",
    accent: "#A855F7",
    slot: "05",
    score: "97%",
  },
];

const navItems = [
  { label: "Home", screen: "landing" as const },
  { label: "Style cockpit", screen: "cockpit" as const },
];

const processingMessages = [
  "Analyzing audio beats...",
  "Slicing video keyframes...",
  "Generating edit preview...",
];

const viralTips = [
  "X prioritizes early reply velocity. Get 5 to 10 friends to comment within the first 20 minutes to push your post into the For You feed.",
  "On TikTok, change the visual camera angle or text overlay every 2.5 seconds to reset viewer attention spans and max out watch time.",
  "Start your audio mid-sentence or right before a beat drop. Skipping standard introductions boosts your 3-second hold rate by over 40 percent.",
  "Intentionally leave one tiny, harmless mistake in your caption. People in the comments will correct you, driving engagement numbers up.",
  "Make your final sentence lead directly into your very first sentence so viewers re-watch the opening without realizing it.",
  "Over 60 percent of short-form videos are watched on mute. Always use high-contrast subtitles on the lower third of the frame.",
];

function getCircularOffset(index: number, activeIndex: number, length: number) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function TraceLogo() {
  return (
    <span className="flex items-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginRight: 8, verticalAlign: "middle" }}
        aria-hidden="true"
      >
        <path d="M20 20 H80 V35 H57 V80 H43 V35 H20 Z" fill="url(#violet-grad)" />
        <defs>
          <linearGradient id="violet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <span className="bg-[linear-gradient(110deg,#C084FC_0%,#A855F7_52%,#7C3AED_100%)] bg-clip-text font-['Space_Grotesk'] text-[1.2rem] font-bold tracking-[0.16em] text-transparent drop-shadow-[0_0_16px_rgba(168,85,247,.28)]">
        TRACE
      </span>
    </span>
  );
}

function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07050c]">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-[0.22] mix-blend-screen"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src={AMBIENT_VIDEO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_73%_16%,rgba(139,92,246,.2),transparent_28%),radial-gradient(circle_at_20%_72%,rgba(168,85,247,.16),transparent_33%),linear-gradient(180deg,rgba(7,5,12,.76),rgba(7,5,12,.96))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,5,12,.72),transparent_48%,rgba(7,5,12,.64))]" />
    </div>
  );
}

function AppHeader({
  screen,
  onNavigate,
  onMenu,
  menuOpen,
}: {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  onMenu: () => void;
  menuOpen: boolean;
}) {
  return (
    <header className="relative z-40 mx-auto flex w-full max-w-[1480px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12 lg:py-7">
      <button
        type="button"
        onClick={() => onNavigate("landing")}
        className="group flex items-center gap-3 text-left"
        aria-label="TRACE home"
      >
        <TraceLogo />
      </button>

      <nav
        aria-label="Primary navigation"
        className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/45 p-1.5 shadow-[0_0_32px_rgba(139,92,246,.1)] backdrop-blur-xl lg:flex"
      >
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.screen)}
            className={`rounded-full px-4 py-2.5 text-[11px] font-medium transition-colors ${
              screen === item.screen
                ? "bg-white/10 text-white"
                : "text-white/55 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onNavigate("cockpit")}
          aria-label="Open style cockpit"
          className="group ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#A855F7] text-[#09090B] shadow-[0_0_22px_rgba(168,85,247,.55)] transition-transform hover:scale-105"
        >
          <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
        </button>
      </nav>

      <button
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={onMenu}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#A855F7]/60 bg-black/65 text-white shadow-[0_0_22px_rgba(168,85,247,.25)] lg:hidden"
      >
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute right-5 top-[78px] z-40 w-[min(280px,calc(100vw-40px))] rounded-3xl border border-[#A855F7]/45 bg-[#09090B]/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  onNavigate(item.screen);
                  onMenu();
                }}
                className="block w-full rounded-2xl px-4 py-3 text-left text-sm text-white/75 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function StepRail({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    ["01", "Source", "Footage ready"],
    ["02", "Style", "Shape the cut"],
    ["03", "Export", "Ship the edit"],
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-left">
      {steps.map(([number, label, hint], index) => {
        const step = index + 1;
        const complete = current > step;
        const active = current === step;
        return (
          <div key={number} className="flex min-w-max items-center gap-2">
            <div
              className={`flex h-9 items-center gap-2 rounded-full border px-3 ${
                active
                  ? "border-[#A855F7]/80 bg-[#A855F7]/15 text-white"
                  : complete
                    ? "border-[#C084FC]/35 bg-white/[0.06] text-white/75"
                    : "border-white/10 bg-white/[0.03] text-white/35"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                  active || complete
                    ? "bg-[#A855F7] text-[#09090B]"
                    : "bg-white/10 text-white/45"
                }`}
              >
                {complete ? <Check className="h-3 w-3" /> : number}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                {label}
              </span>
              <span className="hidden text-[10px] text-white/35 sm:inline">
                {hint}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className="h-px w-5 bg-gradient-to-r from-white/20 to-transparent" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-[#0d0a14]/75 shadow-[0_26px_100px_rgba(0,0,0,.36)] backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}

function StyleCardView({
  card,
  active,
  selected,
  offset,
  onSelect,
  onSlotSelect,
  onSwipe,
  reduceMotion,
}: {
  card: StyleCard;
  active: boolean;
  selected: boolean;
  offset: number;
  onSelect: () => void;
  onSlotSelect: () => void;
  onSwipe: (direction: number) => void;
  reduceMotion: boolean | null;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const isVisible = Math.abs(offset) <= 2;
  const positionX = offset * 210;

  return (
    <motion.article
      role="button"
      tabIndex={isVisible ? 0 : -1}
      aria-label={`Select ${card.name} editing style`}
      aria-current={active}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect();
      }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      onDragEnd={(_, info: PanInfo) => {
        if (Math.abs(info.offset.x) > 42) onSwipe(info.offset.x < 0 ? 1 : -1);
      }}
      initial={false}
      animate={{
        x: positionX,
        scale: active ? 1 : Math.abs(offset) === 1 ? 0.87 : 0.75,
        rotateY: active ? 0 : offset < 0 ? 34 : -34,
        rotateZ: active ? 0 : offset * (Math.abs(offset) === 1 ? 1 : 2),
        z: active ? 80 : -Math.abs(offset) * 24,
        opacity: active ? 1 : isVisible ? (Math.abs(offset) === 1 ? 0.48 : 0.16) : 0,
        transformPerspective: 1200,
        zIndex: 20 - Math.abs(offset),
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 250, damping: 27, mass: 0.8 }
      }
      className="absolute left-1/2 top-[calc(50%+34px)] origin-center -translate-x-1/2 -translate-y-1/2 cursor-grab touch-pan-y rounded-[1.65rem] text-left outline-none [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-[#A855F7] focus-visible:ring-offset-4 focus-visible:ring-offset-[#09090B] active:cursor-grabbing lg:top-1/2"
      style={{ width: "clamp(190px, 20vw, 288px)", height: "clamp(286px, 31vw, 420px)" }}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-[1.65rem] border bg-[#09090B]"
        style={{
          ...(imageFailed ? { background: card.fallback } : {}),
          borderColor: selected
            ? "#C084FC"
            : active
              ? "#A855F7"
              : "rgba(255,255,255,.14)",
          boxShadow: selected
            ? "0 0 0 1px rgba(192,132,252,.35), 0 0 75px rgba(168,85,247,.3), 0 28px 80px rgba(0,0,0,.58)"
            : "0 24px 70px rgba(0,0,0,.48)",
        }}
      >
        {!imageFailed && (
          <img
            src={card.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,.03)_20%,rgba(9,9,11,.18)_48%,rgba(9,9,11,.98)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,.11),transparent)]" />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/70">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: card.accent }} />
            {card.eyebrow}
          </span>
          <span className="text-white/35">Slot {card.slot}</span>
        </div>
        <div className="absolute inset-x-5 bottom-5">
          <div className="mb-2 flex items-end justify-between gap-2">
            <span className="block text-[clamp(1.15rem,2.2vw,1.75rem)] font-medium tracking-[-0.06em] text-white">
              {card.name}
            </span>
            <span className="text-[10px] font-semibold text-[#C084FC]">{card.score}</span>
          </div>
          <span className="block max-w-[15rem] text-[11px] leading-relaxed text-white/62">
            {card.description}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSlotSelect();
            }}
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-semibold transition ${
              selected
                ? "bg-[#C084FC] text-[#09090B] shadow-[0_0_18px_rgba(192,132,252,.55)]"
                : "border border-white/20 bg-black/35 text-white/75 hover:border-[#A855F7] hover:text-white"
            }`}
          >
            {selected ? <Check className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
            {selected ? "Slot selected" : `Select slot ${card.slot}`}
          </button>
        </div>
        {selected && (
          <motion.div
            layoutId="selected-card-line"
            className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-[#C084FC] shadow-[0_0_18px_rgba(192,132,252,.95)]"
          />
        )}
      </div>
    </motion.article>
  );
}

function Landing({
  onStart,
  onMessage,
  reduceMotion,
}: {
  onStart: () => void;
  onMessage: (message: string) => void;
  reduceMotion: boolean | null;
}) {
  return (
    <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-92px)] w-full max-w-[1480px] flex-col justify-center px-5 pb-10 pt-8 sm:px-8 lg:px-12 lg:pb-16">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,.9fr)_minmax(480px,1.1fr)] lg:gap-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 max-w-[720px]"
        >
          <div className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/62 sm:mb-8">
            <span className="h-px w-9 bg-[#C084FC] shadow-[0_0_14px_rgba(192,132,252,.9)]" />
            Professional video editing powered by AI.
          </div>
          <h1 className="font-['Space_Grotesk'] text-5xl font-medium leading-[0.86] tracking-[-0.095em] text-white sm:text-7xl lg:text-8xl 2xl:text-9xl">
            <span className="block">Edit fast to</span>
            <motion.span
              className="mt-2 block whitespace-nowrap bg-[linear-gradient(105deg,#8B5CF6_28%,#fff_48%,#C084FC_62%)] bg-[length:230%_100%] bg-clip-text text-transparent"
              animate={
                reduceMotion
                  ? { backgroundPosition: "0% 0%" }
                  : { backgroundPosition: ["200% 0%", "-30% 0%"] }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 3, repeat: Infinity, ease: "linear" }
              }
            >
              Edit in Seconds.
            </motion.span>
          </h1>
          <p className="mt-7 max-w-[430px] text-sm leading-relaxed text-white/58 sm:mt-9">
            Trace turns raw footage into polished, on-brand stories while you
            stay in the creative flow. Pick a direction, then let the cut
            assemble itself.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
            <button
              type="button"
              onClick={onStart}
              className="group inline-flex items-center gap-4 rounded-full bg-black px-5 py-3.5 text-[12px] font-semibold text-white shadow-[0_0_0_1px_rgba(192,132,252,.58),0_0_28px_rgba(139,92,246,.25)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC]"
            >
              Start Editing Now
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C084FC] text-[#09090B] shadow-[0_0_18px_rgba(192,132,252,.65)]">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => onMessage("Sign up is ready for your first Trace cut.")}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-3 text-[11px] font-medium text-white/75 transition-colors hover:border-[#A855F7]/70 hover:text-white"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => onMessage("Welcome back. Log in to pick up your edit.")}
              className="inline-flex items-center gap-2 px-2 py-3 text-[11px] font-medium text-white/55 transition-colors hover:text-white"
            >
              <LogIn className="h-3.5 w-3.5" />
              Log In
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-12 rounded-full bg-[#8B5CF6]/15 blur-[90px]" />
          <GlassPanel className="relative overflow-hidden p-5 sm:p-7">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C084FC]">
                  Your edit suite
                </p>
                <h2 className="mt-2 font-['Space_Grotesk'] text-3xl tracking-[-0.07em] text-white sm:text-4xl">
                  One brief. Three moves.
                </h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A855F7]/40 bg-[#A855F7]/10">
                <WandSparkles className="h-4 w-4 text-[#C084FC]" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["01", "Drop footage", "Bring your raw clip."],
                ["02", "Pick a style", "Set the rhythm."],
                ["03", "Ship the cut", "Export everywhere."],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-white/10 bg-black/25 p-4"
                >
                  <span className="font-['Space_Grotesk'] text-2xl tracking-[-0.08em] text-[#A855F7]">
                    {number}
                  </span>
                  <h3 className="mt-5 text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/45">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.18em] text-white/35">
              <span>Private by default</span>
              <span className="flex items-center gap-2 text-[#C084FC]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C084FC] shadow-[0_0_10px_rgba(192,132,252,.9)]" />
                Ready when you are
              </span>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
      <div className="mt-auto flex items-center justify-between pt-12 text-[9px] font-medium uppercase tracking-[0.22em] text-white/32">
        <span>Trace / 001</span>
        <span className="hidden sm:block">Precision for the moving image</span>
        <span className="flex items-center gap-2">
          Scroll to explore <ArrowDownRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </section>
  );
}

function Cockpit({
  activeIndex,
  selectedIndex,
  setActiveIndex,
  setSelectedIndex,
  onBack,
  onProcess,
  reduceMotion,
}: {
  activeIndex: number;
  selectedIndex: number;
  setActiveIndex: (index: number) => void;
  setSelectedIndex: (index: number) => void;
  onBack: () => void;
  onProcess: () => void;
  reduceMotion: boolean | null;
}) {
  const visibleCards = useMemo(
    () =>
      styles.map((card, index) => ({
        card,
        index,
        offset: getCircularOffset(index, activeIndex, styles.length),
      })),
    [activeIndex],
  );
  const selectedStyle = styles[selectedIndex];

  const move = (direction: number) => {
    const next = (activeIndex + direction + styles.length) % styles.length;
    setActiveIndex(next);
    setSelectedIndex(next);
  };

  return (
    <section className="relative z-10 mx-auto min-h-[calc(100dvh-92px)] w-full max-w-[1480px] px-5 pb-12 pt-3 sm:px-8 lg:px-12">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to landing
          </button>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C084FC]">
            Style cockpit / Step 02
          </p>
          <h1 className="mt-3 font-['Space_Grotesk'] text-4xl font-medium tracking-[-0.08em] text-white sm:text-6xl">
            Give the cut a point of view.
          </h1>
        </div>
        <StepRail current={2} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(240px,.36fr)_minmax(0,1fr)]">
        <GlassPanel className="flex flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C084FC]">
                <Film className="h-3.5 w-3.5" />
                Step 01
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#C084FC]">
                <Check className="h-3 w-3" />
                Ready
              </span>
            </div>
            <h2 className="mt-7 font-['Space_Grotesk'] text-3xl tracking-[-0.07em] text-white">
              Bring the raw moment.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/48">
              Your source clip stays private while Trace finds the hook, the
              pauses, and the moments worth keeping.
            </p>
            <div className="mt-7 rounded-2xl border border-[#A855F7]/25 bg-[#A855F7]/[0.08] p-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/45">
                <span>Source clip</span>
                <span>00:18</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A855F7]/20 text-[#C084FC]">
                  <Play className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">raw-footage.mp4</div>
                  <div className="mt-1 text-[10px] text-white/40">1080 × 1920 · ready to cut</div>
                </div>
              </div>
            </div>
          </div>
          <label className="mt-8 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-3 text-[11px] font-semibold text-white/75 transition-colors hover:border-[#A855F7]/70 hover:text-white">
            <Upload className="h-3.5 w-3.5" />
            Upload media
            <input type="file" accept="video/*,image/*" className="sr-only" />
          </label>
        </GlassPanel>

        <GlassPanel className="relative min-h-[620px] overflow-hidden p-5 sm:p-7">
          <div className="absolute left-1/2 top-1/2 h-[62%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B5CF6]/20 blur-[90px]" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C084FC]">
                <Sparkles className="h-3.5 w-3.5" />
                Step 02
              </span>
              <h2 className="mt-2 font-['Space_Grotesk'] text-2xl tracking-[-0.07em] text-white sm:text-3xl">
                Choose your edit language.
              </h2>
            </div>
            <span className="hidden rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[10px] text-white/45 sm:block">
              Drag to browse
            </span>
          </div>

          <div className="relative mt-4 h-[390px] [perspective:1200px] sm:h-[430px]">
            {visibleCards.map(({ card, index, offset }) => (
              <StyleCardView
                key={card.name}
                card={card}
                active={index === activeIndex}
                selected={index === selectedIndex}
                offset={offset}
                onSelect={() => {
                  setActiveIndex(index);
                  setSelectedIndex(index);
                }}
                onSlotSelect={() => {
                  setActiveIndex(index);
                  setSelectedIndex(index);
                }}
                onSwipe={move}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>

          <div className="relative flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous editing style"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/65 transition-colors hover:border-[#A855F7] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Editing styles">
              {styles.map((card, index) => (
                <button
                  key={card.name}
                  type="button"
                  role="tab"
                  aria-label={`Show ${card.name}`}
                  aria-selected={index === selectedIndex}
                  onClick={() => {
                    setActiveIndex(index);
                    setSelectedIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "w-7 bg-[#C084FC] shadow-[0_0_12px_rgba(192,132,252,.8)]"
                      : "w-1.5 bg-white/35 hover:bg-[#C084FC]"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next editing style"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/65 transition-colors hover:border-[#A855F7] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-5 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/38">Selected direction</p>
              <p className="mt-1 text-sm font-medium text-white">
                {selectedStyle.name}
                <span className="ml-2 text-[#C084FC]">/ {selectedStyle.score} predicted hold</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onProcess}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#C084FC] px-5 py-3 text-[11px] font-bold text-[#09090B] shadow-[0_0_24px_rgba(192,132,252,.3)] transition-transform hover:-translate-y-0.5"
            >
              Generate edit preview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}

function Processing({
  progress,
  message,
  onCancel,
}: {
  progress: number;
  message: string;
  onCancel: () => void;
}) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const tipTimer = window.setInterval(() => {
      setTipIndex((current) => (current + 1) % viralTips.length);
    }, 2500);

    return () => window.clearInterval(tipTimer);
  }, []);

  return (
    <section className="relative z-10 flex min-h-[calc(100dvh-92px)] items-center justify-center px-5 pb-16 pt-4 sm:px-8">
      <div className="w-full max-w-[720px] text-center">
        <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#A855F7]/25" />
          <div className="absolute inset-3 rounded-full border border-dashed border-[#C084FC]/50 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-8 rounded-full bg-[#A855F7]/20 blur-xl" />
          <svg
            width="24"
            height="24"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: 8, verticalAlign: "middle" }}
            aria-hidden="true"
            className="relative h-9 w-9"
          >
            <path d="M20 20 H80 V35 H57 V80 H43 V35 H20 Z" fill="url(#violet-grad)" />
            <defs>
              <linearGradient id="violet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p className="mt-9 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C084FC]">
          Trace / processing edit
        </p>
        <h1 className="mt-4 font-['Space_Grotesk'] text-4xl tracking-[-0.08em] text-white sm:text-6xl">
          Making the rhythm visible.
        </h1>
        <div className="mx-auto mt-9 max-w-[520px] rounded-[2rem] border border-white/10 bg-[#0d0a14]/70 p-5 text-left shadow-2xl backdrop-blur-2xl sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-white">{message}</span>
            <span className="text-sm font-semibold text-[#C084FC]">{progress}%</span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#8B5CF6,#C084FC)] shadow-[0_0_18px_rgba(192,132,252,.75)]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.4 }}
            />
          </div>
          <div className="mt-4 rounded-2xl border border-[#A855F7]/20 bg-white/[0.05] p-4 shadow-[0_0_24px_rgba(168,85,247,.1)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C084FC]">
              Viral algorithm tip
            </p>
            <div className="relative mt-2 min-h-[3.5rem] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-xs leading-relaxed text-white/70"
                >
                  {viralTips[tipIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {processingMessages.map((item, index) => {
              const done = progress >= (index + 1) * 33;
              return (
                <div key={item} className={`flex items-center gap-2 text-[10px] ${done ? "text-[#C084FC]" : "text-white/35"}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? "bg-[#A855F7]/25" : "bg-white/10"}`}>
                    {done ? <Check className="h-3 w-3" /> : `0${index + 1}`}
                  </span>
                  {item.replace("...", "")}
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="mt-7 inline-flex items-center gap-2 text-[11px] text-white/40 transition-colors hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Return to style cockpit
        </button>
      </div>
    </section>
  );
}

function ResultScreen({
  selectedStyle,
  onNewEdit,
  onMessage,
  reduceMotion,
}: {
  selectedStyle: StyleCard;
  onNewEdit: () => void;
  onMessage: (message: string) => void;
  reduceMotion: boolean | null;
}) {
  return (
    <section className="relative z-10 mx-auto min-h-[calc(100dvh-92px)] w-full max-w-[1480px] px-5 pb-14 pt-3 sm:px-8 lg:px-12">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <button
            type="button"
            onClick={onNewEdit}
            className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to cockpit
          </button>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C084FC]">
            Result / Step 03
          </p>
          <h1 className="mt-3 font-['Space_Grotesk'] text-4xl font-medium tracking-[-0.08em] text-white sm:text-6xl">
            Your cut is ready to ship.
          </h1>
        </div>
        <StepRail current={3} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,.92fr)]">
        <GlassPanel className="overflow-hidden p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A855F7]/20 text-[#C084FC]">
                <Play className="h-4 w-4 fill-current" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">retention_cut_01.mp4</p>
                <p className="mt-1 text-[10px] text-white/40">{selectedStyle.name} · 00:18 · 1080 × 1920</p>
              </div>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-[#C084FC]/25 bg-[#C084FC]/10 px-3 py-2 text-[10px] font-semibold text-[#C084FC]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C084FC] shadow-[0_0_10px_rgba(192,132,252,.9)]" />
              Preview ready
            </span>
          </div>
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
            <video
              className="aspect-square w-full object-cover sm:aspect-[16/10]"
              controls
              playsInline
              preload="metadata"
              src={RESULT_VIDEO_URL}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-[9px] uppercase tracking-[0.18em] text-white/60">
              <span>Trace preview</span>
              <span>Pinkman source / {selectedStyle.name}</span>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/38">
              <span>Retention timeline</span>
              <span>00:00 — 00:18</span>
            </div>
            <div className="relative mt-3 h-10 overflow-hidden rounded-xl border border-white/10 bg-black/35 px-2">
              <div className="flex h-full items-center gap-1">
                {Array.from({ length: 52 }).map((_, index) => (
                  <span
                    key={index}
                    className={`w-full rounded-full ${index < 38 ? "bg-[#A855F7]" : "bg-white/15"}`}
                    style={{ height: `${18 + ((index * 17) % 20)}%` }}
                  />
                ))}
              </div>
              <span className="absolute left-[72%] top-0 h-full w-px bg-[#C084FC] shadow-[0_0_10px_rgba(192,132,252,.9)]" />
            </div>
            <div className="mt-2 flex justify-between text-[9px] text-white/30">
              <span>Hook</span>
              <span>Peak moment</span>
              <span>Close</span>
            </div>
          </div>
        </GlassPanel>

        <div className="space-y-5">
          <GlassPanel className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C084FC]">Edit intelligence</p>
                <h2 className="mt-2 font-['Space_Grotesk'] text-2xl tracking-[-0.07em] text-white">Retention stats</h2>
              </div>
              <Gauge className="h-6 w-6 text-[#A855F7]" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                ["72%", "predicted hold"],
                ["94", "hook strength"],
                ["18s", "final runtime"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <div className="font-['Space_Grotesk'] text-2xl tracking-[-0.08em] text-white">{value}</div>
                  <div className="mt-2 text-[9px] uppercase leading-relaxed tracking-[0.1em] text-white/38">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#C084FC]">
              <Sparkles className="h-3.5 w-3.5" />
              Strongest beat found at 00:12
            </div>
          </GlassPanel>

          <GlassPanel className="p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C084FC]">Deliverables</p>
            <h2 className="mt-2 font-['Space_Grotesk'] text-2xl tracking-[-0.07em] text-white">Take it anywhere.</h2>
            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={() => onMessage("MP4 download prepared.")}
                className="group flex items-center justify-between rounded-full bg-[#C084FC] px-4 py-3.5 text-left text-[11px] font-bold text-[#09090B] shadow-[0_0_22px_rgba(192,132,252,.25)] transition-transform hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2"><Download className="h-4 w-4" /> Download MP4</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => onMessage("XML timeline prepared for export.")}
                className="flex items-center justify-between rounded-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-left text-[11px] font-semibold text-white/75 transition-colors hover:border-[#A855F7] hover:text-white"
              >
                <span className="flex items-center gap-2"><FileCode2 className="h-4 w-4" /> Export XML</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onMessage("FCPXML timeline prepared for export.")}
                className="flex items-center justify-between rounded-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-left text-[11px] font-semibold text-white/75 transition-colors hover:border-[#A855F7] hover:text-white"
              >
                <span className="flex items-center gap-2"><FileCode2 className="h-4 w-4" /> Export FCPXML</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}

export function TraceForgeHero() {
  const reduceMotion = useReducedMotion();
  const [screen, setScreen] = useState<Screen>("landing");
  const [activeIndex, setActiveIndex] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (screen !== "processing") return;
    setProgress(8);
    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(96, current + 8));
    }, 330);
    const resultTimer = window.setTimeout(() => {
      setProgress(100);
      setScreen("result");
    }, 3900);
    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(resultTimer);
    };
  }, [screen]);

  const selectedStyle = styles[selectedIndex];
  const processingStage = Math.min(2, Math.floor(progress / 34));

  const navigate = (nextScreen: Screen) => {
    setMenuOpen(false);
    if (nextScreen === "processing") return;
    setScreen(nextScreen);
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#07050c] font-['DM_Sans'] text-white selection:bg-[#C084FC] selection:text-[#09090B]">
      <AmbientBackdrop />
      <AppHeader
        screen={screen}
        onNavigate={navigate}
        onMenu={() => setMenuOpen((open) => !open)}
        menuOpen={menuOpen}
      />

      <AnimatePresence mode="wait">
        {screen === "landing" && (
          <motion.div
            key="landing"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <Landing
              onStart={() => setScreen("cockpit")}
              onMessage={setToast}
              reduceMotion={reduceMotion}
            />
          </motion.div>
        )}
        {screen === "cockpit" && (
          <motion.div
            key="cockpit"
            initial={reduceMotion ? false : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -10 }}
            transition={{ duration: 0.35 }}
          >
            <Cockpit
              activeIndex={activeIndex}
              selectedIndex={selectedIndex}
              setActiveIndex={setActiveIndex}
              setSelectedIndex={setSelectedIndex}
              onBack={() => setScreen("landing")}
              onProcess={() => setScreen("processing")}
              reduceMotion={reduceMotion}
            />
          </motion.div>
        )}
        {screen === "processing" && (
          <motion.div
            key="processing"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Processing
              progress={progress}
              message={processingMessages[processingStage]}
              onCancel={() => setScreen("cockpit")}
            />
          </motion.div>
        )}
        {screen === "result" && (
          <motion.div
            key="result"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
          >
            <ResultScreen
              selectedStyle={selectedStyle}
              onNewEdit={() => setScreen("cockpit")}
              onMessage={setToast}
              reduceMotion={reduceMotion}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            role="status"
            className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#C084FC]/40 bg-[#120d1b]/95 px-4 py-3 text-[11px] text-white shadow-2xl backdrop-blur-xl"
          >
            <Check className="h-3.5 w-3.5 text-[#C084FC]" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default TraceForgeHero;
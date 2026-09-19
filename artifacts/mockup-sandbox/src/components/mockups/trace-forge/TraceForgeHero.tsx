import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";

type StyleCard = {
  name: string;
  eyebrow: string;
  description: string;
  image: string;
  fallback: string;
  accent: string;
};

const VIDEO_URL =
  "/__mockup/images/trace-forge/hero.mp4";

const styles: StyleCard[] = [
  {
    name: "Hardstyle",
    eyebrow: "High impact",
    description: "Snap-cut pacing, bass-led energy, no dead air.",
    image: "/__mockup/images/trace-forge/styles/hardstyle.jpg",
    fallback: "linear-gradient(135deg, #2b1553 0%, #100b1e 52%, #09090b 100%)",
    accent: "#A855F7",
  },
  {
    name: "Flow Style",
    eyebrow: "Natural rhythm",
    description: "A fluid sequence that follows the thought, not the clock.",
    image: "/__mockup/images/trace-forge/styles/flow.jpg",
    fallback: "linear-gradient(140deg, #47218c 0%, #19102c 48%, #09090b 100%)",
    accent: "#A855F7",
  },
  {
    name: "Jugg Style",
    eyebrow: "Fast cuts",
    description: "Keep attention moving with playful, precise interruption.",
    image: "/__mockup/images/trace-forge/styles/jugg.jpg",
    fallback: "linear-gradient(135deg, #662e91 0%, #231039 50%, #09090b 100%)",
    accent: "#A855F7",
  },
  {
    name: "Block Style",
    eyebrow: "Clean structure",
    description: "A confident grid of moments, captions, and clean silence.",
    image: "/__mockup/images/trace-forge/styles/block.jpg",
    fallback: "linear-gradient(135deg, #54206b 0%, #1d1028 52%, #09090b 100%)",
    accent: "#A855F7",
  },
  {
    name: "Hormozi Style",
    eyebrow: "Clarity first",
    description: "Make the idea impossible to miss. Then make it memorable.",
    image: "/__mockup/images/trace-forge/styles/hormozi.jpg",
    fallback: "linear-gradient(135deg, #7d35c7 0%, #2e164d 52%, #09090b 100%)",
    accent: "#A855F7",
  },
];

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Styles", href: "#styles" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact Us", href: "#contact" },
];

function getCircularOffset(index: number, activeIndex: number, length: number) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function BrandMark() {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-white" />
    </span>
  );
}

function StyleCardView({
  card,
  active,
  offset,
  onSelect,
  onSwipe,
  reduceMotion,
}: {
  card: StyleCard;
  active: boolean;
  offset: number;
  onSelect: () => void;
  onSwipe: (direction: number) => void;
  reduceMotion: boolean | null;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const isVisible = Math.abs(offset) <= 2;
  const cardWidth = "clamp(185px, 20vw, 292px)";
  const positionX = offset * 250;

  return (
    <motion.button
      type="button"
      aria-label={`Select ${card.name} editing style`}
      aria-pressed={active}
      onClick={onSelect}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      onDragEnd={(_, info: PanInfo) => {
        if (Math.abs(info.offset.x) > 42) onSwipe(info.offset.x < 0 ? 1 : -1);
      }}
      initial={false}
      animate={{
        x: positionX,
        scale: active ? 1 : Math.abs(offset) === 1 ? 0.86 : 0.74,
        rotateY: active ? 0 : offset < 0 ? 35 : -35,
        rotateZ: active ? 0 : offset * (Math.abs(offset) === 1 ? 1 : 2),
        z: active ? 70 : -Math.abs(offset) * 20,
        opacity: active ? 1 : isVisible ? (Math.abs(offset) === 1 ? 0.48 : 0.16) : 0,
        transformPerspective: 1200,
        zIndex: 20 - Math.abs(offset),
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 250, damping: 27, mass: 0.8 }
      }
      className="absolute left-1/2 top-[calc(50%+96px)] origin-center -translate-x-1/2 -translate-y-1/2 cursor-grab touch-pan-y rounded-[1.65rem] text-left outline-none [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-[#A855F7] focus-visible:ring-offset-4 focus-visible:ring-offset-[#09090B] active:cursor-grabbing lg:top-1/2"
      style={{
        width: cardWidth,
        height: "clamp(270px, 31vw, 420px)",
        transformStyle: "preserve-3d",
      }}
    >
      <span
        className="absolute inset-0 overflow-hidden rounded-[1.65rem] border bg-[#09090B]"
        style={{
          ...(imageFailed ? { background: card.fallback } : {}),
          borderColor: active ? "#A855F7" : "rgba(255,255,255,.14)",
          boxShadow: active
            ? "0 0 0 1px rgba(168,85,247,.32), 0 0 70px rgba(139,92,246,.28), 0 28px 80px rgba(0,0,0,.58)"
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
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,.02)_22%,rgba(9,9,11,.18)_52%,rgba(9,9,11,.96)_100%)]" />
        <span className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,.1),transparent)]" />
        <span className="absolute left-5 top-5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/70">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: card.accent }} />
          {card.eyebrow}
        </span>
        <span className="absolute inset-x-5 bottom-5">
          <span className="mb-2 block text-[clamp(1.15rem,2.2vw,1.75rem)] font-medium tracking-[-0.06em] text-white">
            {card.name}
          </span>
          <span className="block max-w-[15rem] text-[11px] leading-relaxed text-white/62">
            {card.description}
          </span>
        </span>
        {active && (
          <motion.span
            layoutId="active-card-line"
            className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-[#A855F7] shadow-[0_0_18px_rgba(168,85,247,.95)]"
          />
        )}
      </span>
    </motion.button>
  );
}

export function TraceForgeHero() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ctaMessage, setCtaMessage] = useState(false);

  const activeCard = styles[activeIndex];
  const visibleCards = useMemo(
    () =>
      styles.map((card, index) => ({
        card,
        index,
        offset: getCircularOffset(index, activeIndex, styles.length),
      })),
    [activeIndex],
  );

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + styles.length) % styles.length);
  };

  const handleSwipe = (direction: number) => {
    move(direction);
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#09090B] font-['DM_Sans'] text-white selection:bg-[#A855F7] selection:text-[#09090B]">
      <section id="home" className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
        <video
          className="absolute inset-0 -z-20 h-screen w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=1800"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-black/80" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_68%_38%,rgba(139,92,246,.28),transparent_30%),radial-gradient(circle_at_20%_52%,rgba(168,85,247,.18),transparent_32%),linear-gradient(90deg,rgba(9,9,11,.98)_0%,rgba(9,9,11,.78)_42%,rgba(9,9,11,.36)_100%)]" />

        <header className="relative z-30 mx-auto flex w-full max-w-[1480px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12 xl:py-8">
          <a href="#home" className="group flex items-center gap-3" aria-label="Trace.ai home">
            <BrandMark />
            <span className="text-[1.05rem] font-semibold tracking-[-0.04em] text-white">
              Trace<span className="text-[#A855F7]">.ai</span>
            </span>
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/55 p-1.5 shadow-[0_0_32px_rgba(139,92,246,.1)] backdrop-blur-xl lg:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2.5 text-[11px] font-medium text-white/58 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              aria-label="Go to contact section"
              className="group ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#A855F7] text-[#09090B] shadow-[0_0_22px_rgba(168,85,247,.55)] transition-transform hover:scale-105"
            >
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#A855F7]/60 bg-black/65 text-white shadow-[0_0_22px_rgba(168,85,247,.25)] lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

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
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm text-white/75 hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        <div className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-1 flex-col justify-center px-5 pb-12 pt-8 sm:px-8 lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)] lg:items-center lg:gap-8 lg:px-12 lg:pb-24 lg:pt-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 max-w-[680px]"
          >
            <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/62 sm:mb-7">
              <span className="h-px w-9 bg-[#A855F7] shadow-[0_0_14px_rgba(168,85,247,.9)]" />
              Professional video editing powered by AI.
            </div>
            <h1 className="font-['Space_Grotesk'] text-5xl font-medium leading-[0.85] tracking-[-0.095em] text-white sm:text-7xl lg:text-8xl 2xl:text-9xl">
              <span className="block">Edit fast to</span>
              <motion.span
                className="mt-2 block whitespace-nowrap bg-[linear-gradient(105deg,#8B5CF6_35%,#fff_48%,#A855F7_60%)] bg-[length:230%_100%] bg-clip-text text-transparent"
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
            <p className="mt-7 max-w-[370px] text-sm leading-relaxed text-white/56 sm:mt-9">
              Your best ideas deserve a clean cut. Trace turns raw footage into
              polished, on-brand stories while you stay in the creative flow.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4 sm:mt-9">
              <button
                type="button"
                onClick={() => setCtaMessage(true)}
                className="group inline-flex items-center gap-4 rounded-full bg-black px-5 py-3.5 text-[12px] font-semibold text-white shadow-[0_0_0_1px_rgba(168,85,247,.48),0_0_28px_rgba(139,92,246,.2)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]"
              >
                Start Editing Now
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A855F7] text-[#09090B] shadow-[0_0_18px_rgba(168,85,247,.65)]">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              <a
                href="#styles"
                className="inline-flex items-center gap-2 text-[11px] font-medium text-white/60 transition-colors hover:text-white"
              >
                Explore styles
                <ArrowDownRight className="h-4 w-4" />
              </a>
            </div>
            <AnimatePresence>
              {ctaMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-xs text-[#C084FC]"
                  role="status"
                >
                  Your edit suite is ready. Pick a style to start your first cut.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            id="styles"
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-12 min-h-[365px] lg:mt-0 lg:min-h-[485px]"
          >
            <div className="absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B5CF6]/20 blur-[85px]" />
            <div className="absolute left-1/2 top-1/2 h-[88%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-[#A855F7]/35 to-transparent" />
            <div className="absolute left-1/2 top-1/2 h-px w-[94%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#A855F7]/25 to-transparent" />
            <div className="relative h-full [perspective:1200px]">
              {visibleCards.map(({ card, index, offset }) => (
                <StyleCardView
                  key={card.name}
                  card={card}
                  active={index === activeIndex}
                  offset={offset}
                  onSelect={() => setActiveIndex(index)}
                  onSwipe={handleSwipe}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSwipe(-1)}
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
                    aria-selected={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex ? "w-7 bg-[#A855F7] shadow-[0_0_12px_rgba(168,85,247,.8)]" : "w-1.5 bg-white/35 hover:bg-[#C084FC]"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleSwipe(1)}
                aria-label="Next editing style"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/65 transition-colors hover:border-[#A855F7] hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute right-0 top-0 hidden items-center gap-2 text-[9px] font-medium uppercase tracking-[0.2em] text-white/38 sm:flex">
              <Play className="h-3 w-3 fill-current" />
              drag to browse
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1480px] items-center justify-between px-5 pb-5 text-[9px] font-medium uppercase tracking-[0.22em] text-white/35 sm:px-8 lg:px-12 lg:pb-8">
          <span>Trace / 001</span>
          <span className="hidden sm:block">Precision for the moving image</span>
          <span className="flex items-center gap-2">
            Scroll to explore <ArrowDownRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </section>

      <section id="about" className="relative overflow-hidden border-t border-white/10 bg-[#0d0a14] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C084FC]">The edit suite, rethought</p>
            <h2 className="max-w-md font-['Space_Grotesk'] text-4xl font-medium leading-[0.95] tracking-[-0.07em] text-white sm:text-6xl">
              More instinct.
              <br />
              Less interface.
            </h2>
          </div>
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <span className="mb-5 block font-['Space_Grotesk'] text-5xl tracking-[-0.08em] text-[#A855F7]">01</span>
              <h3 className="mb-3 text-lg font-medium text-white">Your rhythm, recognized.</h3>
              <p className="text-sm leading-relaxed text-white/50">
                Trace hears the pauses, finds the moments, and understands the shape of a story before you start dragging clips.
              </p>
            </div>
            <div>
              <span className="mb-5 block font-['Space_Grotesk'] text-5xl tracking-[-0.08em] text-[#A855F7]">02</span>
              <h3 className="mb-3 text-lg font-medium text-white">Polish at the speed of thought.</h3>
              <p className="text-sm leading-relaxed text-white/50">
                Pick a direction, make it yours, and ship a cut that feels deliberate — not algorithmic.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="border-t border-white/10 bg-[#09090B] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C084FC]">Made for momentum</p>
              <h2 className="font-['Space_Grotesk'] text-4xl font-medium tracking-[-0.07em] text-white sm:text-5xl">Cuts that keep up.</h2>
            </div>
            <Sparkles className="h-7 w-7 text-[#A855F7]" />
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              ["“I stopped editing around the software.”", "Mina Okafor", "Creator / 1.2M followers"],
              ["“The first cut finally sounds like me.”", "Caleb Rios", "Documentary filmmaker"],
              ["“I can test five hooks before lunch.”", "Juno Park", "Founder, Goodform"],
            ].map(([quote, name, role]) => (
              <figure key={name} className="bg-[#120d1b] p-7 sm:p-9">
                <blockquote className="min-h-[96px] text-xl leading-snug tracking-[-0.04em] text-white">{quote}</blockquote>
                <figcaption className="mt-8 border-t border-white/10 pt-5">
                  <div className="text-sm font-medium text-white">{name}</div>
                  <div className="mt-1 text-xs text-white/40">{role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden border-t border-white/10 bg-[#8B5CF6] px-5 py-24 text-[#09090B] sm:px-8 lg:px-12 lg:py-28">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[34px] border-[#09090B]/10" />
        <div className="absolute -bottom-36 left-[36%] h-96 w-96 rounded-full border-[46px] border-[#09090B]/[0.07]" />
        <div className="relative mx-auto flex max-w-[1240px] flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#09090B]/60">Your next cut starts here</p>
            <h2 className="max-w-3xl font-['Space_Grotesk'] text-5xl font-medium leading-[0.88] tracking-[-0.09em] sm:text-7xl">
              Make the footage
              <br />
              feel inevitable.
            </h2>
          </div>
          <a
            href="#home"
            className="group inline-flex shrink-0 items-center gap-4 rounded-full bg-[#09090B] px-5 py-3.5 text-[12px] font-semibold text-white shadow-[0_0_28px_rgba(9,9,11,.25)] transition-transform hover:-translate-y-1"
          >
            Start Editing Now
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C084FC] text-[#09090B]">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </section>

      <footer className="flex flex-col justify-between gap-4 bg-[#09090B] px-5 py-7 text-[10px] uppercase tracking-[0.18em] text-white/35 sm:flex-row sm:px-8 lg:px-12">
        <span>© 2025 Trace.ai</span>
        <span>Built for the moving image</span>
      </footer>
    </main>
  );
}

export default TraceForgeHero;
"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePostHog } from "posthog-js/react";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { BsArrowRight } from "react-icons/bs";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiSearch,
  FiShield,
  FiClock,
} from "react-icons/fi";
import Reviews from "./Reviews";
import { CONTACT, GOOGLE_FORM_URL } from "@/config";

// The hero still cycles through the occasions (background + headline); the
// five picker buttons are replaced by one "Ας ξεκινήσουμε" button.
// `image: null` renders a gradient placeholder.
const OCCASIONS: {
  id: string;
  image: string | null;
  imageAlt: string;
  lead: string;
  highlight: string;
  trail: string;
  tagline: string;
}[] = [
  {
    id: "parties",
    image: "/pathCarouselAdultPartyPics6.jpg",
    imageAlt: "Διακοσμημένος χώρος για πάρτι ενηλίκων",
    lead: "Οργάνωσε το",
    highlight: "τέλειο πάρτι",
    trail: "σου για κάθε περίσταση",
    tagline:
      "Χώροι, DJ, εξοπλισμός, διακόσμηση, τούρτες, φωτογράφοι — όλα σε ένα μέρος.",
  },
  {
    id: "kids_parties",
    image: "/pathCarouselKidsPartyPics1.jpg",
    imageAlt: "Παιδικό πάρτι με μπαλόνια και διακόσμηση",
    lead: "Οργάνωσε το",
    highlight: "παιδικό πάρτι",
    trail: "που θα λατρέψει",
    tagline:
      "Ψυχαγωγοί, παιχνίδια, τούρτες, μπαλόνια και παιδότοποι — όλα σε ένα μέρος.",
  },
  {
    id: "weddings",
    image: "/landing-wedding.jpg",
    imageAlt: "Στολισμένος χώρος δεξίωσης γάμου",
    lead: "Οργάνωσε τον",
    highlight: "γάμο",
    trail: "των ονείρων σου",
    tagline:
      "Κτήματα, catering, μουσική, ανθοστολισμός και φωτογράφοι — όλα σε ένα μέρος.",
  },
  {
    id: "baptisms",
    image: "/landing-baptisms.jpg",
    imageAlt: "Στολισμός για βάπτιση",
    lead: "Οργάνωσε τη",
    highlight: "βάπτιση",
    trail: "που ονειρεύεσαι",
    tagline:
      "Χώροι δεξίωσης, στολισμός, μπομπονιέρες και catering — όλα σε ένα μέρος.",
  },
  {
    id: "corporate",
    image: "/landing-corporate.jpg",
    imageAlt: "Αίθουσα για εταιρική εκδήλωση",
    lead: "Οργάνωσε την",
    highlight: "εταιρική εκδήλωση",
    trail: "σου",
    tagline:
      "Αίθουσες, catering, εξοπλισμός και ψυχαγωγία για κάθε εταιρική εκδήλωση.",
  },
];

const OCCASION_INTERVAL_MS = 5000;

const WHY_US = [
  {
    icon: FiSearch,
    title: "Όλα σε μία αναζήτηση",
    desc: "Χώροι, επαγγελματίες, διακόσμηση, φαγητό, υπηρεσίες για κάθε εκδήλωση — όλα σε ένα μόνο site.",
  },
  {
    icon: FiShield,
    title: "Επαληθευμένοι συνεργάτες",
    desc: "Κάθε επαγγελματίας έχει ελεγχθεί, ώστε να κλείνεις με σιγουριά και χωρίς εκπλήξεις.",
  },
  {
    icon: FiCheckCircle,
    title: "Εύκολη κράτηση",
    desc: "Σύγκρινε επιλογές και κάνε κράτηση γρήγορα, χωρίς τηλέφωνα και περιττές διαδικασίες.",
  },
  {
    icon: RiMoneyEuroCircleLine,
    title: "Διαφανείς τιμές",
    desc: "Βλέπεις καθαρές τιμές από την αρχή, χωρίς κρυφές χρεώσεις ή μεσάζοντες.",
  },
  {
    icon: FiClock,
    title: "Υποστήριξη 24/7",
    desc: "Η ομάδα μας είναι δίπλα σου σε κάθε βήμα της οργάνωσης.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Πώς λειτουργεί η πλατφόρμα;",
    a: "Αναζητάς τις υπηρεσίες που χρειάζεσαι για το πάρτι σου και βρίσκεις τους παρόχους που καλύπτουν τις ανάγκες σου. Μπορείς είτε να στείλεις αίτημα για περισσότερες πληροφορίες μέσα στο προφίλ του παρόχου, είτε να προχωρήσεις απευθείας σε κράτηση. Όλα γίνονται online, χωρίς τηλεφωνήματα ή μεσάζοντες.",
  },
  {
    q: "Κοστίζει κάτι η εγγραφή;",
    a: "Όχι. Η χρήση της πλατφόρμας είναι εντελώς δωρεάν για τους οργανωτές. Πληρώνεις μόνο τον πάροχο που επιλέγεις, με τις τιμές που βλέπεις στο προφίλ του — χωρίς κρυφές χρεώσεις.",
  },
  {
    q: "Πώς ξέρω ότι οι πάροχοι είναι αξιόπιστοι;",
    a: "Κάθε συνεργάτης περνά από διαδικασία επαλήθευσης πριν εμφανιστεί στην πλατφόρμα. Επιπλέον, κάθε προφίλ εμφανίζει κριτικές από πραγματικούς πελάτες, ώστε να διαλέξεις με σιγουριά.",
  },
  {
    q: "Μπορώ να ακυρώσω ή να αλλάξω κράτηση;",
    a: "Σε περίπτωση που ο πάροχος έχει ορίσει προκαταβολή, το σχετικό ποσό αναγράφεται στο προφίλ του και ισχύει σύμφωνα με τους όρους ακύρωσης που έχει θέσει ο ίδιος. Για κάθε περίπτωση που δεν καλύπτεται από τους όρους του παρόχου, η διαχείριση ακύρωσης ή τροποποίησης πραγματοποιείται κατόπιν επικοινωνίας με την πλατφόρμα, προκειμένου να εξεταστεί η βέλτιστη δυνατή λύση.",
  },
  {
    q: "Σε ποιες περιοχές είστε διαθέσιμοι;",
    a: "Αυτή τη στιγμή καλύπτουμε Αθήνα, Θεσσαλονίκη και τις γύρω περιοχές. Επεκτεινόμαστε συνεχώς — αν δεν βλέπεις την περιοχή σου, επικοινώνησε μαζί μας και θα σε ενημερώσουμε.",
  },
  {
    q: "Πότε γίνεται η χρέωση της κράτησής μου;",
    a: "Κατά την κράτηση, το ποσό δεσμεύεται μόνο εφόσον γίνει αποδεκτή από τον πάροχο. Σε αντίθετη περίπτωση, δεν πραγματοποιείται χρέωση.",
  },
];

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function useScrollReveal(onReveal?: (id: string) => void) {
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const onRevealRef = useRef(onReveal);
  useEffect(() => {
    onRevealRef.current = onReveal;
  }, [onReveal]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id)
            setVisible((p) => {
              if (p.has(e.target.id)) return p;
              onRevealRef.current?.(e.target.id);
              return new Set([...p, e.target.id]);
            });
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return (id: string) => visible.has(id);
}

/** The single entry point: opens the Google Form (or, until its link is set,
 * scrolls to the contact section). */
function StartButton({
  placement,
  className = "",
  label = "Ας ξεκινήσουμε",
}: {
  placement: string;
  className?: string;
  label?: string;
}) {
  const posthog = usePostHog();
  const hasForm = GOOGLE_FORM_URL.length > 0;
  return (
    <a
      href={hasForm ? GOOGLE_FORM_URL : "#sec-contact"}
      target={hasForm ? "_blank" : undefined}
      rel={hasForm ? "noopener noreferrer" : undefined}
      onClick={() =>
        posthog?.capture("landing_start_clicked", {
          placement,
          has_form: hasForm,
        })
      }
      className={`group inline-flex items-center justify-center gap-3 rounded-full font-bold transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] ${className}`}
    >
      {label}
      <BsArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

const SECTION_REVEAL = (shown: boolean) =>
  shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

export default function LandingClient() {
  const posthog = usePostHog();
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const [occasionIndex, setOccasionIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isVisible = useScrollReveal((section) =>
    posthog?.capture("landing_section_viewed", { section }),
  );

  useEffect(() => {
    posthog?.capture("landing_viewed", { variant: "plan_b" });
  }, [posthog]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = window.setInterval(
      () => setOccasionIndex((p) => (p + 1) % OCCASIONS.length),
      OCCASION_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [prefersReducedMotion]);

  // Only the slide on screen, the one fading out and the next one are
  // mounted, so five full-width photos never compete for the first paint.
  const n = OCCASIONS.length;
  const isMounted = (i: number) =>
    i === occasionIndex ||
    i === (occasionIndex + 1) % n ||
    (i === (occasionIndex - 1 + n) % n && occasionIndex !== 0);

  const active = OCCASIONS[occasionIndex];

  return (
    <div className="w-full bg-gray-50">
      {/* ═════════ HERO ═════════ */}
      <section className="relative min-h-[90svh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          {OCCASIONS.map(({ id, image, imageAlt }, i) =>
            !isMounted(i) ? null : image ? (
              <Image
                key={id}
                src={image}
                alt={imageAlt}
                fill
                preload={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className={`scale-110 object-cover transition-opacity duration-1200 ease-out ${
                  i === occasionIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : (
              <div
                key={id}
                className={`absolute inset-0 bg-linear-to-br from-gray-700 to-gray-900 transition-opacity duration-1200 ${
                  i === occasionIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ),
          )}
          <div className="absolute inset-0 bg-linear-to-tr from-primary/90 via-primary/55 to-amber-900/30" />
          <div className="absolute inset-0 bg-black/15" />
        </div>

        {[12, 25, 38, 52, 65, 78, 88].map((left, i) => (
          <div
            key={i}
            className="pointer-events-none absolute bottom-0 z-10 animate-bounce opacity-25 motion-reduce:animate-none"
            style={{
              left: `${left}%`,
              animationDelay: `${i * 180}ms`,
              animationDuration: `${2200 + i * 150}ms`,
            }}
          >
            <Image
              src="/star.svg"
              alt=""
              width={16 + i * 2}
              height={16 + i * 2}
            />
          </div>
        ))}

        <div className="relative z-20 flex min-h-[90svh] flex-col items-center justify-center px-5 py-8 text-center sm:px-6 sm:py-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo1x.png"
            alt="YourEvent"
            className="max-h-20 invert sm:max-h-28 lg:max-h-36"
          />

          <div className="flex min-h-18 items-center sm:min-h-28 md:min-h-34 lg:min-h-28">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h2
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-3 max-w-4xl text-3xl font-black leading-tight text-white drop-shadow-lg sm:mb-4 sm:text-5xl md:text-6xl lg:text-5xl"
              >
                {active.lead}{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg,#FFD700,#FF8C00,#FFD700)",
                    backgroundSize: "200% auto",
                    animation: "gradientShift 4s linear infinite",
                  }}
                >
                  {active.highlight}
                </span>{" "}
                {active.trail}
              </motion.h2>
            </AnimatePresence>
          </div>

          <div className="mb-8 flex min-h-10 items-start justify-center sm:min-h-12">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="max-w-2xl text-sm text-white/80 sm:text-base md:text-xl"
              >
                {active.tagline}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* One button in place of the five occasion buttons. */}
          <div className="cta-rise">
            <StartButton
              placement="hero"
              className="cta-pulse bg-white px-10 py-4 text-lg text-primary shadow-[0_18px_50px_rgba(0,0,0,0.38)] sm:px-14 sm:py-5 sm:text-xl"
            />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-sm font-medium text-white/80 drop-shadow lg:flex">
          <span>Κύλισε για να μάθεις περισσότερα</span>
          <div className="flex h-9 w-6 justify-center rounded-full border-2 border-white/70 pt-1.5">
            <div className="h-2.5 w-1 animate-bounce rounded-full bg-white/90" />
          </div>
        </div>
      </section>

      {/* ═════════ SELECTED BY ═════════ */}
      <div className="relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-b-4xl bg-white p-6">
        <motion.h3
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-semibold text-primary"
        >
          Βραβεύθηκε στο
        </motion.h3>
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/piraeus-startup-accelarator.svg"
            alt="Piraeus Startup Accelerator"
            className="max-h-20 invert"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pos4work-logo.png"
            alt="POS4Work"
            className="max-h-28 rounded-xl"
          />
        </div>
      </div>

      {/* ═════════ REVIEWS ═════════ */}
      <section
        id="sec-reviews"
        data-reveal
        className={`w-full bg-linear-to-b from-orange-50 via-slate-50 to-slate-100 px-4 py-16 transition-all duration-700 lg:px-16 ${SECTION_REVEAL(
          isVisible("sec-reviews"),
        )}`}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              Κριτικές πελατών
            </span>
            <h2 className="text-4xl font-semibold text-gray-900 sm:text-5xl">
              Τι λένε για εμάς
            </h2>
            <p className="max-w-md text-sm text-gray-500">
              Πραγματικές εμπειρίες από events που οργανώθηκαν μέσω YourEvent
            </p>
          </div>
          <Reviews />
        </div>
      </section>

      {/* ═════════ WHY US ═════════ */}
      <section
        id="sec-why"
        data-reveal
        className={`w-full border-y border-gray-200 bg-white px-4 py-16 transition-all duration-700 lg:px-16 ${SECTION_REVEAL(
          isVisible("sec-why"),
        )}`}
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
            Γιατί να χρησιμοποιήσεις το YourEvent
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`flex flex-col items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-6 lg:col-span-2 ${
                    i === 3 ? "lg:col-start-2" : ""
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-gray-600">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════ CTA BAND ═════════ */}
      <section className="w-full bg-gray-50 px-4 py-14 lg:px-16">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-4 overflow-hidden rounded-3xl bg-linear-to-br from-primary via-red-700 to-red-950 px-6 py-14 text-center shadow-xl sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-14 -left-14 size-48 rounded-full bg-white/10" />
          <p className="relative text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Θες να είσαι ο επόμενος;
          </p>
          <p className="relative max-w-md text-sm text-white/90 sm:text-base">
            Πες μας τι χρειάζεσαι για το event σου και αναλαμβάνουμε να βρούμε
            τους καλύτερους επαγγελματίες.
          </p>
          <StartButton
            placement="cta_band"
            className="relative mt-2 bg-white px-8 py-3.5 text-base text-primary shadow-lg hover:shadow-xl"
          />
        </div>
      </section>

      {/* ═════════ FAQ ═════════ */}
      <section
        id="sec-faq"
        data-reveal
        className={`relative w-full overflow-hidden bg-gray-50 px-4 py-20 transition-all duration-700 lg:px-16 ${SECTION_REVEAL(
          isVisible("sec-faq"),
        )}`}
      >
        <div className="relative mx-auto max-w-2xl">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-primary/50">
            Απορίες
          </p>
          <h2 className="mb-12 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Συχνές ερωτήσεις
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {FAQ_ITEMS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="border-b border-gray-100 last:border-0"
                >
                  <button
                    onClick={() => {
                      if (!isOpen)
                        posthog?.capture("landing_faq_opened", {
                          question: faq.q,
                          index: i,
                        });
                      setOpenFaq(isOpen ? null : i);
                    }}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm font-semibold text-gray-800 transition-colors duration-200 group-hover:text-primary md:text-base">
                      {faq.q}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-primary/35 bg-primary/5 text-primary"
                          : "border-black/10 text-gray-400"
                      }`}
                    >
                      <svg
                        className="size-3.5"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        strokeLinecap="round"
                      >
                        <path d="M7 2v10M2 7h10" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-gray-500">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════ CONTACT ═════════ */}
      <section
        id="sec-contact"
        data-reveal
        className={`w-full scroll-mt-4 border-t border-gray-100 bg-white px-4 py-20 transition-all duration-700 lg:px-16 ${SECTION_REVEAL(
          isVisible("sec-contact"),
        )}`}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/50">
              Επικοινωνία
            </p>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Μίλησέ μας
            </h2>
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-gray-500">
              Έχεις ερώτηση, πρόταση ή χρειάζεσαι βοήθεια; Η ομάδα μας είναι εδώ
              και θα σου απαντήσει το συντομότερο δυνατό.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: FiMail,
                label: "Email",
                value: CONTACT.email,
                href: `mailto:${CONTACT.email}`,
                method: "email",
              },
              {
                icon: FiPhone,
                label: "Τηλέφωνο",
                value: CONTACT.phone,
                href: CONTACT.phoneHref,
                method: "phone",
              },
              {
                icon: FiMapPin,
                label: "Τοποθεσία",
                value: CONTACT.location,
                href: null,
                method: null,
              },
            ].map(({ icon: Icon, label, value, href, method }) => {
              const body = (
                <>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white text-primary">
                    <Icon aria-hidden className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {value}
                    </p>
                  </div>
                </>
              );
              const cls =
                "flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5";
              return href ? (
                <a
                  key={label}
                  href={href}
                  onClick={() =>
                    posthog?.capture("landing_contact_clicked", { method })
                  }
                  className={`${cls} transition-colors hover:border-primary/30`}
                >
                  {body}
                </a>
              ) : (
                <div key={label} className={cls}>
                  {body}
                </div>
              );
            })}
          </div>
          <StartButton
            placement="contact"
            className="bg-primary px-9 py-4 text-base text-white shadow-lg shadow-primary/25"
          />
        </div>
      </section>

      {/* ═════════ FOOTER ═════════ */}
      <footer className="w-full border-t border-gray-200 bg-white px-4 py-6 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-center text-xs text-gray-400 sm:flex-row sm:justify-between">
          <p>© 2026 YourEvent — Όλα τα δικαιώματα διατηρούνται</p>
          <a href={`mailto:${CONTACT.email}`} className="hover:text-gray-600">
            {CONTACT.email}
          </a>
        </div>
      </footer>
    </div>
  );
}

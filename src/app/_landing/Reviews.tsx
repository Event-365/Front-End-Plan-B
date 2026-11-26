"use client";

import { useEffect, useRef, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiImage } from "react-icons/fi";

type Review = {
  category: string;
  subject: string;
  quote: string;
  reviewer: string;
  rating: number;
  gradient: string;
  /** 4:5 photos from the event. Empty = placeholder; several = auto-cycle. */
  images: string[];
};

// Photos live in /public/reviews/. Several per review = auto-cycle.
const REVIEWS: Review[] = [
  {
    category: "Χώρος",
    subject: "Airbnb @Νέα Μάκρη",
    quote:
      "Τοπ airbnb για καλοκαιρινό πάρτι! Μεγάλος έξω χώρος, δροσιά και κατάλληλα φωτισμένος! Βγήκε ακριβώς όπως θέλαμε!",
    reviewer: "Αντρέας",
    rating: 5,
    gradient: "from-red-800 via-red-950 to-black",
    images: ["/reviews/nea-makri.jpg"],
  },
  {
    category: "DJ",
    subject: "DJ Vassilis",
    quote:
      "Φανταστικός! Τα φώτα έφτιαξαν απίστευτη ατμόσφαιρα και ο καπνός απογείωσε το vibe του πάρτι! Όλα λειτούργησαν τέλεια!",
    reviewer: "Χριστόφορος",
    rating: 5,
    gradient: "from-indigo-800 via-indigo-950 to-black",
    images: ["/reviews/dj-vassilis.jpg"],
  },
  {
    category: "Χώρος",
    subject: "Θέατρο Αυλαία",
    quote:
      "Ήταν ο ιδανικός χώρος για το πάρτι που ήθελα να κάνω! Θα το ξαναπροτιμήσω σίγουρα! Σας ευχαριστώ πολύ για όλη τη βοήθεια.",
    reviewer: "Εύα",
    rating: 5,
    gradient: "from-emerald-800 via-emerald-950 to-black",
    images: ["/reviews/theatro-avlaia.jpg"],
  },
  {
    category: "DJ",
    subject: "DJ Ale",
    quote:
      "Επιτέλους ένας DJ που ξέρει να διαβάζει το κοινό του! Ο DJ Ale έδωσε στο party μας ακριβώς αυτό που θέλαμε. Τον προτείνουμε 100%!",
    reviewer: "Γιάννης",
    rating: 5,
    gradient: "from-amber-700 via-amber-950 to-black",
    images: ["/reviews/dj-ale.jpg"],
  },
  {
    category: "Χώρος",
    subject: "Anthology",
    quote:
      "Πανέμορφος χώρος! Για γενέθλια ή όχι, για παιδιά ή ενήλικες, μία δημιουργική εμπειρία που αξίζει! Ευχαριστούμε πολύ για όλα όσα είχατε ετοιμάσει, το κατευχαριστηθήκαμε.",
    reviewer: "Έλενα",
    rating: 5,
    gradient: "from-rose-800 via-rose-950 to-black",
    images: ["/reviews/anthology.jpg"],
  },
  {
    category: "Χώρος",
    subject: "Σπίτι στον Ωρωπό",
    quote:
      "Όλη η διαδικασία έγινε πολύ πιο εύκολη και γρήγορη! Η ομάδα του YourEvent ήταν άμεση σε κάθε μας απορία και μας καθοδήγησε σε κάθε βήμα, χωρίς άγχος και καθυστερήσεις.",
    reviewer: "Έλενα",
    rating: 5,
    gradient: "from-fuchsia-800 via-fuchsia-950 to-black",
    images: ["/reviews/spiti-oropos.jpg"],
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex shrink-0 gap-0.5 text-primary" aria-label={`${rating}/5`}>
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <FaStar key={i} className="size-3.5" />
        ) : (
          <FaRegStar key={i} className="size-3.5" />
        ),
      )}
    </div>
  );
}

function ReviewPhoto({ review, index }: { review: Review; index: number }) {
  const { images } = review;
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    const start = setTimeout(() => {
      timer.current = setInterval(
        () => setActive((a) => (a + 1) % images.length),
        4200,
      );
    }, (index % 6) * 650);
    return () => {
      clearTimeout(start);
      if (timer.current) clearInterval(timer.current);
    };
  }, [images.length, index]);

  if (images.length === 0) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-linear-to-br ${review.gradient}`}
      >
        <FiImage aria-hidden className="size-10 text-white/25" />
      </div>
    );
  }

  return (
    <>
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-1100 ease-out ${
            i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
        />
      ))}
    </>
  );
}

export default function Reviews() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {REVIEWS.map((review, i) => (
        <article
          key={review.subject}
          className="flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10"
        >
          <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
            <ReviewPhoto review={review} index={i} />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/30 via-black/0 to-black/0" />
            <div className="relative flex items-start justify-between p-4">
              <span className="rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                {review.category}
              </span>
              <div className="size-11 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#c30c0c] p-1.5 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/redicon192.png" alt="" className="h-full w-full object-contain" />
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <p className="text-2xl font-extrabold leading-tight text-primary">
              {review.subject}
            </p>
            <div className="relative">
              <span className="absolute -top-3 -left-1 select-none text-6xl leading-none text-primary/10">
                &ldquo;
              </span>
              <p className="relative pl-4 text-sm leading-relaxed text-gray-600">
                {review.quote}
              </p>
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-sm font-semibold text-gray-900">
                {review.reviewer}
              </span>
              <StarRow rating={review.rating} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

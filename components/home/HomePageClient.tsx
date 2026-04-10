"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import {
  getNextNarrative,
  isNarrativeId,
  NARRATIVES,
  NARRATIVE_ORDER,
  type NarrativeId,
} from "@/lib/narratives";

const NARRATIVE_STORAGE_KEY = "qr_narrative_v2";

import { CategoryGrid } from "./CategoryGrid";
import { FeaturedDrop } from "./FeaturedDrop";
import type { SerializedFeaturedProduct } from "./home-types";
import { MemberCTA } from "./MemberCTA";
import { StoryPanel } from "./StoryPanel";
import { VideoHero } from "./VideoHero";

type Props = {
  featuredBySlug: Record<string, SerializedFeaturedProduct | null>;
};

export function HomePageClient({ featuredBySlug }: Props) {
  const [narrativeId, setNarrativeId] = useState<NarrativeId>(NARRATIVE_ORDER[0]);

  useEffect(() => {
    let previous: NarrativeId | null = null;
    try {
      const raw = localStorage.getItem(NARRATIVE_STORAGE_KEY);
      if (raw && isNarrativeId(raw)) previous = raw;
    } catch {
      /* private mode */
    }
    const next = getNextNarrative(previous);
    setNarrativeId(next);
    try {
      localStorage.setItem(NARRATIVE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((id: NarrativeId) => {
    setNarrativeId(id);
    try {
      localStorage.setItem(NARRATIVE_STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const narrative = NARRATIVES[narrativeId];
  const featured = featuredBySlug[narrative.featuredSlug] ?? null;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <VideoHero narrativeId={narrativeId} onNarrativeChange={persist} />
      <StoryPanel featuredProduct={featured} />
      <FeaturedDrop narrative={narrative} product={featured} />
      <CategoryGrid narrativeId={narrativeId} />
      <MemberCTA />
    </motion.main>
  );
}

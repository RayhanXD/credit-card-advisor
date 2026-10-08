"use client";

import { create } from "zustand";
import type { OwnedCard, UserGoal, UserProfile } from "@/lib/types";
import { BLANK_PROFILE_TEMPLATE, DEMO_PERSONAS } from "@/data/personas";
import { fetchMyProfile, upsertMyProfile } from "@/lib/supabase/profile";

const SAVE_DEBOUNCE_MS = 400;

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSave: UserProfile | null = null;

async function persistNow(profile: UserProfile) {
  pendingSave = null;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  await upsertMyProfile(profile);
}

function scheduleSave(profile: UserProfile, immediate: boolean) {
  pendingSave = profile;
  if (saveTimer) clearTimeout(saveTimer);
  if (immediate) {
    saveTimer = null;
    void persistNow(profile);
    return;
  }
  saveTimer = setTimeout(() => {
    const next = pendingSave;
    saveTimer = null;
    pendingSave = null;
    if (next) void persistNow(next);
  }, SAVE_DEBOUNCE_MS);
}

export async function flushProfileSave() {
  if (!pendingSave) return;
  await persistNow(pendingSave);
}

interface AppState {
  profile: UserProfile | null;
  userId: string | null;
  isReady: boolean;

  hydrateFromSession: (userId: string | null) => Promise<void>;
  loadPersona: (personaId: string) => Promise<void>;
  startFreshOnboarding: () => void;
  updateProfile: (updater: (p: UserProfile) => UserProfile) => void;
  completeOnboarding: (draft?: UserProfile) => Promise<void>;
  resetProfile: () => Promise<void>;
  clearSession: () => void;

  addCard: (card: OwnedCard) => void;
  removeCard: (ownedCardId: string) => void;
  setGoals: (goals: UserGoal[]) => void;
}

function withCurrentUserId(profile: UserProfile, userId: string | null): UserProfile {
  return userId ? { ...profile, id: userId } : profile;
}

export const useAppStore = create<AppState>()((set, get) => ({
  profile: null,
  userId: null,
  isReady: false,

  hydrateFromSession: async (userId) => {
    if (!userId) {
      set({ profile: null, userId: null, isReady: true });
      return;
    }

    set({ userId, profile: null, isReady: false });
    try {
      let profile = await fetchMyProfile();
      if (!profile) {
        const blank = withCurrentUserId(BLANK_PROFILE_TEMPLATE(), userId);
        await upsertMyProfile(blank);
        profile = blank;
      }
      set({ profile, isReady: true });
    } catch {
      const blank = withCurrentUserId(BLANK_PROFILE_TEMPLATE(), userId);
      set({ profile: blank, isReady: true });
    }
  },

  loadPersona: async (personaId) => {
    const persona = DEMO_PERSONAS.find((p) => p.id === personaId);
    const userId = get().userId ?? get().profile?.id ?? null;
    if (!persona || !userId) return;
    const next = withCurrentUserId(
      {
        ...structuredClone(persona),
        createdAt: get().profile?.createdAt ?? new Date().toISOString(),
      },
      userId
    );
    set({ profile: next });
    await persistNow(next);
  },

  startFreshOnboarding: () => {
    const userId = get().userId ?? get().profile?.id ?? null;
    const blank = withCurrentUserId(BLANK_PROFILE_TEMPLATE(), userId);
    const existing = get().profile;
    if (existing?.createdAt) blank.createdAt = existing.createdAt;
    set({ profile: blank });
  },

  updateProfile: (updater) => {
    const current = get().profile;
    if (!current) return;
    const next = withCurrentUserId(updater(current), get().userId);
    set({ profile: next });
    scheduleSave(next, false);
  },

  completeOnboarding: async (draft) => {
    const current = draft ?? get().profile;
    const userId = get().userId ?? current?.id ?? null;
    if (!current || !userId) return;
    const next = withCurrentUserId({ ...current, onboardingComplete: true }, userId);
    set({ profile: next });
    await persistNow(next);
  },

  resetProfile: async () => {
    const userId = get().userId ?? get().profile?.id ?? null;
    if (!userId) return;
    const blank = withCurrentUserId(BLANK_PROFILE_TEMPLATE(), userId);
    blank.createdAt = get().profile?.createdAt ?? blank.createdAt;
    set({ profile: blank });
    await persistNow(blank);
  },

  clearSession: () => {
    pendingSave = null;
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    set({ profile: null, userId: null, isReady: true });
  },

  addCard: (card) => {
    const current = get().profile;
    if (!current) return;
    const next = { ...current, ownedCards: [...current.ownedCards, card] };
    set({ profile: next });
    scheduleSave(next, true);
  },

  removeCard: (ownedCardId) => {
    const current = get().profile;
    if (!current) return;
    const next = {
      ...current,
      ownedCards: current.ownedCards.filter((c) => c.id !== ownedCardId),
    };
    set({ profile: next });
    scheduleSave(next, true);
  },

  setGoals: (goals) => {
    const current = get().profile;
    if (!current) return;
    const next = { ...current, goals };
    set({ profile: next });
    scheduleSave(next, false);
  },
}));

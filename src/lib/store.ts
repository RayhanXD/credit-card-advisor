"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OwnedCard, UserGoal, UserProfile } from "@/lib/types";
import { BLANK_PROFILE_TEMPLATE, DEMO_PERSONAS } from "@/data/personas";

interface AppState {
  profile: UserProfile | null;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  loadPersona: (personaId: string) => void;
  startFreshOnboarding: () => void;
  updateProfile: (updater: (p: UserProfile) => UserProfile) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;

  addCard: (card: OwnedCard) => void;
  removeCard: (ownedCardId: string) => void;

  setGoals: (goals: UserGoal[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      loadPersona: (personaId) => {
        const persona = DEMO_PERSONAS.find((p) => p.id === personaId);
        if (persona) set({ profile: structuredClone(persona) });
      },

      startFreshOnboarding: () => set({ profile: BLANK_PROFILE_TEMPLATE() }),

      updateProfile: (updater) =>
        set((state) => (state.profile ? { profile: updater(state.profile) } : state)),

      completeOnboarding: () =>
        set((state) => (state.profile ? { profile: { ...state.profile, onboardingComplete: true } } : state)),

      resetProfile: () => set({ profile: null }),

      addCard: (card) =>
        set((state) =>
          state.profile ? { profile: { ...state.profile, ownedCards: [...state.profile.ownedCards, card] } } : state
        ),

      removeCard: (ownedCardId) =>
        set((state) =>
          state.profile
            ? { profile: { ...state.profile, ownedCards: state.profile.ownedCards.filter((c) => c.id !== ownedCardId) } }
            : state
        ),

      setGoals: (goals) => set((state) => (state.profile ? { profile: { ...state.profile, goals } } : state)),
    }),
    {
      name: "credit-strategy-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

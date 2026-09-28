import { create } from 'zustand';
import { DraftData, PhotoItem } from '../types/index.js';

interface WizardState {
  currentStep: number;
  draft: DraftData;
  isSaving: boolean;
  isCrafting: boolean;
  lastSavedAt: Date | null;
  error: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateDraft: (updates: Partial<DraftData>) => void;
  addPhoto: (photo: PhotoItem) => void;
  removePhoto: (photoId: string) => Promise<void>;
  reorderPhotos: (photos: PhotoItem[]) => void;
  saveToServer: () => Promise<void>;
  initDraft: () => Promise<void>;
  setIsCrafting: (isCrafting: boolean) => void;
}

const LOCAL_STORAGE_KEY = 'lumiwish_draft_v1';

const defaultDraft: DraftData = {
  occasion: 'birthday',
  recipientName: '',
  senderName: '',
  age: undefined,
  birthdayDay: undefined,
  birthdayMonth: undefined,
  cakeId: 'midnight_chocolate',
  balloons: [],
  photos: [],
  letter: '',
  lockUntilMidnight: false,
  status: 'draft',
};

export const useWizardStore = create<WizardState>((set, get) => ({
  currentStep: 1,
  draft: defaultDraft,
  isSaving: false,
  isCrafting: false,
  lastSavedAt: null,
  error: null,

  setStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 5) }),

  nextStep: () => {
    const { currentStep, saveToServer } = get();
    if (currentStep < 5) {
      set({ currentStep: currentStep + 1 });
      saveToServer();
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  updateDraft: (updates) => {
    const newDraft = { ...get().draft, ...updates };
    set({ draft: newDraft });
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDraft));
    } catch {
      // ignore localStorage quota error
    }
  },

  addPhoto: (photo) => {
    const updatedPhotos = [...get().draft.photos, photo];
    get().updateDraft({ photos: updatedPhotos });
  },

  removePhoto: async (photoId) => {
    const { draft, updateDraft } = get();
    const updatedPhotos = draft.photos.filter((p) => p.id !== photoId);
    updateDraft({ photos: updatedPhotos });

    if (draft.id) {
      try {
        await fetch(`/api/drafts/${draft.id}/photos/${photoId}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Failed to delete photo from server:', err);
      }
    }
  },

  reorderPhotos: (photos) => {
    get().updateDraft({ photos });
    get().saveToServer();
  },

  saveToServer: async () => {
    const { draft } = get();
    set({ isSaving: true, error: null });

    try {
      if (draft.id) {
        // PATCH existing draft
        const res = await fetch(`/api/drafts/${draft.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        });
        if (res.ok) {
          const updated = await res.json();
          set({ draft: { ...draft, ...updated }, lastSavedAt: new Date(), isSaving: false });
        } else {
          set({ isSaving: false });
        }
      } else {
        // POST new draft
        const res = await fetch('/api/drafts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        });
        if (res.ok) {
          const created = await res.json();
          const merged = { ...draft, id: created.id };
          set({ draft: merged, lastSavedAt: new Date(), isSaving: false });
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        } else {
          set({ isSaving: false });
        }
      }
    } catch (err: any) {
      console.warn('Network sync error (will retry automatically):', err);
      set({ isSaving: false });
    }
  },

  initDraft: async () => {
    // 1. Try restoring from localStorage first
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        set({ draft: { ...defaultDraft, ...parsed } });

        // If it had a server ID, verify with server
        if (parsed.id) {
          fetch(`/api/drafts/${parsed.id}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((serverData) => {
              if (serverData) {
                set({ draft: { ...defaultDraft, ...serverData } });
              }
            })
            .catch(() => {});
        }
        return;
      }
    } catch {}

    // If no cache, create initial draft on server
    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultDraft),
      });
      if (res.ok) {
        const created = await res.json();
        const initial = { ...defaultDraft, id: created.id };
        set({ draft: initial });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (e) {
      console.warn('Working in offline/local mode initially:', e);
    }
  },

  setIsCrafting: (isCrafting) => set({ isCrafting }),
}));

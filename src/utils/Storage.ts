// Save & Load System with LocalStorage
import { MemorySystem } from '../engine/MemorySystem';
import { GameEvent, SaveGameData } from '../types';

const STORAGE_KEY = 'reverie_the_house_remembers_v1';

export class StorageManager {
  static saveProgress(currentLevel: number, completedLevels: number[]): void {
    try {
      const data: SaveGameData = {
        version: 1,
        currentLevel,
        completedLevels,
        unlockedLevels: Array.from(new Set([1, ...completedLevels, currentLevel])),
        events: MemorySystem.getEvents(),
        solvedPuzzles: [],
        collectedNotes: [],
        endingsUnlocked: [],
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Unable to save to localStorage:', e);
    }
  }

  static loadProgress(): SaveGameData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SaveGameData;
      if (parsed && Array.isArray(parsed.events)) {
        MemorySystem.loadEvents(parsed.events);
      }
      return parsed;
    } catch (e) {
      console.warn('Unable to load from localStorage:', e);
      return null;
    }
  }

  static hasSave(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
  }

  static clearProgress(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      MemorySystem.clear();
    } catch (e) {
      console.warn('Unable to clear save:', e);
    }
  }
}

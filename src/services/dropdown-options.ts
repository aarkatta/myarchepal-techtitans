import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interface for dropdown options
export interface DropdownOptions {
  types: string[];
  periods: string[];
  materials: string[];
  conditions: string[];
  significance: string[];
}

// Default values (used as fallback if Firebase fetch fails)
const defaultOptions: DropdownOptions = {
  types: ["Coin", "Ceramic", "Weapon", "Glass", "Personal Ornament", "Sculpture", "Other"],
  periods: ["Imperial Roman", "Roman", "Late Roman", "Byzantine", "Medieval", "Other"],
  materials: ["Gold", "Silver", "Bronze", "Iron", "Terracotta", "Ceramic", "Glass", "Marble", "Stone", "Bone", "Wood", "Other"],
  conditions: ["Excellent", "Good", "Fair", "Fragment", "Poor", "Other"],
  significance: ["Very High", "High", "Medium", "Low", "Other"],
};

// Helper function to ensure "Other" is always at the end of the array
const ensureOtherOption = (options: string[]): string[] => {
  const filtered = options.filter(opt => opt !== "Other");
  return [...filtered, "Other"];
};

const COLLECTION_NAME = 'DropdownOptions';
const DOCUMENT_ID = 'artifactOptions';

export const DropdownOptionsService = {
  // Get all dropdown options
  async getOptions(): Promise<DropdownOptions> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as DropdownOptions;
        // Ensure "Other" option is always available for all dropdowns
        return {
          types: ensureOtherOption(data.types || defaultOptions.types),
          periods: ensureOtherOption(data.periods || defaultOptions.periods),
          materials: ensureOtherOption(data.materials || defaultOptions.materials),
          conditions: ensureOtherOption(data.conditions || defaultOptions.conditions),
          significance: ensureOtherOption(data.significance || defaultOptions.significance),
        };
      } else {
        // If document doesn't exist, create it with defaults
        await this.initializeOptions();
        return defaultOptions;
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
      return defaultOptions;
    }
  },

  // Initialize options in Firebase with default values
  async initializeOptions(): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      await setDoc(docRef, defaultOptions);
      console.log('Dropdown options initialized in Firebase');
    } catch (error) {
      console.error('Error initializing dropdown options:', error);
    }
  },

  // Get specific option type
  async getOptionsByType(optionType: keyof DropdownOptions): Promise<string[]> {
    try {
      const options = await this.getOptions();
      return options[optionType] || [];
    } catch (error) {
      console.error(`Error fetching ${optionType} options:`, error);
      return defaultOptions[optionType];
    }
  },

  // Update specific option type (for admin use)
  async updateOptionType(optionType: keyof DropdownOptions, values: string[]): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      await setDoc(docRef, { [optionType]: values }, { merge: true });
      console.log(`${optionType} options updated successfully`);
    } catch (error) {
      console.error(`Error updating ${optionType} options:`, error);
      throw error;
    }
  },

  // Add a new value to specific option type
  async addOptionValue(optionType: keyof DropdownOptions, newValue: string): Promise<void> {
    try {
      const currentOptions = await this.getOptionsByType(optionType);
      if (!currentOptions.includes(newValue)) {
        const updatedOptions = [...currentOptions, newValue];
        await this.updateOptionType(optionType, updatedOptions);
      }
    } catch (error) {
      console.error(`Error adding value to ${optionType}:`, error);
      throw error;
    }
  },

  // Remove a value from specific option type
  async removeOptionValue(optionType: keyof DropdownOptions, valueToRemove: string): Promise<void> {
    try {
      const currentOptions = await this.getOptionsByType(optionType);
      const updatedOptions = currentOptions.filter(v => v !== valueToRemove);
      await this.updateOptionType(optionType, updatedOptions);
    } catch (error) {
      console.error(`Error removing value from ${optionType}:`, error);
      throw error;
    }
  },
};

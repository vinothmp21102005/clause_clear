// Storage interface - not needed for this text analysis app
// This file is kept for template compatibility but is not used

export interface IStorage {
  // No methods needed for this app
}

export class MemStorage implements IStorage {
  constructor() {
    // Empty implementation
  }
}

export const storage = new MemStorage();
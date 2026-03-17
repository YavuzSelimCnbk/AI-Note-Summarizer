/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Represents a summarized note.
 */
export interface Note {
  /** Unique identifier for the note */
  id: string;
  /** Timestamp of when the note was created */
  createdAt: number;
  /** Base64 encoded image data or URL */
  imageUrl: string;
  /** The raw text extracted from the image via OCR */
  originalText: string;
  /** A smart summary of the note's content */
  summary: string;
  /** A list of key points extracted from the note */
  keyTakeaways: string[];
  /** A list of actionable items identified in the note */
  actionItems: string[];
}

/**
 * Defines the possible states for the application's navigation.
 */
export type ScreenState =
  | { name: 'home' }
  | { name: 'camera' }
  | { name: 'processing'; imageUrl: string }
  | { name: 'detail'; noteId: string };

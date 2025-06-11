// polyfill.js - ES module polyfill for ReadableStream, Blob, and DOMException
import { ReadableStream } from 'stream/web';
import { Blob } from 'buffer';

if (typeof globalThis.ReadableStream === 'undefined') {
  try {
    globalThis.ReadableStream = ReadableStream;
  } catch (error) {
    console.error('Failed to load ReadableStream polyfill:', error);
  }
}

if (typeof globalThis.Blob === 'undefined') {
  try {
    globalThis.Blob = Blob;
  } catch (error) {
    console.error('Failed to load Blob polyfill:', error);
  }
}

if (typeof globalThis.DOMException === 'undefined') {
  try {
    // Create a simple DOMException polyfill
    globalThis.DOMException = class DOMException extends Error {
      constructor(message, name) {
        super(message);
        this.name = name || 'DOMException';
      }
    };
  } catch (error) {
    console.error('Failed to load DOMException polyfill:', error);
  }
} 
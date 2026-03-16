import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

@Injectable({ providedIn: 'root' })
export class KeyboardShortcutService {
  private handlers: ShortcutHandler[] = [];
  private boundListener = this.handleKeydown.bind(this);

  init(): void {
    document.addEventListener('keydown', this.boundListener);
  }

  destroy(): void {
    document.removeEventListener('keydown', this.boundListener);
  }

  register(handler: ShortcutHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  private handleKeydown(event: KeyboardEvent): void {
    const tag = (event.target as HTMLElement)?.tagName?.toLowerCase();
    const isEditing = tag === 'input' || tag === 'textarea' || tag === 'select';

    for (const h of this.handlers) {
      const keyMatch = event.key.toLowerCase() === h.key.toLowerCase();
      const ctrlMatch = !h.ctrl || event.ctrlKey || event.metaKey;
      const shiftMatch = !h.shift || event.shiftKey;
      const altMatch = !h.alt || event.altKey;
      const metaMatch = !h.meta || event.metaKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        // Allow Escape from input fields
        if (isEditing && h.key !== 'Escape') {
          // Still allow Ctrl+S from inputs
          if (!(h.ctrl && (event.ctrlKey || event.metaKey))) continue;
        }
        event.preventDefault();
        h.action();
        return;
      }
    }
  }
}

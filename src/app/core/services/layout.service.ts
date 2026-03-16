import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private _maximized = signal(false);
  readonly maximized = this._maximized.asReadonly();

  toggleMaximize(): void {
    this._maximized.update(v => !v);
  }

  setMaximize(val: boolean): void {
    this._maximized.set(val);
  }
}

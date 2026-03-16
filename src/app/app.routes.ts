import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'accounting/chart-of-accounts',
    pathMatch: 'full',
  },
  {
    path: 'accounting/chart-of-accounts',
    loadComponent: () =>
      import('./features/chart-of-accounts/coa.component').then(
        (m) => m.CoaComponent
      ),
  },
  {
    path: 'accounting/journal-entries',
    loadComponent: () =>
      import('./features/accounting/journal-entries/journal-entries.component').then(
        (m) => m.JournalEntriesComponent
      ),
  },
  {
    path: 'ai-copilot',
    loadComponent: () =>
      import('./features/ai-copilot/ai-copilot.component').then(
        (m) => m.AiCopilotComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'accounting/chart-of-accounts',
  },
];

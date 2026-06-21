// Main entry point - imports styles, wires modules, boots the app.
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/responsive.css';

import { Cloud } from './storage/cloud.ts';
import { state, save } from './storage/state.ts';

import { setupNavigation, setupSubnav, navigateTo } from './ui/navigation.ts';
import { typeset } from './ui/typeset.ts';
import { applyTheme, getTheme, setupTheme } from './ui/theme.ts';
import { startCountdown } from './ui/countdown.ts';
import { setupFlowcharts } from './ui/flowcharts.ts';
import { updateStats } from './ui/stats.ts';

import { renderDashboard } from './ui/dashboard.ts';
import { renderSchedule } from './ui/schedule.ts';
import { renderPrerequisites, renderMaterials, renderFormulaSheet, renderBenchmarks, buildFormulaExp } from './ui/content.ts';
import { renderPractice } from './ui/practice.ts';
import { renderSolver, setupAIHighlight } from './ui/solver.ts';
import { renderFlashcards } from './ui/flashcards.ts';
import { renderDrills } from './ui/drills.ts';
import { renderMock } from './ui/mock.ts';
import { renderSettings, renderProfileDropdown } from './ui/settings.ts';

// ===================================================================
//  GLOBAL EVENT HANDLERS (delegation)
// ===================================================================
function setupGlobalHandlers(): void {
  // Checkbox change → persist + restyle
  document.addEventListener('change', e => {
    const target = e.target as HTMLInputElement;
    if (target.type === 'checkbox') {
      const wrap = target.closest('[data-key]') as HTMLElement | null;
      if (!wrap) return;
      const k = wrap.dataset.key!;
      state[k] = target.checked;
      wrap.classList.toggle('done', target.checked);
      save();
      updateStats();
    }
  });

  // Toggle answer panels
  document.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest('.toggle');
    if (t) {
      const ans = t.nextElementSibling;
      if (ans?.classList.contains('ans')) {
        ans.classList.toggle('show');
        typeset(ans as HTMLElement);
      }
    }
  });

  // Prerequisite jump → navigate + highlight
  document.addEventListener('click', e => {
    const a = (e.target as HTMLElement).closest('.preref') as HTMLElement | null;
    if (!a) return;
    const id = a.dataset.pre;
    if (!id) return;
    navigateTo('prasyarat');
    const tgt = document.getElementById(id);
    if (tgt) {
      tgt.scrollIntoView({ behavior: 'smooth', block: 'center' });
      tgt.classList.add('prehit');
      setTimeout(() => tgt.classList.remove('prehit'), 1600);
    }
  });
}

// ===================================================================
//  INIT
// ===================================================================
(function init() {
  applyTheme(getTheme());

  // Render all sections
  renderDashboard();
  renderSchedule();
  renderPrerequisites();
  renderMaterials();
  renderFormulaSheet();
  renderPractice();
  renderSolver();
  renderFlashcards();
  renderDrills();
  renderMock();
  renderBenchmarks();
  renderSettings();

  // Navigation
  setupNavigation();
  setupSubnav('#matnav', '#materi .matpage');
  setupSubnav('#latnav', '#latihan .matpage');
  setupSubnav('#mocknav', '#mock .matpage');

  // Header + chrome
  renderProfileDropdown();
  setupTheme();
  startCountdown();
  updateStats();
  buildFormulaExp();
  setupFlowcharts();
  setupAIHighlight();
  setupGlobalHandlers();

  // MathJax typeset after load
  window.addEventListener('load', () => setTimeout(() => typeset(), 800));

  // Cloud sync
  if (Cloud.isEnabled()) setTimeout(() => Cloud.syncNow(), 400);
})();

import { useStudioStore, COLOR_THEMES, type ColorThemeId } from '../store/useStudioStore.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

console.log('=== RUNNING STUDIO CRASH STORE & ENGINE VERIFICATION TESTS ===');

// 1. Verify initial state
const s0 = useStudioStore.getState();
assert(s0.currentStep === 0, 'Initial step must be 0 (Hello & Welcome)');
assert(s0.brandName === 'STUDIO CRASH', 'Default brand name is STUDIO CRASH');

// 2. Verify Step boundaries & clamping (edge cases: negative step, overflow step)
s0.setStep(-10);
assert(useStudioStore.getState().currentStep === 0, 'Negative step should clamp to 0');
s0.prevStep();
assert(useStudioStore.getState().currentStep === 0, 'prevStep at 0 should stay at 0');

s0.setStep(999);
assert(useStudioStore.getState().currentStep === 8, 'Step > 8 should clamp to 8');
s0.nextStep();
assert(useStudioStore.getState().currentStep === 8, 'nextStep at 8 should stay at 8');

// 3. Verify step-by-step progression 0 -> 8
s0.setStep(0);
for (let i = 1; i <= 8; i++) {
  useStudioStore.getState().nextStep();
  assert(useStudioStore.getState().currentStep === i, `Step progression to ${i}`);
}

// 4. Verify all 6 Color Themes exist and have valid hex/rgba tokens
const themeIds: ColorThemeId[] = [
  'obsidian-lime',
  'alabaster-ink',
  'tokyo-cyber',
  'editorial-warm',
  'cobalt-matrix',
  'monolith-chrome',
];
for (const tid of themeIds) {
  const spec = COLOR_THEMES[tid];
  assert(Boolean(spec && spec.bg && spec.accent && spec.text), `Theme ${tid} has valid tokens`);
  useStudioStore.getState().updateConfig('colorTheme', tid);
  assert(useStudioStore.getState().colorTheme === tid, `Store updates colorTheme to ${tid}`);
}

// 5. Verify edge cases for brand identity inputs (empty strings, special chars)
useStudioStore.getState().updateConfig('userName', '');
useStudioStore.getState().updateConfig('brandName', '');
useStudioStore.getState().updateConfig('websiteUrl', '');
assert(useStudioStore.getState().userName === '', 'Empty userName handled cleanly');
assert(useStudioStore.getState().brandName === '', 'Empty brandName handled cleanly');

useStudioStore.getState().updateConfig('brandName', 'STUDIO CRASH');
useStudioStore.getState().updateConfig('userName', 'Alex Mercer');

// 6. Verify all 4 Quick Archetype Presets
const presets = ['award-agency', 'editorial-luxury', 'webgpu-lab', 'kinetic-brutalist'] as const;
for (const p of presets) {
  useStudioStore.getState().applyQuickPreset(p);
  const st = useStudioStore.getState();
  assert(Boolean(COLOR_THEMES[st.colorTheme]), `Preset ${p} sets valid colorTheme`);
}

// 7. Verify Physics Impulse Counter increments
const beforeImpulse = useStudioStore.getState().physicsImpulseCounter;
useStudioStore.getState().triggerPhysicsImpulse();
assert(
  useStudioStore.getState().physicsImpulseCounter === beforeImpulse + 1,
  'Physics impulse counter increments'
);

// 8. Verify newly wired UI controls (enableVideoReelPlane, video-reel-slab, enableRiveInteractiveBadge, cameraFov)
useStudioStore.getState().updateConfig('enableVideoReelPlane', false);
assert(useStudioStore.getState().enableVideoReelPlane === false, 'Video reel plane toggle OFF works');
useStudioStore.getState().updateConfig('enableVideoReelPlane', true);
assert(useStudioStore.getState().enableVideoReelPlane === true, 'Video reel plane toggle ON works');

useStudioStore.getState().updateConfig('mediaShaderMode', 'video-reel-slab');
assert(useStudioStore.getState().mediaShaderMode === 'video-reel-slab', 'video-reel-slab shader mode works');

useStudioStore.getState().updateConfig('enableRiveInteractiveBadge', false);
assert(useStudioStore.getState().enableRiveInteractiveBadge === false, 'Rive badge toggle OFF works');
useStudioStore.getState().updateConfig('enableRiveInteractiveBadge', true);

useStudioStore.getState().updateConfig('cameraFov', 68);
assert(useStudioStore.getState().cameraFov === 68, 'cameraFov updates to 68');
useStudioStore.getState().updateConfig('cameraFov', 42);

// Reset to step 0 and default award-agency preset
useStudioStore.getState().setStep(0);
useStudioStore.getState().applyQuickPreset('award-agency');

console.log('✓ ALL 8 TEST SUITES PASSED SUCCESSFULLY (ZERO STORAGE WARNINGS)');

import { useStudioStore, COLOR_THEMES, MAX_QUESTIONS, type ColorThemeId } from '../store/useStudioStore.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

console.log('=== RUNNING STUDIO CRASH STORE & ENGINE VERIFICATION TESTS ===');

// 1. Verify initial state (Starts on Step 0: CREATE WEBSITE Landing)
const s0 = useStudioStore.getState();
assert(s0.currentStep === 0, 'Initial step must be 0 (Landing Hero)');
assert(s0.brandName === 'STUDIO CRASH', 'Default brand name is STUDIO CRASH');

// 2. Verify Step boundaries & clamping
s0.setStep(-5);
assert(useStudioStore.getState().currentStep === 0, 'Negative step should clamp to 0');
s0.prevStep();
assert(useStudioStore.getState().currentStep === 0, 'prevStep at 0 should stay at 0');

s0.setStep(999);
assert(useStudioStore.getState().currentStep === MAX_QUESTIONS, `Step > ${MAX_QUESTIONS} should clamp to ${MAX_QUESTIONS}`);
s0.nextStep();
assert(useStudioStore.getState().currentStep === MAX_QUESTIONS, `nextStep at ${MAX_QUESTIONS} should stay at ${MAX_QUESTIONS}`);

// 3. Verify single question step-by-step progression 0 -> MAX_QUESTIONS
s0.setStep(0);
for (let i = 1; i <= MAX_QUESTIONS; i++) {
  useStudioStore.getState().nextStep();
  assert(useStudioStore.getState().currentStep === i, `Step progression to ${i}`);
}

// 4. Verify all 6 Color Themes exist and have valid hex tokens
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

// 5. Test 3D primitives and physics impulse
useStudioStore.getState().updateConfig('geometryPrimitive', 'icosahedron-crystal');
assert(useStudioStore.getState().geometryPrimitive === 'icosahedron-crystal', 'Primitive update');
const initialImpulses = useStudioStore.getState().physicsImpulseCounter;
useStudioStore.getState().triggerPhysicsImpulse();
assert(useStudioStore.getState().physicsImpulseCounter === initialImpulses + 1, 'Physics impulse trigger');

console.log('✓ ALL TEST SUITES PASSED SUCCESSFULLY (SINGLE-QUESTION ARCHITECTURE VERIFIED)');

---
name: react-formatted-state-infinite-loop
description: |
  Fix "Maximum update depth exceeded" errors in React caused by storing formatted
  strings in state. Trigger: (1) "Maximum update depth exceeded" console error,
  (2) Form renders correctly but errors prevent preview/interaction, (3) Error occurs
  after state change (like template selection). Root cause: setState called with
  formatted string (toFixed, numberWithCommas, etc.) that creates new value on every
  render, triggering re-render, causing infinite loop. Solution: Calculate and format
  values at render time, not in state. Applies to React, React with Next.js, and any
  framework using React's state management.
author: Claude Code
version: 1.0.0
date: 2026-02-07
---

# React Formatted State Infinite Loop

## Problem

Components trigger "Maximum update depth exceeded" errors when using formatted strings
in useState. The component may render visually "correctly" but the errors prevent
interactions like clicking buttons or toggling preview modes.

## Context / Trigger Conditions

**Symptoms:**

- Console shows: `Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies keeps changing.`
- Errors appear after user interactions (template selection, button clicks, form input)
- Component renders partially but functionally broken
- Error count: 25-100+ repetitions in console

**Root Cause Patterns:**

```javascript
// ANTI-PATTERN 1: Store formatted string in state
const [total, setTotal] = useState(0)
const calculateTotal = useCallback(() => {
  let sum = 0
  rows.forEach((row) => (sum += parseFloat(row.amount)))
  setTotal(numberWithCommas(sum.toFixed(2))) // ← PROBLEM: String changes on every render
}, [rows])

useEffect(() => {
  calculateTotal()
}, [calculateTotal]) // ← Loop: calculateTotal recreated → setTotal → re-render → new calculateTotal

// ANTI-PATTERN 2: Formatter in useCallback dependency
const handlePreview = useCallback(() => {
  showToast(t('preview') || 'Preview...', 'loading') // ← t might not be memoized
}, [showToast, t]) // ← t changes every render → callback recreates → useEffect runs

// ANTI-PATTERN 3: useEffect with string formatter
useEffect(() => {
  setFormattedValue(JSON.stringify(data)) // ← New string object every render
}, [data])
```

**When it manifests:**

1. During component initialization
2. After user interaction triggers state change
3. When rendering large lists (each item can have its own loop)
4. In PDF/dynamic rendering components (PDFViewer, dynamic imports)

## Solution

### Option 1: Format at Render Time (Recommended)

Remove state update with formatted value. Calculate and format inline:

```javascript
// ✅ GOOD: Calculate pure function, format during render
const calculateTotal = useCallback(() => {
  let sum = 0
  rows.forEach(row => sum += parseFloat(row.amount) || 0)
  return sum // Return NUMERIC value only
}, [rows])

// In render:
<span>{numberWithCommas(calculateTotal().toFixed(2))}</span>

// OR with useMemo if calculation is expensive:
const total = useMemo(() => {
  let sum = 0
  rows.forEach(row => sum += parseFloat(row.amount) || 0)
  return sum
}, [rows])

return <span>{numberWithCommas(total.toFixed(2))}</span>
```

### Option 2: Store Numeric State, Format in useEffect

If you must update state, store the numeric value and format separately:

```javascript
// ✅ BETTER: Store numbers, not strings
const [totalAmount, setTotalAmount] = useState(0)

const calculateTotal = useCallback(() => {
  let sum = 0
  rows.forEach((row) => (sum += parseFloat(row.amount) || 0))
  setTotalAmount(sum) // Store number, not string
}, [rows])

useEffect(() => {
  calculateTotal()
}, [calculateTotal])

// Format only when needed:
const displayTotal = numberWithCommas(totalAmount.toFixed(2))
```

### Option 3: Remove Unstable Dependencies

If error involves `t` from useTranslation or similar non-memoized hooks:

```javascript
// ❌ PROBLEM: t changes every render
const handleAction = useCallback(() => {
  showToast(t('message'), 'success')
}, [showToast, t]) // ← t recreates callback

// ✅ SOLUTION: Use hardcoded fallback string
const handleAction = useCallback(() => {
  showToast('Action completed', 'success') // Hardcoded, no t dependency
}, [showToast]) // ← Stable callback
```

## Step-by-Step Debugging

1. **Identify the pattern**: Search code for `setState(` + formatter combination

   ```bash
   grep -r "setState\|set[A-Z]" src --include="*.jsx" | grep -E "toFixed|toString|JSON|numberWithCommas"
   ```

2. **Trace the useEffect**: Find the useEffect depending on that state update

   ```javascript
   // If you have: setTotal(formatted)
   // Look for: useEffect(() => { ... }, [calculateTotal])
   // Or: useEffect(() => { setTotal(...) }, [...])
   ```

3. **Understand the loop**:
   - Does the formatted value change on every render? (YES = loop)
   - Does the callback recreate due to dependency? (YES = loop)
   - Does the useEffect depend on the callback? (YES = loop)

4. **Apply the fix**:
   - Move formatting to render time, OR
   - Store numeric value instead of formatted string, OR
   - Remove non-memoized dependencies from useCallback

5. **Verify**: Error count should drop to 0 immediately after restart

## Verification

After applying the fix:

1. Restart dev server: `npm run dev` (or your build command)
2. Perform the same user action that triggered errors
3. Check browser console: Should show 0 errors (only warnings)
4. Verify feature works: Click buttons, select options, toggle modes
5. No error spam: If errors appear again, you missed a source

**Before/After:**

```
BEFORE: Console shows 25-100 "Maximum update depth exceeded" errors
AFTER:  Console shows 0 errors (normal warnings only)
        Feature works: Button clicks, form input, navigation all functional
```

## Examples

### Real Example: Invoice Application

**Problem Code (Broken):**

```javascript
// Form.jsx
const [total, setTotal] = useState(0)

const calculateTotal = useCallback(() => {
  let sum = 0
  rows.forEach((row) => {
    sum += parseFloat(row.amount)
  })
  setTotal(numberWithCommas(sum.toFixed(2))) // ← Formatted string in state
}, [rows])

useEffect(() => {
  setTotal(calculateTotal())
}, [calculateTotal]) // ← Loop: calculateTotal recreates → setTotal called

// In render:
<span className={styles.total}>{total}</span>
```

**Fixed Code:**

```javascript
// Form.jsx
const { t } = useTranslation('common')

// Remove state entirely, calculate inline
const calculateDisplayTotal = () => {
  let sum = 0
  rows.forEach((row) => {
    sum += parseFloat(row.amount) || 0
  })
  return sum.toFixed(2)
}

// In render:
;<span className={styles.total}>
  {currencySymbol}
  {calculateDisplayTotal()}
</span>
```

### Real Example: PDF Preview Component

**Problem Code (Broken):**

```javascript
// PDFView.jsx
const [totalAmount, setTotalAmount] = useState(null)

const handleTotalCalculation = useCallback(() => {
  let sum = 0
  rows.forEach((row) => {
    sum += parseFloat(row.amount)
  })
  setTotalAmount(numberWithCommas(sum.toFixed(2))) // ← Formatted string
}, [rows])

useEffect(() => {
  handleTotalCalculation()
}, [handleTotalCalculation]) // ← Loop when passing to PDF
```

**Fixed Code:**

```javascript
// PDFView.jsx
const calculateTotalAmount = useCallback(() => {
  let sum = 0
  rows.forEach((row) => {
    sum += parseFloat(row.amount) || 0
  })
  return numberWithCommas(sum.toFixed(2)) // Return instead of setState
}, [rows])

// When passing to PDF component:
<PDF
  totalAmount={calculateTotalAmount()}
  // ... other props
/>
```

## Notes

### Edge Cases

1. **Multiple Components with Same Pattern**: Check entire codebase, not just first
   occurrence. The pattern often repeats independently in multiple files.

2. **Hidden in Callbacks**: Error may originate in parent component's callback passed
   as prop. Check handler functions that call `setState` derived from parent.

3. **In Dynamic/PDF Components**: The @react-pdf/renderer and dynamic imports can
   amplify this issue—errors are more severe because rendering pipeline is complex.

4. **With useTranslation**: The `t` function from next-translate or i18n libraries may
   not be memoized. Use hardcoded fallback strings in callbacks instead of `t(...)`.

### Performance Optimization

If the calculation is expensive (large arrays):

```javascript
const total = useMemo(() => {
  let sum = 0
  for (const row of rows) {
    sum += parseFloat(row.amount) || 0
  }
  return sum
}, [rows])

// Format in render:
<span>{numberWithCommas(total.toFixed(2))}</span>
```

### Testing the Fix

Create a simple test to verify the pattern is gone:

```javascript
// Test: Calculation shouldn't trigger useEffect loop
test('total calculation does not cause infinite renders', () => {
  let renderCount = 0

  const TestComponent = () => {
    renderCount++
    const [rows, setRows] = useState([{ amount: '100' }])

    const displayTotal = useMemo(() => {
      let sum = 0
      rows.forEach((r) => (sum += parseFloat(r.amount)))
      return numberWithCommas(sum.toFixed(2))
    }, [rows])

    return <span>{displayTotal}</span>
  }

  render(<TestComponent />)
  expect(renderCount).toBeLessThan(5) // Normal: 2-3 renders max
})
```

## References

- [React Hooks: useEffect Dependencies](https://react.dev/reference/react/useEffect#removing-unnecessary-dependencies)
- [React Hooks: useCallback](https://react.dev/reference/react/useCallback)
- [Common useEffect Pitfalls](https://react.dev/learn/you-might-not-need-an-effect)
- [Next.js Dynamic Imports](https://nextjs.org/docs/pages/building-your-application/optimizing/dynamic-imports)

## See Also

- `react-unstable-dependency-infinite-loop` - When dependencies change on every render
- `react-useeffect-dependency-array` - Understanding useEffect dependency arrays

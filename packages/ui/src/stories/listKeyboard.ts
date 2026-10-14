import { expect, userEvent, waitFor, within } from 'storybook/test'

// Keyboard helpers for Base UI list popups (Select, Menu, Combobox) in play functions.
// - The popup renders in a portal, so options are queried from the document body.
// - Base UI moves focus to the highlighted option (no aria-activedescendant on the trigger).
// - Base UI ignores list keys until the popup has finished opening (slower under load, e.g. CI),
//   so `step` presses until the key takes effect: wait for the result, never for a fixed time.
export const listKeyboard = (canvasElement: HTMLElement, trigger: HTMLElement) => {
  const page = within(canvasElement.ownerDocument.body)
  const current = () =>
    page.queryAllByRole('option').find((o) => o.hasAttribute('data-highlighted'))?.textContent
  const step = (key: string, expected: string) =>
    waitFor(
      async () => {
        if (current() !== expected) await userEvent.keyboard(key)
        if (current() !== expected) throw new Error(`expected ${expected} highlighted, got ${current()}`)
      },
      { timeout: 3000, interval: 100 },
    )
  const open = async (key: string) => {
    await waitFor(() => expect(trigger).toHaveFocus())
    await userEvent.keyboard(key)
    await page.findByRole('listbox')
  }
  return { current, step, open }
}

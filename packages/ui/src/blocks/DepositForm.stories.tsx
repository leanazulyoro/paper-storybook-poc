import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within, waitFor } from 'storybook/test'
import { NetworkDropdown } from '../stories/NetworkDropdown'
import { TextLink } from '../components/TextLink'
import { DepositForm, type DepositFormProps } from './DepositForm'
import { paperBoard } from '../stories/paperBoard'

const meta: Meta<typeof DepositForm> = {
  title: 'Blocks/DepositForm',
  component: DepositForm,
  parameters: { paper: paperBoard({ board: 'Blocks › DepositForm', surface: 'muted', layout: 'row' }) },
  args: {
    title: 'Deposit USDC',
    network: <NetworkDropdown align="end" />,
    amountLabel: 'Amount',
    amountPlaceholder: '0.00',
    balanceHint: 'Balance: 1,240.50 USDC',
    value: '',
    terms: (
      <>
        By depositing you accept the <TextLink render={<a href="#terms" />}>vault terms</TextLink>
      </>
    ),
    submitLabel: 'Deposit',
  },
  // Controlled component: keep the value in story state so typing works.
  render: function Render(args: DepositFormProps) {
    const [value, setValue] = useState(args.value)
    return <DepositForm {...args} value={value} onValueChange={setValue} />
  },
}
export default meta
type Story = StoryObj<typeof DepositForm>

export const Default: Story = { tags: ['paper'], parameters: { paper: { frame: 'DepositForm/Default' } } }
export const WithValue: Story = { args: { value: '250.00' } }
export const Error: Story = {
  tags: ['paper'],
  parameters: { paper: { frame: 'DepositForm/Error' } },
  args: { value: '2,000.00', error: 'Exceeds balance' },
}
export const Submitting: Story = { args: { value: '250.00', submitting: true, submitLabel: 'Depositing…' } }

// i18n stress test: long German strings, link mid-sentence.
export const LongText: Story = {
  tags: ['paper'],
  parameters: { paper: { frame: 'DepositForm/LongText' } },
  args: {
    title: 'USDC einzahlen',
    network: <NetworkDropdown label="Netzwerk" align="end" />,
    amountLabel: 'Einzuzahlender Betrag',
    balanceHint: 'Verfügbares Guthaben: 1.240,50 USDC',
    terms: (
      <>
        Mit der Einzahlung akzeptieren Sie die{' '}
        <TextLink render={<a href="#terms" />}>Nutzungsbedingungen des Tresors</TextLink> sowie die
        Risikohinweise.
      </>
    ),
    submitLabel: 'Jetzt einzahlen',
  },
}

export const NetworkOpen: Story = {
  tags: ['paper'],
  parameters: { paper: { frame: 'DepositForm/NetworkOpen' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body) // the popup renders in a portal
    await userEvent.click(canvas.getByRole('combobox'))
    await userEvent.hover(await page.findByRole('option', { name: 'Arbitrum' }))
  },
}

export const NetworkSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body) // the popup renders in a portal
    const trigger = canvas.getByRole('combobox')
    const amount = canvas.getByRole('textbox', { name: 'Amount' })
    const form = amount.closest('section')!
    const formBefore = form.getBoundingClientRect()
    const amountBefore = amount.getBoundingClientRect()
    await userEvent.click(trigger)
    const popup = await page.findByRole('listbox')
    // Rendered in a portal, outside the form: it can't push the layout or be clipped by the card.
    await expect(form.contains(popup)).toBe(false)
    const popupBounds = popup.getBoundingClientRect()
    const triggerBounds = trigger.getBoundingClientRect()
    await expect(Math.abs(popupBounds.right - triggerBounds.right)).toBeLessThan(0.1)
    await expect(Math.abs(popupBounds.top - triggerBounds.bottom - 8)).toBeLessThan(0.1)
    await expect(form.getBoundingClientRect().height).toBe(formBefore.height)
    await expect(amount.getBoundingClientRect().top).toBe(amountBefore.top)
    await userEvent.click(await page.findByRole('option', { name: 'Arbitrum' }))
    await expect(trigger).toHaveTextContent('Arbitrum')
    await waitFor(() => expect(trigger).toHaveFocus())
    await expect(form.getBoundingClientRect().height).toBe(formBefore.height)
    await userEvent.type(amount, '250.00')
    await expect(canvas.getByRole('button', { name: 'Deposit' })).toBeEnabled()
  },
}

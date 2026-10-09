import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { NetworkDropdown } from '../stories/NetworkDropdown'
import { TextLink } from '../components/TextLink'
import { DepositForm, type DepositFormProps } from './DepositForm'

const meta: Meta<typeof DepositForm> = {
  title: 'Blocks/DepositForm',
  component: DepositForm,
  decorators: [
    (Story) => (
      <div className="bg-muted p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Deposit USDC',
    network: <NetworkDropdown align="end" />,
    amountLabel: 'Amount',
    amountPlaceholder: '0.00',
    balanceHint: 'Balance: 1,240.50 USDC',
    value: '',
    terms: (
      <>
        By depositing you accept the{' '}
        <TextLink>
          <a href="#terms">vault terms</a>
        </TextLink>
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

export const Default: Story = {}
export const WithValue: Story = { args: { value: '250.00' } }
export const Error: Story = { args: { value: '2,000.00', error: 'Exceeds balance' } }
export const Submitting: Story = { args: { value: '250.00', submitting: true, submitLabel: 'Depositing…' } }

// i18n stress test: long German strings, link mid-sentence.
export const LongText: Story = {
  args: {
    title: 'USDC einzahlen',
    network: <NetworkDropdown label="Netzwerk" align="end" />,
    amountLabel: 'Einzuzahlender Betrag',
    balanceHint: 'Verfügbares Guthaben: 1.240,50 USDC',
    terms: (
      <>
        Mit der Einzahlung akzeptieren Sie die{' '}
        <TextLink>
          <a href="#terms">Nutzungsbedingungen des Tresors</a>
        </TextLink>{' '}
        sowie die Risikohinweise.
      </>
    ),
    submitLabel: 'Jetzt einzahlen',
  },
}

export const NetworkOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
    await userEvent.hover(canvas.getByRole('option', { name: 'Arbitrum' }))
  },
}

export const NetworkSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox')
    const amount = canvas.getByRole('textbox', { name: 'Amount' })
    const form = amount.closest('section')!
    const formBefore = form.getBoundingClientRect()
    const amountBefore = amount.getBoundingClientRect()
    await userEvent.click(trigger)
    const popup = canvas.getByRole('listbox')
    await expect(getComputedStyle(popup).position).toBe('absolute')
    const popupBounds = popup.getBoundingClientRect()
    const triggerBounds = trigger.getBoundingClientRect()
    await expect(Math.abs(popupBounds.right - triggerBounds.right)).toBeLessThan(0.1)
    await expect(Math.abs(popupBounds.top - triggerBounds.bottom - 8)).toBeLessThan(0.1)
    await expect(form.getBoundingClientRect().height).toBe(formBefore.height)
    await expect(amount.getBoundingClientRect().top).toBe(amountBefore.top)
    await userEvent.click(canvas.getByRole('option', { name: 'Arbitrum' }))
    await expect(trigger).toHaveTextContent('Arbitrum')
    await expect(trigger).toHaveFocus()
    await expect(form.getBoundingClientRect().height).toBe(formBefore.height)
    await userEvent.type(amount, '250.00')
    await expect(canvas.getByRole('button', { name: 'Deposit' })).toBeEnabled()
  },
}

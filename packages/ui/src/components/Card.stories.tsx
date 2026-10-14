import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { Card, CardBody, CardFooter, CardHeader } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  // Paper shows the card on a muted board.
  decorators: [
    (Story) => (
      <div className="bg-muted p-8">
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  tags: ['paper'],
  parameters: { paper: 'Components › Card' },
  render: () => (
    <Card>
      <CardHeader title="USDC Vault" action="Ethereum" />
      <CardBody>
        <span className="text-sm/tight text-muted-foreground">Current APY</span>
        <span className="text-xl/display font-semibold tracking-tight">5.42%</span>
      </CardBody>
      <CardFooter>
        <Button variant="secondary">Withdraw</Button>
        <Button>Deposit</Button>
      </CardFooter>
    </Card>
  ),
}

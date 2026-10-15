import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { Card, CardBody, CardFooter, CardHeader } from './Card'
import { paperBoard } from '../stories/paperBoard'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: { paper: paperBoard({ board: 'Components › Card', surface: 'muted', width: 560 }) },
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  tags: ['paper'],
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

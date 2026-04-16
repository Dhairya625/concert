import type { TicketType } from '@/types'

// Static ticket config — synced with DB seed
export const TICKET_TYPES: TicketType[] = [
  {
    id: 'rabadies',
    tier: 'standard',
    name: 'Rabadies',
    price: 6900, // ₹69 in paise
    priceDisplay: '₹69',
    description: 'General admission. Experience the band in the Minecraft world.',
    perks: [
      'Full concert access',
      'Minecraft world exploration',
      'Digital commemorative collectible',
    ],
    available: 500,
    total: 500,
    color: '#6ee7b7',
    glowClass: 'glow-soft-emerald',
    badgeLabel: 'GENERAL',
  },
]

export function getTicketById(id: string): TicketType | undefined {
  return TICKET_TYPES.find(t => t.id === id)
}

export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}

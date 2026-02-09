import { z } from 'zod'

export const createSmashSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullable(),
  category: z.enum(['fitness', 'gaming', 'creative', 'social', 'other']),
  status: z.literal('open'),
  entry_fee: z.number().min(0).nullable(),
  prize_pool: z.number().min(0).default(0),
  min_participants: z.number().int().min(2).default(2),
  max_participants: z.number().int().min(2).nullable(),
  starts_at: z.string().nullable(),
  ends_at: z.string().nullable(),
  verification_method: z.enum(['wearable', 'visual', 'participant', 'audience', 'hybrid']),
  betting_enabled: z.boolean().default(false),
  visibility: z.enum(['public', 'private']),
  stakes_type: z.enum(['monetary', 'prize', 'bragging']),
  invite_code: z.string().max(20).nullable().optional(),
  consensus_threshold: z.number().min(0).max(100).default(100),
  dispute_window_hours: z.number().min(0).default(24),
})

export const joinSmashSchema = z.object({
  smashId: z.string().uuid(),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash').optional(),
  tokenSymbol: z.enum(['ETH', 'USDC']).optional(),
  amount: z.string().min(1).optional(),
})

export const leaveSmashSchema = z.object({
  smashId: z.string().uuid(),
})

export const createSubmissionSchema = z.object({
  smashId: z.string().uuid(),
  contentType: z.enum(['photo', 'video', 'gps', 'document']),
})

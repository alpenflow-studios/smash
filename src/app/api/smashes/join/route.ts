import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { joinSmashSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await verifyAuth(request)

    const body = await request.json()
    const parsed = joinSmashSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { smashId, txHash, tokenSymbol, amount } = parsed.data
    const isPaidJoin = !!(txHash && tokenSymbol && amount)

    // Ensure user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single()

    if (!existingUser) {
      await supabaseAdmin
        .from('users')
        .insert({ wallet_address: walletAddress } as never)
    }

    // Check if already joined
    const { data: existingParticipant } = await supabaseAdmin
      .from('smash_participants')
      .select('id')
      .eq('smash_id', smashId)
      .eq('user_id', walletAddress)
      .single()

    if (existingParticipant) {
      return NextResponse.json({ error: 'You have already joined this smash' }, { status: 409 })
    }

    // If paid join, record the payment transaction
    if (isPaidJoin) {
      // Look up payment token
      const { data: tokenData, error: tokenError } = await supabaseAdmin
        .from('payment_tokens')
        .select('id')
        .eq('symbol', tokenSymbol)
        .single()

      if (tokenError || !tokenData) {
        return NextResponse.json(
          { error: `Token ${tokenSymbol} not found in payment_tokens` },
          { status: 400 }
        )
      }

      // Insert payment transaction
      const { error: txError } = await supabaseAdmin
        .from('payment_transactions')
        .insert({
          smash_id: smashId,
          user_id: walletAddress,
          payment_token_id: (tokenData as { id: string }).id,
          amount: parseFloat(amount),
          tx_hash: txHash,
          tx_type: 'entry',
          status: 'confirmed',
        } as never)

      if (txError) {
        console.error('Error recording payment:', txError)
        return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
      }
    }

    // Create participant record
    const participantData = {
      smash_id: smashId,
      user_id: walletAddress,
      status: 'active',
      ...(isPaidJoin && {
        entry_paid: true,
        entry_tx_hash: txHash,
      }),
    }

    const { data, error } = await supabaseAdmin
      .from('smash_participants')
      .insert(participantData as never)
      .select()
      .single()

    if (error) {
      console.error('Error joining smash:', error)
      return NextResponse.json({ error: 'Failed to join smash' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unauthorized'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}

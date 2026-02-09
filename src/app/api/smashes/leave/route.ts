import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { leaveSmashSchema } from '@/lib/validations'

export async function DELETE(request: NextRequest) {
  try {
    const { walletAddress } = await verifyAuth(request)

    const body = await request.json()
    const parsed = leaveSmashSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { smashId } = parsed.data

    const { error } = await supabaseAdmin
      .from('smash_participants')
      .delete()
      .eq('smash_id', smashId)
      .eq('user_id', walletAddress)

    if (error) {
      console.error('Error leaving smash:', error)
      return NextResponse.json({ error: 'Failed to leave smash' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unauthorized'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}

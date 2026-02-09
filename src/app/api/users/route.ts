import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await verifyAuth(request)

    // Parse optional username from body
    let username: string | null = null
    try {
      const body = await request.json()
      if (body.username && typeof body.username === 'string') {
        username = body.username
      }
    } catch {
      // Empty body is fine — username is optional
    }

    // Check if user already exists
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (existing) {
      return NextResponse.json(existing)
    }

    // Create new user
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        wallet_address: walletAddress,
        username,
      } as never)
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unauthorized'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}

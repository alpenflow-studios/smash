import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { createSmashSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await verifyAuth(request)

    // Parse FormData (supports both JSON data and optional cover image file)
    const formData = await request.formData()
    const dataField = formData.get('data')
    const coverImage = formData.get('coverImage') as File | null

    if (!dataField || typeof dataField !== 'string') {
      return NextResponse.json({ error: 'Missing "data" field in FormData' }, { status: 400 })
    }

    let rawData: unknown
    try {
      rawData = JSON.parse(dataField)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in "data" field' }, { status: 400 })
    }

    // Validate with Zod
    const parsed = createSmashSchema.safeParse(rawData)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Ensure user exists in our DB
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

    // Build smash record — creator_id comes from verified auth, NOT from client
    const smashData = {
      ...parsed.data,
      creator_id: walletAddress,
    }

    const { data, error } = await supabaseAdmin
      .from('smashes')
      .insert(smashData as never)
      .select('id')
      .single<{ id: string }>()

    if (error) {
      console.error('Error creating smash:', error)
      return NextResponse.json({ error: 'Failed to create smash' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'No data returned from insert' }, { status: 500 })
    }

    // Upload cover image if provided
    if (coverImage && coverImage.size > 0) {
      try {
        const fileExt = coverImage.name.split('.').pop()
        const fileName = `covers/${data.id}.${fileExt}`
        const buffer = Buffer.from(await coverImage.arrayBuffer())

        const { error: uploadError } = await supabaseAdmin.storage
          .from('smash-proofs')
          .upload(fileName, buffer, {
            contentType: coverImage.type,
            cacheControl: '3600',
            upsert: true,
          })

        if (uploadError) {
          console.warn('Failed to upload cover image:', uploadError)
        } else {
          const { data: urlData } = supabaseAdmin.storage
            .from('smash-proofs')
            .getPublicUrl(fileName)

          await supabaseAdmin
            .from('smashes')
            .update({ cover_image_url: urlData.publicUrl } as never)
            .eq('id', data.id)
        }
      } catch (uploadErr) {
        console.warn('Cover image upload failed:', uploadErr)
        // Don't fail the whole creation if cover upload fails
      }
    }

    return NextResponse.json({ id: data.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unauthorized'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}

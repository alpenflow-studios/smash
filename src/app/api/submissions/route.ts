import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { createSubmissionSchema } from '@/lib/validations'
import { MAX_PROOF_FILE_SIZE_BYTES } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await verifyAuth(request)

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const smashId = formData.get('smashId') as string | null
    const contentType = formData.get('contentType') as string | null

    // Validate fields
    const parsed = createSubmissionSchema.safeParse({ smashId, contentType })
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_PROOF_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 })
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${parsed.data.smashId}/${walletAddress}/${Date.now()}.${fileExt}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('smash-proofs')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading proof:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('smash-proofs')
      .getPublicUrl(fileName)

    // Create submission record
    const { data, error } = await supabaseAdmin
      .from('submissions')
      .insert({
        smash_id: parsed.data.smashId,
        user_id: walletAddress,
        content_url: urlData.publicUrl,
        content_type: parsed.data.contentType,
      } as never)
      .select()
      .single()

    if (error) {
      console.error('Error creating submission:', error)
      return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unauthorized'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}

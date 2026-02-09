import { PrivyClient } from '@privy-io/server-auth'
import { NextRequest } from 'next/server'

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
const privyAppSecret = process.env.PRIVY_APP_SECRET

if (!privyAppId || !privyAppSecret) {
  throw new Error('Missing Privy env vars. Set NEXT_PUBLIC_PRIVY_APP_ID and PRIVY_APP_SECRET')
}

const privyClient = new PrivyClient(privyAppId, privyAppSecret)

export type AuthResult = {
  privyDid: string
  walletAddress: string
}

/**
 * Verify the Privy auth token from the Authorization header.
 * Returns the verified user's Privy DID and wallet address.
 * Throws if token is missing, invalid, or user has no wallet.
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header')
  }

  const token = authHeader.slice(7)

  const verifiedClaims = await privyClient.verifyAuthToken(token)

  // Fetch full user to get wallet address
  // Note: getUser(userId) is deprecated for scale but fine for dev/early stage.
  // Migrate to getUser({idToken}) when scaling.
  const privyUser = await privyClient.getUser(verifiedClaims.userId)

  const wallet = privyUser.wallet
  if (!wallet?.address) {
    throw new Error('User has no linked wallet')
  }

  return {
    privyDid: verifiedClaims.userId,
    walletAddress: wallet.address.toLowerCase(),
  }
}

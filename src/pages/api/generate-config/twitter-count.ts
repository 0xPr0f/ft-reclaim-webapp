import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only handle GET requests (matching Express app.get)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const APP_ID = process.env.APPLICATION_ID as string
  const APP_SECRET = process.env.APPLICATION_SECRET as string
  const PROVIDER_ID = process.env.PROVIDER_TWITTER_FOLLOW as string

  try {
    // Initialize ReclaimProofRequest
    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      PROVIDER_ID
    )
    const protocol =
      req.headers['x-forwarded-proto'] ||
      (process.env.NODE_ENV === 'production' ? 'https' : 'http')
    const host = req.headers.host || 'localhost:3000'
    const BASE_URL = `${protocol}://${host}`

    console.log(BASE_URL)

    // Get the request configuration as JSON string
    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString()

    // Return the configuration
    return res.status(200).json({ reclaimProofRequestConfig })
  } catch (error) {
    console.error('Error generating request config:', error)
    return res.status(500).json({ error: 'Failed to generate request config' })
  }
}

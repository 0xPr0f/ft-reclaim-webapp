import { verifyProof } from '@reclaimprotocol/js-sdk'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Decode the URL-encoded proof object from the request body
    const decodedBody = decodeURIComponent(req.body)
    const proof = JSON.parse(decodedBody)

    // Verify the proof using the Reclaim SDK
    const result = await verifyProof(proof)
    if (!result) {
      return res.status(400).json({ error: 'Invalid proofs data' })
    }

    console.log('Received proofs:', proof)
    // Process the proofs here (e.g., save to database, integrate with Solana, etc.)
    return res.status(200).json({ message: 'Proof verified successfully' })
  } catch (error) {
    console.error('Error verifying proof:', error)
    return res.status(500).json({ error: 'Failed to verify proof' })
  }
}

// Increase body size limit for large proof objects
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Match Express's 50mb limit
    },
  },
}

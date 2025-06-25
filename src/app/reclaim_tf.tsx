'use client'
import { useState } from 'react'
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'

//const BASE_URL = ; // if using ngrok, use the ngrok base url here

function Start_PROVIDER_TWITTER_FOLLOW_ReclaimVerification() {
  const [proofs, setProofs] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerification = async () => {
    try {
      setIsLoading(true)

      // Step 1: Fetch the configuration from your backend
      const response = await fetch('api/generate-config/twitter-count')
      const { reclaimProofRequestConfig } = await response.json()
      console.log('reclaimProofRequestConfig', reclaimProofRequestConfig)
      // Step 2: Initialize the ReclaimProofRequest with the received configuration
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
        reclaimProofRequestConfig
      )

      // Step 3: Trigger the verification flow automatically
      // This method detects the user's platform and provides the optimal experience:
      // - Browser extension for desktop users (if installed)
      // - QR code modal for desktop users (fallback)
      // - Native app clips for mobile users
      await reclaimProofRequest.triggerReclaimFlow()

      // Step 4: Start listening for proof submissions
      await reclaimProofRequest.startSession({
        onSuccess: (proofs: any) => {
          console.log('Successfully created proof', proofs)
          setProofs(proofs)
          setIsLoading(false)
          // Handle successful verification - proofs are also sent to your backend callback
        },
        onError: (error) => {
          console.error('Verification failed', error)
          setIsLoading(false)
          // Handle verification failure
        },
      })
    } catch (error) {
      console.error('Error initializing Reclaim:', error)
      setIsLoading(false)
      // Handle initialization error (e.g., show error message)
    }
  }

  return (
    <>
      <button onClick={handleVerification} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Start Verification'}
      </button>

      {proofs && (
        <div>
          <h2>Verification Successful!</h2>
          <pre>{JSON.stringify(proofs, null, 2)}</pre>
        </div>
      )}
    </>
  )
}

export default Start_PROVIDER_TWITTER_FOLLOW_ReclaimVerification

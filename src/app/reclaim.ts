import { ReclaimProofRequest, Proof } from '@reclaimprotocol/js-sdk'

// Define callback function types
type VerificationCallback = () => void
type SuccessCallback = (proofs: string | Proof | Proof[] | undefined) => void
type ErrorCallback = (error: unknown) => void

// Define function parameters interface
interface VerificationParams {
  fetchUrl: string // Required URL for fetching Reclaim config
  onStartVerification?: VerificationCallback // Optional callback for when verification starts
  onSuccessVerification?: SuccessCallback // Optional callback for successful proof submission
  onErrorVerification?: ErrorCallback // Optional callback for verification errors
  onEndVerification?: VerificationCallback // Optional callback for when verification ends
}

export const startReclaimVerification = async ({
  fetchUrl,
  onStartVerification,
  onSuccessVerification,
  onErrorVerification,
  onEndVerification,
}: VerificationParams): Promise<void> => {
  try {
    // Call onStartVerification callback (if provided)
    onStartVerification?.()

    // Step 1: Fetch the configuration from the backend
    const response = await fetch(fetchUrl)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch config from ${fetchUrl}: ${response.statusText}`
      )
    }
    const { reclaimProofRequestConfig } = await response.json()

    // Step 2: Initialize the ReclaimProofRequest with the received configuration
    const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
      reclaimProofRequestConfig
    )

    // Step 3: Trigger the verification flow
    await reclaimProofRequest.triggerReclaimFlow()

    // Step 4: Start listening for proof submissions
    await reclaimProofRequest.startSession({
      onSuccess: (proofs: string | Proof | Proof[] | undefined) => {
        console.log('Successfully created proof', proofs)
        onSuccessVerification?.(proofs)
        onEndVerification?.()
      },
      onError: (error: unknown) => {
        console.error('Verification failed', error)
        onErrorVerification?.(error)
        onEndVerification?.()
      },
    })
  } catch (error) {
    console.error('Error initializing Reclaim:', error)
    onErrorVerification?.(error)
    onEndVerification?.()
  }
}

'use client'
import UniswapWidget from '@/components/uniswap'
import Start_PROVIDER_TWITTER_FOLLOW_ReclaimVerification from './reclaim_tf'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ConnectButton />
      <Start_PROVIDER_TWITTER_FOLLOW_ReclaimVerification />

      <div className="Uniswap">
        <UniswapWidget />
      </div>
    </div>
  )
}

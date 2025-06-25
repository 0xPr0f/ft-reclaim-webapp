'use client'

import dynamic from 'next/dynamic'
import '@uniswap/widgets/fonts.css'

// Dynamically import SwapWidget with SSR disabled
const SwapWidget = dynamic(
  () => import('@uniswap/widgets').then((mod) => mod.SwapWidget),
  {
    ssr: false,
  }
)

const UniswapWidget = () => {
  return (
    <div className="Uniswap">
      <SwapWidget />
    </div>
  )
}

export default UniswapWidget

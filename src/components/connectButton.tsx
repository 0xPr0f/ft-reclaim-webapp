'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet } from 'lucide-react'

export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="
                      flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2
                      bg-gradient-to-r from-purple-600 to-blue-600
                      hover:from-purple-500 hover:to-blue-500
                      text-white font-semibold rounded-lg text-sm sm:text-base
                      cursor-pointer transform
                      transition-all duration-300
                      hover:scale-105 hover:shadow-lg
                    "
                  >
                    <Wallet size={14} className="sm:w-4 sm:h-4" />
                    <span className="">Connect Wallet</span>
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="
                      flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2
                      bg-gradient-to-r from-red-600 to-red-500
                      hover:from-red-500 hover:to-red-400
                      text-white font-semibold rounded-lg text-sm sm:text-base
                      cursor-pointer transform
                      transition-all duration-300
                      hover:scale-105 hover:shadow-lg
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-alert-circle sm:w-4 sm:h-4"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12" y1="16" y2="16" />
                    </svg>
                    <span className="hidden xs:inline">Wrong Network</span>
                    <span className="xs:hidden">Wrong Net</span>
                  </button>
                )
              }

              return (
                <div className="flex flex-row xs:flex-col gap-2 xs:gap-3">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="
                      flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2
                      bg-gradient-to-r from-green-600 to-emerald-600
                      hover:from-green-500 hover:to-emerald-500
                      text-white font-semibold rounded-lg text-sm sm:text-base
                      cursor-pointer transform
                      transition-all duration-300
                      hover:scale-105 hover:shadow-lg
                      min-w-0 flex-shrink-0
                    "
                  >
                    {chain.hasIcon && (
                      <div
                        className="
                          flex items-center justify-center
                          w-3 h-3 rounded-full overflow-hidden
                          mr-1
                        "
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="
                      flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2
                      bg-gradient-to-r from-green-600 to-emerald-600
                      hover:from-green-500 hover:to-emerald-500
                      text-white font-semibold rounded-lg text-sm sm:text-base
                      cursor-pointer transform
                      transition-all duration-300
                      hover:scale-105 hover:shadow-lg
                      min-w-0 flex-1 xs:flex-initial
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user sm:w-4 sm:h-4 flex-shrink-0"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="truncate">
                      {account.displayName}
                      <span className="hidden sm:inline">
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </span>
                    </span>
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default CustomConnectButton

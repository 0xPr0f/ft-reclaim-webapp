'use client'
import Start_PROVIDER_TWITTER_FOLLOW_ReclaimVerification from './reclaim_tf'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useConnections } from 'wagmi'
import Start_PROVIDER_TWITTER_PROFILE_ReclaimVerification from './reclaim_up'
import React, { useEffect, useState } from 'react'
import { Wallet, Plus, X, Twitter, Loader2, CheckCheck } from 'lucide-react'
import { CustomConnectButton } from '@/components/connectButton'
import { startReclaimVerification } from './reclaim'
import { Proof } from '@reclaimprotocol/js-sdk'

export default function TradingInterface() {
  const [activeTab, setActiveTab] = useState('buy')
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false)
  const { isConnected } = useAccount()

  const walletConnected = isConnected
  const [buyForm, setBuyForm] = useState({
    tokenAddress: '',
    amount: '',
  })

  const [sellForm, setSellForm] = useState({
    tokenAddress: '',
    amount: '',
  })

  const [createKeyForm, setCreateKeyForm] = useState({
    name: '',
    symbol: '',
    tokenUri: '',
    twitterProfile: 'Will be gotten from verification',
  })

  const [twitterVerification, setTwitterVerification] = useState<{
    loading: boolean
    proof: Proof | Proof[] | string | undefined
  }>({
    loading: false,
    proof: undefined,
  })

  const calculateBuyPrice = (amount: any) => {
    if (!amount || isNaN(amount)) return '0.000'
    return (parseFloat(amount) * 0.0025).toFixed(6)
  }

  const calculateSellPrice = (amount: any) => {
    if (!amount || isNaN(amount)) return '0.000'
    return (parseFloat(amount) * 0.0023).toFixed(6)
  }

  const handleTwitterUserProfileVerification = () => {
    startReclaimVerification({
      fetchUrl: 'api/generate-config/twitter-user-profile',
      onStartVerification: () =>
        setTwitterVerification({ ...twitterVerification, loading: true }),
      onSuccessVerification: (proofs: any) => {
        setTwitterVerification({ loading: false, proof: proofs })
        setCreateKeyForm({
          ...createKeyForm,
          twitterProfile: JSON.parse(proofs.claimData.context)
            .extractedParameters.screen_name,
        })
        console.log('The proof recieved', proofs)
        console.log(
          'The parsed proof recieved',
          JSON.parse(proofs.claimData.context)
        )
      },
      onErrorVerification: (error) => {
        setTwitterVerification({ ...twitterVerification, loading: false })
        console.error('The error recieved', error)
      },
      onEndVerification: () =>
        setTwitterVerification({ ...twitterVerification, loading: false }),
    })
  }
  useEffect(() => {
    console.log(twitterVerification)
  }, [twitterVerification])
  const createBuyOrder = () => {}
  const createSellOrder = () => {}

  const handleCreateKey = () => {
    console.log('Creating key with data:', createKeyForm)
    setShowCreateKeyModal(false)
    setCreateKeyForm({ name: '', symbol: '', tokenUri: '', twitterProfile: '' })
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Reclaim FT Hook
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowCreateKeyModal(true)
                setTwitterVerification({ loading: false, proof: undefined })
              }}
              className="flex cursor-pointer items-center gap-2 px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-lg border border-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plus size={16} />
              Create Key
            </button>
            <CustomConnectButton />
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2 animate-pulse">
              Trade Key
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full opacity-80"></div>
          </div>

          <div className="flex mb-8 rounded-lg overflow-hidden shadow-lg">
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 py-4 px-6 text-center cursor-pointer font-semibold transition-all duration-300 relative ${
                activeTab === 'buy'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="relative z-10">Buy</span>
              {activeTab === 'buy' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-20 animate-pulse"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex-1 py-4 px-6 text-center cursor-pointer font-semibold transition-all duration-300 relative ${
                activeTab === 'sell'
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="relative z-10">Sell</span>
              {activeTab === 'sell' && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 opacity-20 animate-pulse"></div>
              )}
            </button>
          </div>

          <div className="space-y-6 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-2xl">
            {activeTab === 'buy' ? (
              <>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    Key Token Address
                  </label>
                  <textarea
                    value={buyForm.tokenAddress}
                    onChange={(e) =>
                      setBuyForm({ ...buyForm, tokenAddress: e.target.value })
                    }
                    placeholder="Please paste token address of key here"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 resize-none h-20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={buyForm.amount}
                    onChange={(e) =>
                      setBuyForm({ ...buyForm, amount: e.target.value })
                    }
                    placeholder="Enter number of tokens to buy"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                  />
                  {buyForm.amount && (
                    <div className="mt-2 p-2 bg-gray-800 rounded border-l-4 border-purple-500">
                      <p className="text-sm text-gray-300">
                        <span className="text-purple-400 font-semibold">
                          Price:
                        </span>{' '}
                        {calculateBuyPrice(buyForm.amount)} ETH
                      </p>
                    </div>
                  )}
                </div>

                <button
                  disabled={
                    !walletConnected || !buyForm.tokenAddress || !buyForm.amount
                  }
                  className="w-full py-4 bg-gradient-to-r cursor-pointer from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {!walletConnected
                    ? 'Connect Wallet to Buy'
                    : 'Execute Buy Order'}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    Key Token Address
                  </label>
                  <textarea
                    value={sellForm.tokenAddress}
                    onChange={(e) =>
                      setSellForm({ ...sellForm, tokenAddress: e.target.value })
                    }
                    placeholder="Please paste token address of key here"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 resize-none h-20 focus:border-red-400 focus:ring-2 focus:ring-red-400 focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={sellForm.amount}
                    onChange={(e) =>
                      setSellForm({ ...sellForm, amount: e.target.value })
                    }
                    placeholder="Enter number of tokens to sell"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400 focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                  />
                  {sellForm.amount && (
                    <div className="mt-2 p-2 bg-gray-800 rounded border-l-4 border-red-500">
                      <p className="text-sm text-gray-300">
                        <span className="text-red-400 font-semibold">
                          Price:
                        </span>{' '}
                        {calculateSellPrice(sellForm.amount)} ETH
                      </p>
                    </div>
                  )}
                </div>

                <button
                  disabled={
                    !walletConnected ||
                    !sellForm.tokenAddress ||
                    !sellForm.amount
                  }
                  className="w-full py-4 bg-gradient-to-r cursor-pointer from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {!walletConnected
                    ? 'Connect Wallet to Sell'
                    : 'Execute Sell Order'}
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 p-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; 2025 Reclaim FT Hook. Trade Keys of CT.</p>
        </div>
      </footer>

      {showCreateKeyModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Create Key</h2>
              <button
                onClick={() => setShowCreateKeyModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={createKeyForm.name}
                  onChange={(e) =>
                    setCreateKeyForm({ ...createKeyForm, name: e.target.value })
                  }
                  placeholder="Enter token name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Symbol
                </label>
                <input
                  type="text"
                  value={createKeyForm.symbol}
                  onChange={(e) =>
                    setCreateKeyForm({
                      ...createKeyForm,
                      symbol: e.target.value,
                    })
                  }
                  placeholder="Enter token symbol"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Token URI/Image
                </label>
                <input
                  type="text"
                  value={createKeyForm.tokenUri}
                  onChange={(e) =>
                    setCreateKeyForm({
                      ...createKeyForm,
                      tokenUri: e.target.value,
                    })
                  }
                  placeholder="Enter image URL or URI"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Twitter Profile
                </label>
                <input
                  type="text"
                  value={createKeyForm.twitterProfile}
                  readOnly
                  /*onChange={(e) =>
                    setCreateKeyForm({
                      ...createKeyForm,
                      twitterProfile: e.target.value,
                    })
                  }*/

                  placeholder="Enter Twitter handle"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                {twitterVerification.proof ? (
                  <div className="flex-1 py-3 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2">
                    <CheckCheck />
                    Verified
                  </div>
                ) : (
                  <button
                    onClick={handleTwitterUserProfileVerification}
                    className="flex-1 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    disabled={twitterVerification.loading}
                  >
                    {twitterVerification.loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <X size={28} />
                        Verify Twitter
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={handleCreateKey}
                  disabled={
                    !createKeyForm.name &&
                    !createKeyForm.symbol &&
                    !createKeyForm.tokenUri &&
                    !twitterVerification.proof
                  }
                  className="flex-1 py-3 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
                >
                  Create Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

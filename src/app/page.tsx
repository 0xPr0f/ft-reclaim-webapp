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
    twitterProfile: 'will be gotten from verification',
  })

  const [twitterVerification, setTwitterVerification] = useState({
    loading: false,
  })

  const [twitterUserProof, setTwitterUserProof] = useState()

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
        console.log('The proof recieved', proofs)

        setTwitterVerification({
          loading: false,
        })
        setTwitterUserProof(proofs)
        setCreateKeyForm({
          ...createKeyForm,
          twitterProfile: JSON.parse(proofs.claimData.context)
            .extractedParameters.screen_name,
        })

        console.log(
          'The parsed proof context recieved',
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

  const handleTwitterFollowerVerification = () => {
    startReclaimVerification({
      fetchUrl: 'api/generate-config/twitter-count',
      onStartVerification: () => {},
      onSuccessVerification: (proofs: any) => {
        console.log('The proof recieved', proofs)
        console.log(
          'The parsed proof context recieved',
          JSON.parse(proofs.claimData.context)
        )
      },
      onErrorVerification: (error) => {
        console.error('The error recieved', error)
      },
      onEndVerification: () => {},
    })
  }

  useEffect(() => {
    console.log('twitterVerification updated:', twitterVerification)
    console.log('twitterUserProof', twitterUserProof)
  }, [twitterVerification])

  const createBuyOrder = () => {
    handleTwitterFollowerVerification()
  }
  const createSellOrder = () => {}

  const handleCreateKey = () => {
    console.log('Creating key with data:', createKeyForm)
    setCreateKeyForm({ ...createKeyForm, name: '', symbol: '', tokenUri: '' })
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <header className="border-b border-blue-100 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-white shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent text-center sm:text-left">
            Reclaim FT Hook
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={() => {
                setShowCreateKeyModal(true)
                setTwitterVerification({ loading: false })
              }}
              className="flex cursor-pointer items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 bg-gradient-to-r from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
              <span className="">Create Key</span>
            </button>
            <div className="flex-shrink-0">
              <CustomConnectButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent mb-2 animate-pulse">
              Trade Key
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-400 mx-auto rounded-full opacity-80"></div>
          </div>

          <div className="flex mb-8 rounded-lg overflow-hidden shadow-lg border border-blue-100">
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 py-4 px-6 text-center cursor-pointer font-semibold transition-all duration-300 relative ${
                activeTab === 'buy'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <span className="relative z-10">Buy</span>
              {activeTab === 'buy' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-20 animate-pulse"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex-1 py-4 px-6 text-center cursor-pointer font-semibold transition-all duration-300 relative ${
                activeTab === 'sell'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-red-600 hover:text-red-700 hover:bg-red-50'
              }`}
            >
              <span className="relative z-10">Sell</span>
              {activeTab === 'sell' && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 opacity-20 animate-pulse"></div>
              )}
            </button>
          </div>

          <div className="space-y-6 bg-white p-6 rounded-xl border border-blue-100 shadow-2xl">
            {activeTab === 'buy' ? (
              <>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-3">
                    Key Token Address
                  </label>
                  <textarea
                    value={buyForm.tokenAddress}
                    onChange={(e) =>
                      setBuyForm({ ...buyForm, tokenAddress: e.target.value })
                    }
                    placeholder="Please paste token address of key here"
                    className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 text-gray-800 placeholder-gray-500 resize-none h-20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-3">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={buyForm.amount}
                    onChange={(e) =>
                      setBuyForm({ ...buyForm, amount: e.target.value })
                    }
                    placeholder="Enter number of tokens to buy"
                    className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 focus:outline-none transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {buyForm.amount && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                      <p className="text-sm text-gray-700">
                        <span className="text-blue-600 font-semibold">
                          Price:
                        </span>{' '}
                        {calculateBuyPrice(buyForm.amount)} ETH
                      </p>
                    </div>
                  )}
                </div>

                <button
                  disabled={
                    //  !walletConnected ||
                    !buyForm.tokenAddress || !buyForm.amount
                  }
                  onClick={createBuyOrder}
                  className="w-full py-4 bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {!walletConnected
                    ? 'Connect Wallet to Buy'
                    : 'Execute Buy Order'}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-3">
                    Key Token Address
                  </label>
                  <textarea
                    value={sellForm.tokenAddress}
                    onChange={(e) =>
                      setSellForm({ ...sellForm, tokenAddress: e.target.value })
                    }
                    placeholder="Please paste token address of key here"
                    className="w-full bg-red-50 border border-red-200 rounded-lg p-4 text-gray-800 placeholder-gray-500 resize-none h-20 focus:border-red-400 focus:ring-2 focus:ring-red-400 focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-3">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={sellForm.amount}
                    onChange={(e) =>
                      setSellForm({ ...sellForm, amount: e.target.value })
                    }
                    placeholder="Enter number of tokens to sell"
                    className="w-full bg-red-50 border border-red-200 rounded-lg p-4 text-gray-800 placeholder-gray-500 focus:border-red-400 focus:ring-2 focus:ring-red-400 focus:ring-opacity-20 focus:outline-none transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {sellForm.amount && (
                    <div className="mt-2 p-2 bg-red-50 rounded border-l-4 border-red-500">
                      <p className="text-sm text-gray-700">
                        <span className="text-red-600 font-semibold">
                          Price:
                        </span>{' '}
                        {calculateSellPrice(sellForm.amount)} ETH
                      </p>
                    </div>
                  )}
                </div>

                <button
                  disabled={
                    //  !walletConnected ||
                    !sellForm.tokenAddress || !sellForm.amount
                  }
                  className="w-full py-4 bg-gradient-to-r cursor-pointer from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
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

      <footer className="border-t border-blue-100 p-4 bg-gradient-to-r from-white to-blue-50">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; 2025 Reclaim FT Hook. Trade Keys of CT.</p>
        </div>
      </footer>

      {showCreateKeyModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md border border-blue-200 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Key
              </h2>
              <button
                onClick={() => setShowCreateKeyModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={createKeyForm.name}
                  onChange={(e) =>
                    setCreateKeyForm({ ...createKeyForm, name: e.target.value })
                  }
                  placeholder="Enter token name"
                  className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-2">
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
                  className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-2">
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
                  className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-2">
                  Twitter Profile
                </label>
                <input
                  type="text"
                  value={createKeyForm.twitterProfile}
                  readOnly
                  placeholder="Enter Twitter handle"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                {twitterUserProof &&
                JSON.stringify(twitterUserProof).length > 20 ? (
                  <div className="flex-1 py-3 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2">
                    <CheckCheck />
                    Verified
                  </div>
                ) : (
                  <button
                    onClick={handleTwitterUserProfileVerification}
                    className="flex-1 py-3 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    disabled={twitterVerification.loading}
                  >
                    {twitterVerification.loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <X size={26} />
                        Verify Twitter
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={handleCreateKey}
                  disabled={
                    !createKeyForm.name ||
                    !createKeyForm.symbol ||
                    !createKeyForm.tokenUri ||
                    !twitterUserProof
                  }
                  className="flex-1 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
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

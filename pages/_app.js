import '../styles/globals.css'
import Layout from '../components/Layout.js'
import 'bootstrap/dist/css/bootstrap.min.css';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const chains = [mainnet]
const projectId = '2998a8aea5555affdc4dec7bb1f2ce49'

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider
})
const ethereumClient = new EthereumClient(wagmiClient, chains)


function MyApp({ Component, pageProps }) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>
    </>
  )
}

export default MyApp

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import CustomWalletProvider from './components/CustomWalletProvider.tsx'
import { Toaster } from 'react-hot-toast'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CustomWalletProvider>
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }} />
      <App />
    </CustomWalletProvider>
  </React.StrictMode>,
)

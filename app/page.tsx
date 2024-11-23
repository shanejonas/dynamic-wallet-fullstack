import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import App from '@/components/app';
import './page.module.scss';


const Page = () => (
  <DynamicContextProvider
    settings={{
      environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID || '',
      walletConnectors: [ EthereumWalletConnectors ],
    }}>
    <App />
  </DynamicContextProvider>
);

export default Page;
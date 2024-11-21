import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import AppWithSidebar from '@/components/app-with-sidebar';
import './page.module.scss';


const App = () => (
  <DynamicContextProvider
    settings={{
      environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID || '',
      walletConnectors: [ EthereumWalletConnectors ],
    }}>
    <AppWithSidebar />
  </DynamicContextProvider>
);

export default App;
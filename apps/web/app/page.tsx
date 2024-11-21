import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import AppWithSidebar from '@/components/app-with-sidebar';
import './page.module.scss';

const App = () => (
  <DynamicContextProvider
    settings={{
      environmentId: '021434db-8989-4cdc-9cbb-92d8d6c5745d',
      walletConnectors: [ EthereumWalletConnectors ],
    }}>
    <AppWithSidebar />
    <DynamicWidget />
  </DynamicContextProvider>
);

export default App;
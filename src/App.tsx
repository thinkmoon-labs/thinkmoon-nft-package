import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { NFT } from "./components/NftList";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}

          <NFT />
        </header>
      </div>
    </QueryClientProvider>
  );
}

export default App;

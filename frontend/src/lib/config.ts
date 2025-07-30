import { xrplevmTestnet } from "viem/chains";
import { http, createConfig } from "wagmi";
export const config = createConfig({
  chains: [xrplevmTestnet],
  transports: {
    [xrplevmTestnet.id]: http(),
  },
});
# Nuvex Contract Deployment Guide

This repository contains the Resolver and TestEscrowFactory contracts for cross-chain atomic swaps using the 1inch ecosystem.

## Contracts Overview

### 1. Resolver Contract
The `Resolver` contract serves as the main interface for:
- Deploying source chain escrows with safety deposits
- Deploying destination chain escrows
- Withdrawing funds with secrets
- Canceling escrows
- Making arbitrary calls (owner only)

### 2. TestEscrowFactory Contract
The `TestEscrowFactory` extends the base EscrowFactory and provides:
- Creation of escrow contracts for cross-chain swaps
- Deterministic address computation for escrows
- Integration with 1inch Limit Order Protocol

## Architecture & How It Works

### Cross-Chain Swap Flow

1. **Initiation**: User wants to swap Token A on Chain 1 for Token B on Chain 2
2. **Source Escrow**: Resolver deploys an escrow on Chain 1 with:
   - User's tokens
   - Safety deposit
   - Timelock parameters
   - Secret hash
3. **Destination Escrow**: Resolver deploys corresponding escrow on Chain 2
4. **Secret Reveal**: When conditions are met, secret is revealed to unlock funds
5. **Withdrawal**: Users can withdraw their tokens on both chains using the secret

### Key Features

- **Atomic Swaps**: Either both sides complete or both fail
- **Safety Deposits**: Prevent malicious behavior
- **Timelocks**: Provide escape mechanisms if swaps fail
- **1inch Integration**: Leverages 1inch Limit Order Protocol for efficient execution

## Prerequisites

1. **Foundry**: Install from [getfoundry.sh](https://getfoundry.sh/)
2. **Node.js**: Version 18+ for additional tooling
3. **Git**: For cloning and managing the repository

## Setup

1. Clone the repository:
```bash
git clone https://github.com/SHLOK333/Nuvex.git
cd Nuvex
```

2. Install dependencies:
```bash
forge install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your values
```

4. Compile contracts:
```bash
forge build
```

5. Run tests:
```bash
forge test
```

## Deployment

### Local Deployment (Anvil)

1. Start local node:
```bash
anvil
```

2. Deploy contracts:
```bash
forge script script/DeployResolver.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

### Testnet Deployment (Sepolia)

1. Deploy to Sepolia:
```bash
forge script script/DeployResolver.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

### Mainnet Deployment

1. Deploy to Ethereum Mainnet:
```bash
forge script script/DeployResolver.s.sol --rpc-url $MAINNET_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

## Post-Deployment

After successful deployment, the script will:
1. Output contract addresses to console
2. Save deployment info to `deployment-{chainId}.txt`
3. Verify contracts on Etherscan (if --verify flag used)

### Verify Deployment

You can verify the deployment was successful:
```bash
forge script script/DeployResolver.s.sol --sig "verifyDeployment(address,address)" <escrow_factory_address> <resolver_address> --rpc-url <rpc_url>
```

## Usage Examples

### Deploying a Source Escrow

```solidity
// Example of deploying a source escrow
IBaseEscrow.Immutables memory immutables = IBaseEscrow.Immutables({
    orderHash: keccak256("order_data"),
    hashlock: keccak256("secret"),
    maker: msg.sender,
    taker: takerAddress,
    token: tokenAddress,
    amount: 1000e18,
    safetyDeposit: 0.1 ether,
    timelocks: timelocks,
    chainId: block.chainid
});

resolver.deploySrc{value: 0.1 ether}(
    immutables,
    order,
    r,
    vs,
    amount,
    takerTraits,
    args
);
```

### Withdrawing from Escrow

```solidity
// Withdraw using secret
bytes32 secret = "my_secret";
resolver.withdraw(escrow, secret, immutables);
```

## Security Considerations

1. **Private Key Security**: Never commit private keys to version control
2. **Safety Deposits**: Ensure adequate safety deposits to prevent griefing
3. **Timelock Settings**: Set appropriate rescue delays for your use case
4. **Testing**: Thoroughly test on testnets before mainnet deployment
5. **Access Control**: Only authorized addresses should call sensitive functions

## Network Configuration

The deployment script includes configurations for:
- **Ethereum Mainnet** (Chain ID: 1)
- **Sepolia Testnet** (Chain ID: 11155111)

## Gas Optimization

The contracts use:
- `via_ir = true` for better optimization
- `optimizer_runs = 1000000` for gas efficiency
- Minimal proxy pattern for escrow deployment

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure remappings in `foundry.toml` are correct
2. **Insufficient Balance**: Ensure deployer has enough ETH for gas and safety deposits
3. **Network Issues**: Check RPC URL and network connectivity
4. **Verification Failures**: Ensure API keys are correct and contracts are deployed

### Getting Help

- Check Foundry documentation: [book.getfoundry.sh](https://book.getfoundry.sh/)
- Review 1inch documentation for integration details
- Open issues in the repository for bugs or questions


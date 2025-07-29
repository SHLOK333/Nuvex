# Makefile for Nuvex Contract Deployment

# Load environment variables
include .env
export

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make build          - Compile contracts"
	@echo "  make test           - Run tests"
	@echo "  make deploy-local   - Deploy to local Anvil"
	@echo "  make deploy-sepolia - Deploy to Sepolia testnet"
	@echo "  make deploy-mainnet - Deploy to Ethereum mainnet"
	@echo "  make deploy-polygon - Deploy to Polygon mainnet"
	@echo "  make deploy-arbitrum- Deploy to Arbitrum One"
	@echo "  make verify         - Verify contracts on Etherscan"
	@echo "  make clean          - Clean build artifacts"

# Build contracts
.PHONY: build
build:
	forge build

# Run tests
.PHONY: test
test:
	forge test -vvv

# Clean build artifacts
.PHONY: clean
clean:
	forge clean

# Start local Anvil node
.PHONY: anvil
anvil:
	anvil --host 0.0.0.0

# Deploy to local Anvil
.PHONY: deploy-local
deploy-local:
	@echo "Deploying to local Anvil..."
	forge script script/DeployResolver.s.sol \
		--rpc-url http://localhost:8545 \
		--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
		--broadcast \
		-vvvv

# Deploy to Sepolia testnet
.PHONY: deploy-sepolia
deploy-sepolia:
	@echo "Deploying to Sepolia testnet..."
	forge script script/DeployResolver.s.sol \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		-vvvv

# Deploy to Ethereum mainnet
.PHONY: deploy-mainnet
deploy-mainnet:
	@echo "⚠️  Deploying to MAINNET! Are you sure? [y/N]" && read ans && [ $${ans:-N} = y ]
	forge script script/DeployResolver.s.sol \
		--rpc-url $(MAINNET_RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		-vvvv

# Deploy to Polygon mainnet
.PHONY: deploy-polygon
deploy-polygon:
	@echo "Deploying to Polygon mainnet..."
	forge script script/DeployResolver.s.sol \
		--rpc-url $(POLYGON_RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(POLYGONSCAN_API_KEY) \
		-vvvv

# Deploy to Arbitrum One
.PHONY: deploy-arbitrum
deploy-arbitrum:
	@echo "Deploying to Arbitrum One..."
	forge script script/DeployResolver.s.sol \
		--rpc-url $(ARBITRUM_RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(ARBISCAN_API_KEY) \
		-vvvv

# Verify contracts manually (if auto-verification failed)
.PHONY: verify
verify:
	@echo "Enter contract address to verify:"
	@read contract_addr; \
	echo "Enter constructor arguments (if any):"; \
	read constructor_args; \
	forge verify-contract \
		--chain-id $(shell cast chain-id --rpc-url $(SEPOLIA_RPC_URL)) \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		--constructor-args $$constructor_args \
		$$contract_addr \
		src/Resolver.sol:Resolver

# Check deployment status
.PHONY: status
status:
	@echo "Checking deployment status..."
	@if [ -f deployment-11155111.txt ]; then \
		echo "Sepolia deployment found:"; \
		cat deployment-11155111.txt; \
	fi
	@if [ -f deployment-1.txt ]; then \
		echo "Mainnet deployment found:"; \
		cat deployment-1.txt; \
	fi

# Run gas report
.PHONY: gas-report
gas-report:
	forge test --gas-report

# Run coverage report
.PHONY: coverage
coverage:
	forge coverage

# Format code
.PHONY: format
format:
	forge fmt

# Lint code
.PHONY: lint
lint:
	forge fmt --check

# Install dependencies
.PHONY: install
install:
	forge install

# Update dependencies
.PHONY: update
update:
	forge update

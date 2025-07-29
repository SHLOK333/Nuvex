// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

import {Resolver} from "../src/Resolver.sol";
import {TestEscrowFactory} from "../src/TestEscrowFactory.sol";
import {IOrderMixin} from "limit-order-protocol/contracts/interfaces/IOrderMixin.sol";
import {IEscrowFactory} from "cross-chain-swap/interfaces/IEscrowFactory.sol";

/**
 * @title Deployment Script for Resolver and TestEscrowFactory
 * @dev This script deploys both the TestEscrowFactory and Resolver contracts
 */
contract DeployResolver is Script {
    // Network configurations
    struct NetworkConfig {
        address limitOrderProtocol;
        address feeToken;
        address accessToken;
        uint32 rescueDelaySrc;
        uint32 rescueDelayDst;
    }

    // Default configurations for different networks
    mapping(uint256 => NetworkConfig) public networkConfigs;

    function setUp() public {
        // Ethereum Mainnet
        networkConfigs[1] = NetworkConfig({
            limitOrderProtocol: 0x111111125421cA6dc452d289314280a0f8842A65, // 1inch Limit Order Protocol
            feeToken: 0xA0B86A33E6441cca94BdC5D079d1b85E9E01f2D8, // USDC or suitable fee token
            accessToken: 0xA0B86A33E6441cca94BdC5D079d1b85E9E01f2D8, // Access control token
            rescueDelaySrc: 1 days,
            rescueDelayDst: 1 days
        });

        // Ethereum Sepolia Testnet
        networkConfigs[11155111] = NetworkConfig({
            limitOrderProtocol: 0x111111125421cA6dc452d289314280a0f8842A65, // 1inch LOP on Sepolia
            feeToken: 0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5, // Test USDC
            accessToken: 0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5, // Test token for access
            rescueDelaySrc: 30 minutes, // Shorter delays for testing
            rescueDelayDst: 30 minutes
        });

        // Polygon Mainnet
        networkConfigs[137] = NetworkConfig({
            limitOrderProtocol: 0x111111125421cA6dc452d289314280a0f8842A65,
            feeToken: 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174, // USDC on Polygon
            accessToken: 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174,
            rescueDelaySrc: 1 days,
            rescueDelayDst: 1 days
        });

        // Arbitrum One
        networkConfigs[42161] = NetworkConfig({
            limitOrderProtocol: 0x111111125421cA6dc452d289314280a0f8842A65,
            feeToken: 0xA0B86A33E6441cca94BdC5D079d1b85E9E01f2D8, // USDC on Arbitrum
            accessToken: 0xA0B86A33E6441cca94BdC5D079d1b85E9E01f2D8,
            rescueDelaySrc: 1 days,
            rescueDelayDst: 1 days
        });
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        uint256 chainId = block.chainid;

        console.log("Deploying contracts on chain ID:", chainId);
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);

        NetworkConfig memory config = getNetworkConfig(chainId);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TestEscrowFactory first
        console.log("Deploying TestEscrowFactory...");
        TestEscrowFactory escrowFactory = new TestEscrowFactory(
            config.limitOrderProtocol,
            IERC20(config.feeToken),
            IERC20(config.accessToken),
            deployer, // owner
            config.rescueDelaySrc,
            config.rescueDelayDst
        );

        console.log("TestEscrowFactory deployed at:", address(escrowFactory));

        // Deploy Resolver
        console.log("Deploying Resolver...");
        Resolver resolver = new Resolver(
            IEscrowFactory(address(escrowFactory)),
            IOrderMixin(config.limitOrderProtocol),
            deployer // initial owner
        );

        console.log("Resolver deployed at:", address(resolver));

        vm.stopBroadcast();

        // Log deployment summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network Chain ID:", chainId);
        console.log("TestEscrowFactory:", address(escrowFactory));
        console.log("Resolver:", address(resolver));
        console.log("Owner:", deployer);
        console.log("Limit Order Protocol:", config.limitOrderProtocol);
        console.log("Fee Token:", config.feeToken);
        console.log("Access Token:", config.accessToken);
        console.log("Rescue Delay Src:", config.rescueDelaySrc);
        console.log("Rescue Delay Dst:", config.rescueDelayDst);

        // Save deployment addresses to file
        saveDeploymentInfo(chainId, address(escrowFactory), address(resolver), deployer);
    }

    function getNetworkConfig(uint256 chainId) internal view returns (NetworkConfig memory) {
        NetworkConfig memory config = networkConfigs[chainId];
        
        // If no config found for the current chain, use default values
        if (config.limitOrderProtocol == address(0)) {
            console.log("Warning: No configuration found for chain ID", chainId);
            console.log("Using default configuration - please verify addresses!");
            
            return NetworkConfig({
                limitOrderProtocol: 0x111111125421cA6dc452d289314280a0f8842A65,
                feeToken: address(0), // Will need to be set manually
                accessToken: address(0), // Will need to be set manually
                rescueDelaySrc: 1 days,
                rescueDelayDst: 1 days
            });
        }
        
        return config;
    }

    function saveDeploymentInfo(
        uint256 chainId,
        address escrowFactory,
        address resolver,
        address owner
    ) internal {
        string memory deploymentInfo = string.concat(
            "# Deployment Information\n",
            "Chain ID: ", vm.toString(chainId), "\n",
            "TestEscrowFactory: ", vm.toString(escrowFactory), "\n",
            "Resolver: ", vm.toString(resolver), "\n",
            "Owner: ", vm.toString(owner), "\n",
            "Deployed at block: ", vm.toString(block.number), "\n",
            "Deployed at timestamp: ", vm.toString(block.timestamp), "\n"
        );
        
        string memory filename = string.concat("deployment-", vm.toString(chainId), ".txt");
        vm.writeFile(filename, deploymentInfo);
        console.log("Deployment info saved to:", filename);
    }

    // Helper function to verify deployment
    function verifyDeployment(address escrowFactory, address resolver) external view {
        require(escrowFactory != address(0), "EscrowFactory not deployed");
        require(resolver != address(0), "Resolver not deployed");
        
        // Basic verification that contracts exist
        uint256 factoryCodeSize;
        uint256 resolverCodeSize;
        
        assembly {
            factoryCodeSize := extcodesize(escrowFactory)
            resolverCodeSize := extcodesize(resolver)
        }
        
        require(factoryCodeSize > 0, "EscrowFactory has no code");
        require(resolverCodeSize > 0, "Resolver has no code");
        
        console.log("Contract verification successful!");
        console.log("EscrowFactory code size:", factoryCodeSize);
        console.log("Resolver code size:", resolverCodeSize);
    }
}

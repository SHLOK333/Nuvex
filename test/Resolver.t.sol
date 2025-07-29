// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test, console} from "forge-std/Test.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

import {Resolver} from "../src/Resolver.sol";
import {TestEscrowFactory} from "../src/TestEscrowFactory.sol";
import {IOrderMixin} from "limit-order-protocol/contracts/interfaces/IOrderMixin.sol";
import {IEscrowFactory} from "cross-chain-swap/interfaces/IEscrowFactory.sol";

contract ResolverTest is Test {
    Resolver public resolver;
    TestEscrowFactory public escrowFactory;
    
    address public owner;
    address public limitOrderProtocol;
    address public feeToken;
    address public accessToken;
    
    uint32 public constant RESCUE_DELAY_SRC = 1 days;
    uint32 public constant RESCUE_DELAY_DST = 1 days;

    function setUp() public {
        owner = makeAddr("owner");
        limitOrderProtocol = makeAddr("limitOrderProtocol");
        feeToken = makeAddr("feeToken");
        accessToken = makeAddr("accessToken");
        
        vm.startPrank(owner);
        
        // Deploy TestEscrowFactory
        escrowFactory = new TestEscrowFactory(
            limitOrderProtocol,
            IERC20(feeToken),
            IERC20(accessToken),
            owner,
            RESCUE_DELAY_SRC,
            RESCUE_DELAY_DST
        );
        
        // Deploy Resolver
        resolver = new Resolver(
            IEscrowFactory(address(escrowFactory)),
            IOrderMixin(limitOrderProtocol),
            owner
        );
        
        vm.stopPrank();
    }

    function testDeployment() public view {
        // Test that contracts are deployed correctly
        assertEq(resolver.owner(), owner);
        assertTrue(address(resolver) != address(0));
        assertTrue(address(escrowFactory) != address(0));
    }

    function testResolverReceiveFunction() public {
        // Test that resolver can receive ETH
        uint256 initialBalance = address(resolver).balance;
        
        vm.deal(address(this), 1 ether);
        (bool success,) = address(resolver).call{value: 0.5 ether}("");
        
        assertTrue(success);
        assertEq(address(resolver).balance, initialBalance + 0.5 ether);
    }

    function testOnlyOwnerModifier() public {
        address nonOwner = makeAddr("nonOwner");
        
        // Test that non-owner cannot call owner-only functions
        vm.prank(nonOwner);
        vm.expectRevert();
        resolver.arbitraryCalls(new address[](0), new bytes[](0));
    }

    function testArbitraryCallsLengthMismatch() public {
        address[] memory targets = new address[](2);
        bytes[] memory arguments = new bytes[](1);
        
        targets[0] = makeAddr("target1");
        targets[1] = makeAddr("target2");
        arguments[0] = "";
        
        vm.prank(owner);
        vm.expectRevert();
        resolver.arbitraryCalls(targets, arguments);
    }

    function testArbitraryCallsSuccess() public {
        address[] memory targets = new address[](1);
        bytes[] memory arguments = new bytes[](1);
        
        // Use a simple contract call that won't revert
        targets[0] = address(resolver);
        arguments[0] = "";
        
        vm.prank(owner);
        resolver.arbitraryCalls(targets, arguments);
        // Should not revert
    }
}

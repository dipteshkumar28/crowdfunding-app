// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script,console} from "lib/forge-std/src/Script.sol";
import {CrowdFunding} from "../src/CrowdFunding.sol";

contract DeployCrowdFunding is Script {
    function run() external {
        vm.startBroadcast();
        CrowdFunding crowdfunding = new CrowdFunding();
        console.log("CrowdFunding deployed at:", address(crowdfunding));
        vm.stopBroadcast();
    }
}
 
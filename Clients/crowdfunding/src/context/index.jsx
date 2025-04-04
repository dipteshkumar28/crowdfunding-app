import React, { createContext, useState, useContext, useEffect } from "react";
import { BrowserProvider, ethers, parseEther, formatEther } from "ethers";


// Import your contract ABI
let contractABI =
    [
        {
            "type": "function",
            "name": "campaigns",
            "inputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "owner",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "title",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "description",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "target",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "deadline",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "amountCollected",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "image",
                    "type": "string",
                    "internalType": "string"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "createCampaign",
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "_title",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "_description",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "_target",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "_deadline",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "_image",
                    "type": "string",
                    "internalType": "string"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "donateToCampaign",
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [],
            "stateMutability": "payable"
        },
        {
            "type": "function",
            "name": "getCampaign",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "tuple[]",
                    "internalType": "struct CrowdFunding.Campaign[]",
                    "components": [
                        {
                            "name": "owner",
                            "type": "address",
                            "internalType": "address"
                        },
                        {
                            "name": "title",
                            "type": "string",
                            "internalType": "string"
                        },
                        {
                            "name": "description",
                            "type": "string",
                            "internalType": "string"
                        },
                        {
                            "name": "target",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "deadline",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "amountCollected",
                            "type": "uint256",
                            "internalType": "uint256"
                        },
                        {
                            "name": "image",
                            "type": "string",
                            "internalType": "string"
                        },
                        {
                            "name": "donators",
                            "type": "address[]",
                            "internalType": "address[]"
                        },
                        {
                            "name": "donations",
                            "type": "uint256[]",
                            "internalType": "uint256[]"
                        }
                    ]
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getDonators",
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "address[]",
                    "internalType": "address[]"
                },
                {
                    "name": "",
                    "type": "uint256[]",
                    "internalType": "uint256[]"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "noOfCampaigns",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        }
    ]


// Contract address
const CONTRACT_ADDRESS = "0x76b3469FDDD38b79Db61aD4b23B8Be34772f925b";

// Create context
const stateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [address, setAddress] = useState("");

    useEffect(() => {
        const connectWallet = async () => {
            if (window.ethereum) {
                try {
                    const web3Provider = new BrowserProvider(window.ethereum);
                    
                    const web3Signer = await web3Provider.getSigner();
                    const userAddress = await web3Signer.getAddress();

                    setProvider(web3Provider);
                    setSigner(web3Signer);
                    setAddress(userAddress);

                    // Initialize contract instance
                    const campaignContract = new ethers.Contract(
                        CONTRACT_ADDRESS,
                        contractABI,
                        web3Signer
                    );
                    setContract(campaignContract);
                } catch (error) {
                    console.error("Wallet connection failed:", error.message || error);
                }
            } else {
                console.error("No Ethereum provider found. Install MetaMask.");
            }
        };

        connectWallet();
    }, []);

    // Function to create a campaign
    const publishCampaign = async (form) => {
        if (!contract) return console.error("Contract not loaded");

        try {
            const tx = await contract.createCampaign(
                address,
                form.title,
                form.description,
                ethers.parseEther(form.target.toString()), // Convert ETH to Wei
                Math.floor(new Date(form.deadline).getTime() / 1000), // Convert deadline to Unix timestamp
                form.image
            );

            await tx.wait(); // Wait for transaction confirmation
            console.log("Transaction successful:", tx);
        } catch (error) {
            console.error("Transaction failed:", error);
        }
    };

    const getCampaigns = async () => {

        try {
            // ✅ Corrected function call (directly calling contract function)
            const campaigns = await contract.getCampaign();

            const parsedCampaigns = campaigns.map((campaign, i) => ({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                target: ethers.formatEther(campaign.target.toString()),
                deadline: campaign.deadline.toString(),
                amountCollected: ethers.formatEther(campaign.amountCollected.toString()),
                image: campaign.image,
                pId: i,
            }))

            return parsedCampaigns;
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            return [];
        }
    }

    const getUserCampaigns = async () => {
        const allcampaigns = await getCampaigns();
        const filteredcampaigns = allcampaigns.filter((campaign) => campaign.owner === address);

        return filteredcampaigns;
    }

    const donate = async (pId, amount) => {
        const data = await contract.donateToCampaign(pId, { value: ethers.parseEther(amount) });
        return data;
    }

    const getDonations = async (pId) => {
        const donations = await contract.getDonators(pId); 
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations;
    }

    return (
        <stateContext.Provider
            value={{
                address,
                contract,
                connectWallet: () => window.ethereum.request({ method: "eth_requestAccounts" }),
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations
            }}
        >
            {children}
        </stateContext.Provider>
    );
};

// Custom hook to access state context
export const useStateContext = () => useContext(stateContext);

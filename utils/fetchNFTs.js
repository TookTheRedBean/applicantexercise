// Go to www.alchemy.com and create an account to grab your own api key!
const apiKey = "YOURKEY";
const endpoint = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`;
const contractAddr = "0xd9c036e9eef725e5aca4a22239a23feb47c3f05d";

const getAddressNFTs = async (owner, contractAddress, retryAttempt) => {
    if (retryAttempt === 5) {
        return;
    }
    if (owner) {
        let data;
        try {
            if (contractAddr) {
               
                data = await fetch(`${endpoint}/getNFTs?owner=${owner}&contractAddresses[]=${contractAddr}&withMetadata=false`).then(data => data.json())
               // console.log(data)
            } else {
                data = await fetch(`${endpoint}/getNFTs?owner=${owner}`).then(data => data.json())
            }
        } catch (e) {
            getAddressNFTs(endpoint, owner, contractAddress, retryAttempt+1)
        }

        // NFT token IDs basically
        return data
    }
}

const getNFTsMetadata = async (NFTS) => {
    const NFTsMetadata = await Promise.allSettled(NFTS.map(async (NFT) => {

        const metadata = await fetch(`https://api-mb-prd-01.azurewebsites.net/token-details/${Number(NFT.id.tokenId)}`,).then(data => data.json())
        let imageUrl;
         /* console.log("metadata", metadata)
         console.log(metadata.attributes)*/
         imageUrl = metadata.image
          
     


        return {
            id: NFT.id.tokenId,
            contractAddress: contractAddr,
            image: imageUrl,
            title: metadata.name,
            description: metadata.description,
            attributes: metadata.attributes
        }
    }))

    return NFTsMetadata
}

const fetchNFTs = async (owner, contractAddress, setNFTs) => {
    try {
    const data = await getAddressNFTs(owner, contractAddress)
    if (data.ownedNfts.length) {
        const NFTs = await getNFTsMetadata(data.ownedNfts)
        let fullfilledNFTs = NFTs.filter(NFT => NFT.status === "fulfilled")
        setNFTs(fullfilledNFTs)
    } else {
        setNFTs(null)
    }
        }catch (error) {
         
        console.log(error);
   
      }

    
}

export {fetchNFTs,getNFTsMetadata};
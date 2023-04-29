import { config as loadEnv } from 'dotenv';
import { SDK, Auth } from '@infura/sdk';
loadEnv();

// Create Auth object
const auth = new Auth({
    projectId: process.env.INFURA_API_KEY,
    secretId: process.env.INFURA_API_KEY_SECRET,
    privateKey: "NOT A PRIVATE KEY",
    chainId: 1,
});

// Instantiate SDK
const sdk = new SDK(auth);

export default async function getTokensForAddress(req, res) {
    const address = req.query.address;
    const nfts = [];
    let cursor = "";
    let page = 0;

    do {
        const response = await sdk.api.getNFTs({
            publicAddress: address,
            cursor,
        });

        cursor = response.cursor;

        // loop through the nfts and only add the ones that match process.env.COLLECTION_ADDRESS
        response.assets.forEach(nft => {
            if (nft.contract.toLowerCase() === process.env.COLLECTION_ADDRESS.toLowerCase()) {
                nfts.push(nft);
            }
        });

        page++;
    } while (cursor);

    res.status(200).json(nfts);
}
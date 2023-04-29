import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Card({ token, contractAddress }) {
    const [hasLoadedImage, setHasLoadedImage] = useState(false);

    if (!token) {
        return null;
    }

    let imageUrl = "";

    // If we don't have the image data, try to get it from the metadata
    // unless the metadata image is an ipfs link
    if (token.image) {
        imageUrl = token.image + "?img-width=420";
    }

    console.log(token)
    return (
        <a className="block hover:bg-gray-900" href={`https://opensea.io/assets/ethereum/${contractAddress}/${token.id}`} target='_blank'>
            <div className="box-border flex items-center px-4 pt-4 sm:px-6">
                <div className="min-w-0 flex-1 justify-center items-center">
                    <div className="flex justify-center max-h-[154px] max-w-[420px]">
                        <motion.div
                            initial={{ opacity: hasLoadedImage ? 1 : 0 }}
                            animate={hasLoadedImage ? { opacity: 1, scale: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={"relative w-full"}>
                                <img className={"max-h-[154px] max-w-[420px] w-full "} src={imageUrl} onLoad={() => setHasLoadedImage(true)} />
                            </div>
                        </motion.div>
                        {
                            !hasLoadedImage && (<div className="h-[137.5px] w-[420px] bg-gray-800 animate-pulse"></div>)
                        }
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                        <div>
                            <p className="mt-2 flex items-center text-sm text-white">
                                {token ? "Token #" + token.id : "Loading..."}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </a>
    )
}
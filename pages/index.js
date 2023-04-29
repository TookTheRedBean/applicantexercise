import Head from 'next/head'
import { useState, useEffect } from 'react'
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import objectPath from "object-path";
import { Web3Button } from '@web3modal/react';
import { useAccount } from 'wagmi';
import { Disclosure } from '@headlessui/react'

import { HomePageWrapper } from "../styles/HomeStyles";
import Card from '../components/Card';

const OWNED_NFTS_FILTER_KEY = "Owned NFTs";
const MB_CONTRACT_ADDRESS = "0xD9c036e9EEF725E5AcA4a22239A23feb47c3f05d";

export default function Home() {
  const [allTokens, setAllTokens] = useState([]);
  const [visibleTokens, setVisibleTokens] = useState([]);
  const [filters, setFilters] = useState({});
  const [communityFilters, setCommunityFilters] = useState([]);
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const { address, isConnected } = useAccount();

  const [isMounted, setIsMounted] = useState(false);

  // Necessary to resolve SSR hydration issue with walletconnect
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, []);

  // If connected to wallet, fetch the owned NFTs
  useEffect(() => {
    if (!address || !isConnected) {
      return;
    }

    fetch("/api/getTokensForAddress?address=" + address)
      .then((res) => res.json()).then((data) => {
        setOwnedNFTs(data);
      });
  }, [address, isConnected]);


  useEffect(() => {
    // read the tokens from data/mb_results.json
    fetch("/mb_result.json").then((res) => res.json()).then((data) => {
      setAllTokens(data);
      setVisibleTokens(data);
    });

    // read the community filters from public/community_filters.json
    fetch("/community_filters.json").then((res) => res.json()).then((data) => {
      const filters = [];
      data.forEach(filter => {
        let filterName = "";

        Object.keys(filter).forEach((filterPath, idx) => {
          filterName += filter[filterPath].join(" or ");

          if (idx < Object.keys(filter).length - 1) {
            filterName += ", ";
          }
        });

        filters.push({
          name: filterName,
          filter
        });
      });

      setCommunityFilters(filters);
    });
  }, []);

  // Update the visible tokens when the filters change
  useEffect(() => {
    const newVisibleTokens = allTokens.filter((token) => {
      let didFindOverallMatch = false;

      // If there are no filters, then we want to show all tokens
      if (Object.keys(filters).length === 0) {
        return true;
      }

      Object.keys(filters).forEach(filterKey => {
        let didFindMatchingFilter = true;
        const filterConfig = filters[filterKey];

        Object.keys(filterConfig.filter).forEach(filterPath => {
          let didFindMatchingAttribute = false;
          const validValues = Object.values(filterConfig.filter[filterPath]);
          const tokenValue = objectPath.get(token, filterPath);

          if (tokenValue && validValues.includes(tokenValue.toString())) {
            didFindMatchingAttribute = true;
          }
          // If we didn't find a matching attribute, then we don't want to show this token
          didFindMatchingFilter = didFindMatchingFilter && didFindMatchingAttribute;
        });

        // If the token matches any of the filters, then we want to show it
        didFindOverallMatch = didFindOverallMatch || didFindMatchingFilter;
      });

      return didFindOverallMatch;
    });

    setVisibleTokens(newVisibleTokens);
  }, [allTokens, filters]);


  function GridCell(props) {
    const { columnIndex, rowIndex, style, data } = props;
    const { columnCount } = data;

    const index = rowIndex * columnCount + columnIndex;
    const token = visibleTokens[index];

    if (!token) {
      return null;
    }

    return (
      <div key={token.id} style={style}>
        <Card token={token} contractAddress={MB_CONTRACT_ADDRESS} />
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Midnight Breeze by Dutchtide Studios</title>
        <meta name="description" content="Midnight Breeze by Dutchtide Studios" />
        <meta property="twitter:title" content="Midnight Breeze by Dutchtide Studios" />
        <meta property="twitter:description" content="Midnight Breeze" />
        <meta property="og:description" content="Midnight Breeze" />
        <meta property="og:title" content="Midnight Breeze" />
        <meta property="og:url" content="https://www.midnightbreeze.io/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:image" content="https://www.midnightbreeze.store/thumbnail.png" />
        <meta property="twitter:image" content="https://www.midnightbreeze.store/thumbnail.png" />
      </Head>


      <HomePageWrapper >
        <div className="overflow-hidden shadow sm:rounded-md justify-center flex w-full">
          <div className="Sidebar w-full max-w-xs sm:p-6 max-h-screen overflow-auto">
            <div>
              <div>
                <div>
                  <Web3Button />
                </div>
                {/*  */}
                {isMounted && isConnected && (
                  <div className="mt-4">
                    <div className="text-lg leading-6 font-medium text-gray-900 flex w-full items-center justify-between text-left border border-slate-200 rounded-md p-3">
                      <span className="font-medium text-slate-200 ">Owned NFTs</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4 border-gray-300 rounded"
                        checked={filters[OWNED_NFTS_FILTER_KEY]}
                        onChange={
                          (e) => {
                            const newFilters = { ...filters };

                            if (e.target.checked) {
                              // Update the filters to include owned NFTs
                              newFilters[OWNED_NFTS_FILTER_KEY] = {
                                filter: {
                                  id: ownedNFTs.map((token) => token.tokenId)
                                }
                              };
                            } else {
                              delete newFilters[OWNED_NFTS_FILTER_KEY];
                            }

                            setFilters(newFilters);
                          }
                        } />
                    </div>
                  </div>
                )
                }

              </div>
              <div className="mt-4">
                <Disclosure defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="text-lg leading-6 font-medium text-gray-900 flex w-full items-start justify-between text-left">
                        <span className="font-medium text-slate-200 ">Community Filters</span>
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 overflow-auto">
                        <div className="border border-slate-200 rounded-md">
                          {
                            communityFilters.map((filterData, idx) => {
                              return (
                                <div key={idx} className="pl-2 pr-4 py-2 flex items-center justify-between text-sm text-slate-200">
                                  <div className="w-0 flex-1 flex items-center">
                                    <span className="ml-2 flex-1 w-0">
                                      {
                                        Object.keys(filterData.filter).map((filterPath, idx) => {
                                          const validValues = Object.values(filterData.filter[filterPath]);
                                          filterPath = filterPath.replace("attributes.", "");
                                          return (
                                            <div key={filterPath}>
                                              <span className="text-slate-200">{filterPath}</span>
                                              <span className="font-thin text-slate-200">: </span>
                                              <span className="font-thin text-slate-200">{validValues.join("/")}</span>
                                            </div>
                                          )
                                        })
                                      }
                                    </span>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 border-gray-300 rounded"
                                      checked={filters[filterData.name]}
                                      onChange={
                                        (e) => {
                                          const newFilters = { ...filters };

                                          if (e.target.checked) {
                                            // Add the new filter to the list
                                            newFilters[filterData.name] = filterData;
                                          } else {
                                            delete newFilters[filterData.name];
                                          }

                                          setFilters(newFilters);
                                        }
                                      }
                                    />
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            </div>
          </div>
          <div className="Gallery w-full h-full">
            <AutoSizer>
              {({ height, width }) => {
                // TODO - Move away from AutoSizer and set up a grid based on css breakpoints
                const columnWidth = 420;
                const columnCount = Math.max(1, Math.floor(width / columnWidth))
                const rowHeight = 200;

                return (
                  <Grid
                    className="List"
                    rowHeight={rowHeight}
                    height={height}
                    columnWidth={columnWidth}
                    width={width}
                    rowCount={Math.ceil(visibleTokens.length / columnCount)}
                    columnCount={columnCount}
                    itemData={{
                      columnCount
                    }}
                  >
                    {GridCell}
                  </Grid>
                )
              }}
            </AutoSizer>
          </div>
        </div>
      </HomePageWrapper>
    </div>
  )
}

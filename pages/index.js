import Head from 'next/head'
import { useState,useEffect,useRef } from 'react'
import { useRouter } from "next/router"


import {
  HomePageWrapper
} from "../styles/HomeStyles";

export default function Home() {
  

  return (
    
    <div>
      <Head>
        <title>Midnight Breeze by Dutchtide Studios</title>
        <meta name="description" content="Midnight Breeze by Dutchtide Studios" />
        <meta property="twitter:title" content="Midnight Breeze by Dutchtide Studios"/>
        <meta property="twitter:description" content="Midnight Breeze"/>
        <meta property="og:description" content="Midnight Breeze"/>
        <meta property="og:title" content="Midnight Breeze"/>
        <meta property="og:url" content="https://www.midnightbreeze.io/"/>
        <meta property="og:type" content="website"/>
        <link rel="icon" href="/favicon.png" />
        <meta property="og:image" content="https://www.midnightbreeze.store/thumbnail.png"/>
        <meta property="twitter:image" content="https://www.midnightbreeze.store/thumbnail.png"/>
      </Head>


      <HomePageWrapper >

    

      <div className="header-home-intro">

    

                           
 

      
        <h1>Hello World</h1>
                   

              

       </div>

    </HomePageWrapper>

    </div>
  )
}

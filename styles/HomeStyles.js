import styled from "styled-components";
//Animation
const { motion } = require("framer-motion");

export const HomePageWrapper = styled(motion.div)`
    width: 100vw !important;
    height: 100vh !important;
    margin: 0;
    padding: 0;
    position:relative;
    overflow: hidden;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;

    h1 {
      color:white;
      font-family: "Tropikal-Bold";
      text-decoration:none;
      font-size:35px;
  
    }

    a {
      color:white;
      font-family: "Tropikal-Bold";
      text-decoration:none;
      font-size:25px;
    }

  

  
`;
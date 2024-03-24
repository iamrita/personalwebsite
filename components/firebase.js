import { getApps, initializeApp } from "firebase/app" // this is the new format for importing app from firebase as of version 9
// online documentation might show something different, it's because it probably has not been updated 
// I used this website: https://www.youtube.com/watch?v=GkdHUX2Xxvk&ab_channel=DailyWebCoding for reference 

import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyCyTS7Hr82eDHerxCLvKkdCLXCIjqFHiyI",
  authDomain: "amrita-website.firebaseapp.com",
  projectId: "amrita-website",
  storageBucket: "amrita-website.appspot.com",
  messagingSenderId: "773951288107",
  appId: "1:773951288107:web:3d941984460313f2b18b6e",
  measurementId: "G-BYHPYNZ92J"
};

// Initialize Firebase
if (!getApps.length) {
  initializeApp(firebaseConfig)
  if (typeof window !== "undefined") { // with next.js, there's a weird issue where unless this is checked, you'll get an error 
    // check out this medium article for more details: https://wideawakeben.medium.com/adding-firebase-analytics-and-firestore-to-a-react-next-js-app-bffffc2f638e
    if ("measurementId" in firebaseConfig) {
      getAnalytics()
    }
  }
}


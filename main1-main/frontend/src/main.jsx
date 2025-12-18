import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// 1. Import initializeApp from the firebase/app package
import { initializeApp } from "firebase/app"
import App from './App.jsx'
import './index.css'

// 2. Paste your Web Configuration object here from the Firebase Console
// You can find this in Project Settings -> General -> Your Apps
const firebaseConfig = {
  apiKey: "AIzaSyDscu4FrsAXQsRa7EBTK5mgaDjRR2QYcxk",
  authDomain: "shikshaplus-3e0b8.firebaseapp.com",
  projectId: "shikshaplus-3e0b8",
  storageBucket: "shikshaplus-3e0b8.firebasestorage.app",
  messagingSenderId: "838353593652",
  appId: "1:838353593652:web:cadbbdc91af07c4155b161"
};

// 3. Initialize the Firebase service
initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
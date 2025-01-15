// old
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyD6dC_tdonSgsGcjPOohyEsBB2pxLOCuuI",
  authDomain: "likecounter-c8b3f.firebaseapp.com",
  databaseURL: "https://likecounter-c8b3f-default-rtdb.firebaseio.com",
  projectId: "likecounter-c8b3f",
  storageBucket: "likecounter-c8b3f.firebasestorage.app",
  messagingSenderId: "14243289582",
  appId: "1:14243289582:web:d3b69a7839b557b46c16ff"
}

export const useFirebase = () => {
  const app = initializeApp(firebaseConfig)
  const db = getDatabase(app)

  return {
    db
  }
}
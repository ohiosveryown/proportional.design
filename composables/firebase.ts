import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

export const useFirebase = () => {
  const config = useRuntimeConfig()

  // Initialize Firebase
  const firebaseApp = initializeApp(config.public.firebaseConfig)

  // Initialize Realtime Database and get a reference to the service
  const database = getDatabase(firebaseApp)

  return {
    firebaseApp,
    database
  }
}
import { ref as vueRef } from 'vue'
import { ref as dbRef, get, set } from 'firebase/database'
import { useFirebase } from './firebase'

export const useLikes = () => {
  const { database } = useFirebase()
  const count = vueRef(0)
  const loading = vueRef(false)

  const getLikes = async (path: string) => {
    loading.value = true
    try {
      const likesRef = dbRef(database, `likes${path}`)
      const snapshot = await get(likesRef)
      count.value = snapshot.val() || 0
    } catch (error) {
      console.error('Error getting likes:', error)
    } finally {
      loading.value = false
    }
  }

  const incrementLike = async (path: string) => {
    loading.value = true
    try {
      const likesRef = dbRef(database, `likes${path}`)
      const newCount = count.value + 1
      await set(likesRef, newCount)
      count.value = newCount
    } catch (error) {
      console.error('Error incrementing like:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    count,
    loading,
    getLikes,
    incrementLike
  }
}
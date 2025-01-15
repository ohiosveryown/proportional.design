import { ref as vueRef } from 'vue'
import { ref as dbRef, onValue, increment, set } from 'firebase/database'
import { useFirebase } from './firebase'

export const useLikes = () => {
  const { db } = useFirebase()
  const count = vueRef(0)
  const loading = vueRef(false)

  const getLikes = (id: string) => {
    const likesRef = dbRef(db, `likes/${id}`)
    onValue(likesRef, (snapshot) => {
      count.value = snapshot.val() || 0
    })
  }

  const incrementLike = async (id: string) => {
    loading.value = true
    try {
      const likesRef = dbRef(db, `likes/${id}`)
      await set(likesRef, increment(1))
    } catch (error) {
      console.error('Error incrementing likes:', error)
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
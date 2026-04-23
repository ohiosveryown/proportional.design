import { ref } from 'vue'

export const useSearchDialog = () => {
  const isSearchOpen = ref(false)

  const setSearchOpen = (value: boolean) => {
    isSearchOpen.value = value
  }

  return {
    isSearchOpen,
    setSearchOpen
  }
}
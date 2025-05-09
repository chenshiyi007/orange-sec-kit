export const useLocalStorage = () => {
  const setItem = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Error setting localStorage item:', error)
    }
  }

  const getItem = (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error getting localStorage item:', error)
      return null
    }
  }

  const removeItem = (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing localStorage item:', error)
    }
  }

  return {
    setItem,
    getItem,
    removeItem,
  }
}

import { store } from 'src/store'

// Initialize state holders
let prescriptionsCount = 0
let ordersCount = 0
let subscribers = []

// Subscribe to store changes
store.subscribe(() => {
  const state = store.getState()

  // Update local state
  prescriptionsCount = state.user.unViewedCount
  ordersCount = state.user.unViewedOrdersCount

  // Notify subscribers
  subscribers.forEach(callback => callback({
    prescriptionsCount, ordersCount
  }))
})

// Subscription management
export const subscribeToStore = (callback) => {
  subscribers.push(callback)

  return () => {
    subscribers = subscribers.filter(cb => cb !== callback)
  }
}

// Getter functions
export const getStoreValues = () => ({
  prescriptionsCount,
  ordersCount
})

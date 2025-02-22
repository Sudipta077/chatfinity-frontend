import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../lib/features/users/userSlice.js'
const makeStore = () => {
  return configureStore({
    reducer: {

        user:userReducer

    },
  })
}
export default makeStore;
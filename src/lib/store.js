import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../lib/features/users/userSlice.js'
import chatReducer from '../lib/features/chats/chatSlice.js'
const makeStore = () => {
  return configureStore({
    reducer: {

        user:userReducer,
        chat:chatReducer
    },
  })
}
export default makeStore;
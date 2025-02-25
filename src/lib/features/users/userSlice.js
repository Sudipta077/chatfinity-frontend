import { createSlice } from '@reduxjs/toolkit'
import { act } from 'react'
import { boolean } from 'yup'

const initialState = {
  name:"",
  email:"",
  picture:"",
  id:"",
  members:[],
  isGroupChat:false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
   
    setUser: (state, action) => {
      state.name = action.payload.name
      state.email = action.payload.email
      state.id = action.payload.id
      state.picture = action.payload.picture
      state.members = action.payload.members
      state.isGroupChat = action.payload.isGroupChat
    },
  },
})

// Action creators are generated for each case reducer function
export const {setUser } = userSlice.actions

export default userSlice.reducer
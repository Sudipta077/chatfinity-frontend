import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name:"",
  email:"",
  picture:"",
  id:""
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

    },
  },
})

// Action creators are generated for each case reducer function
export const {setUser } = userSlice.actions

export default userSlice.reducer
'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import  makeStore from '../lib/store'
import { setUser } from '@/lib/features/users/userSlice'
export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // storeRef.current.dispatch(setUser({
    //     name:"SUdipta",
    //     email:"pa2email.com",
    //     id:"s67d64d54ef",
    //     picture:"https://lh3.googleusercontent.com/a/ACg8ocLutywCmxKKMISSqf6W6_MJ7ldKF3DKdp2AWItaeIvzii837r2_kA=s96-c"
    // }))
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
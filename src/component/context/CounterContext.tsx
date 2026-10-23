import React, {useState } from 'react'
import { CounterContext } from './CounterContext'


  
export default function CounterContextProvider({ children }: { children: React.ReactNode }) {
  const [counter, setcounter] = useState(0)
  return (
    <>
      <CounterContext.Provider value={{ counter, setcounter }}>
        {children}
      </CounterContext.Provider>
    </>
  )
}

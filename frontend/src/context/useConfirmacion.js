import { createContext, useContext } from 'react'

export const ConfirmacionContext = createContext(null)
export const useConfirmacion = () => useContext(ConfirmacionContext)

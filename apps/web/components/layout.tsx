import { ChakraBaseProvider, ChakraProvider, extendBaseTheme, extendTheme } from '@chakra-ui/react'
// `@chakra-ui/theme` is a part of the base install with `@chakra-ui/react`
import chakraTheme from '@chakra-ui/theme'
import { ReactNode } from 'react'

const { Button } = chakraTheme.components

const theme = extendTheme({
 
})

interface Props {
  children?: ReactNode
}

export default function Layout ({children}: Props) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
}
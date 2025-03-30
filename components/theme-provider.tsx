'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'



export function ThemeProvider({ children, ...props }: ThemeProviderProps) {


  const [mounted, setMounted] = React.useState(false)
React.useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) {
  return <>{children}</> // Avoid rendering until mounted
}

  return (<NextThemesProvider attribute="class" defaultTheme="dark" enableSystem {...props}>{children}</NextThemesProvider>)
}

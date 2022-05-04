import React, { useState, useCallback, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider, } from '@mui/material/styles';

import './fonts.css'

const theme1 = createTheme({
  palette: {
    background: {
      surface: {
        main: 'hsl(224deg 26% 31%)',
        light: 'hsl(223, 31%, 20%)',
        dark: 'hsl(224deg 35% 15%)',
      },
      keys: {
        main: 'hsl(30, 25%, 89%)',
        mainShadow: 'hsl(28, 16%, 65%)',
        secondary: 'hsl(225, 21%, 49%)',
        secondaryShasow: 'hsl(224, 28%, 35%)',
        tertiary: 'hsl(6, 63%, 50%)',
        tertiaryShasow: 'hsl(6, 70%, 34%)',
      }
    },
    text: {
      primary: 'hsl(221, 14%, 31%)',
      secondary: 'hsl(0, 0%, 100%)',
      info: 'hsl(0, 0%, 100%)',
      equalSign: 'hsl(0, 0%, 100%)',
    }
  },
  typography: {
    fontFamily: 'League Spartan, sans-serif',
  }
})
const theme2 = createTheme({
  palette: {
    background: {
      surface: {
        main: 'hsl(0, 0%, 90%)',
        light: 'hsl(0, 5%, 81%)',
        dark: 'hsl(0, 0%, 93%)',
      },
      keys: {
        main: 'hsl(45, 7%, 89%)',
        mainShadow: 'hsl(35, 11%, 61%)',
        secondary: 'hsl(185, 42%, 37%)',
        secondaryShasow: 'hsl(185, 58%, 25%)',
        tertiary: 'hsl(25, 98%, 40%)',
        tertiaryShasow: 'hsl(25, 99%, 27%)',
      }
    },
    text: {
      primary: 'hsl(60, 10%, 19%)',
      secondary: 'hsl(0, 0%, 100%)',
      equalSign: 'hsl(0, 0%, 100%)',
      info: 'hsl(60, 10%, 19%)',
    }
  },
  typography: {
    fontFamily: 'League Spartan, sans-serif',
  }
})
const theme3 = createTheme({
  palette: {
    background: {
      surface: {
        main: 'hsl(268, 75%, 9%)',
        light: 'hsl(268, 71%, 12%)',
        dark: 'hsl(268, 71%, 12%)',
      },
      keys: {
        main: 'hsl(268, 47%, 21%)',
        mainShadow: 'hsl(290, 70%, 36%)',
        secondary: 'hsl(281, 89%, 26%)',
        secondaryShasow: 'hsl(285, 91%, 52%)',
        tertiary: 'hsl(176, 100%, 44%)',
        tertiaryShasow: 'hsl(177, 92%, 70%)',
      }
    },
    text: {
      primary: 'hsl(52, 100%, 62%)',
      secondary: 'hsl(0, 0%, 100%)',
      info: 'hsl(52, 100%, 62%)',
      equalSign: 'hsl(198, 20%, 13%)',
    }
  },
  typography: {
    fontFamily: 'League Spartan, sans-serif',
  }
})

const themes = [theme1, theme2, theme3]

const ThemedApp = () => {
  const [themeNumber, setThemeNumber] = useState(parseInt(localStorage.getItem('themeNumber')) || 1)

  useEffect(() => { // save theme to local storage
    localStorage.setItem('themeNumber', themeNumber)
  }, [themeNumber])

  return (
    <ThemeProvider theme={themes[themeNumber - 1]}>
      <App themeNumber={themeNumber} switchTheme={setThemeNumber} />
      <CssBaseline />
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemedApp />
  </React.StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    offer: { main: '#00897b', light: '#e0f2f1', contrastText: '#fff' },
    want: { main: '#d81b60', light: '#fce4ec', contrastText: '#fff' },
    background: { default: '#f5f5f7' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Noto Sans CJK JP","Yu Gothic UI","Meiryo","PingFang SC","Microsoft YaHei",Roboto,sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)

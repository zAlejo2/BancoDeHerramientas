import { Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material"

const defaultTheme = createTheme({
    palette: {
      primary: {
        main: '#1565c0',
      },
      secondary: {
        main: '#e3f2fd',
      },
    },
  });

export const Layout = ({children}) => {
    return (
        <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          {children}
        </Box>
        </ThemeProvider>
    )
}


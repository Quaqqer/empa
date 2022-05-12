import type { AppProps } from "next/app";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import NavigationBar from "../components/NavigationBar";

const theme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: true },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      {/* Navigation bar */}
      <NavigationBar />

      {/* Content */}
      <Box maxWidth={850} mx="auto">
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}

export default MyApp;

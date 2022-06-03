import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";

import NavigationBar from "../components/NavigationBar";

export const theme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: true },
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      {/* Navigation bar */}
      <NavigationBar />

      {/* Content */}
      <Box maxWidth={850} p={2} mx="auto">
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}

export default MyApp;

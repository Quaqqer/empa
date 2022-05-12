import type { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import NavigationBar from "../components/NavigationBar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
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

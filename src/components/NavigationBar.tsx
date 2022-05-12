import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function NavigationBar(): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      width="100%"
      top={0}
      mb={1}
      p={2}
      position="sticky"
      backgroundColor={useColorModeValue("white", "gray.800")}
      borderBottom={1}
      borderStyle="solid"
      borderColor="gray.500"
      flex={1}
    >
      <Flex
        alignItems="center"
        maxWidth={1000}
        mx="auto"
        justifyContent="space-between"
      >
        <HStack>
          <Button>empa.xyz</Button>
        </HStack>
        <IconButton
          aria-label="Toggle between light and dark mode"
          onClick={toggleColorMode}
          icon={colorMode === "light" ? <SunIcon /> : <MoonIcon />}
        />
      </Flex>
    </Box>
  );
}

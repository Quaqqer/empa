import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import NLink from "next/link";

const leftLinks = [
  ["empa.xyz", "/"],
  ["about", "/about"],
];

const gameLinks = [
  ["snake", "/games/snake"],
  ["game of life", "/games/gameoflife"],
];

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
          {leftLinks.map((link) => (
            <NLink href={link[1]} key={link[0]}>
              <Button>{link[0]}</Button>
            </NLink>
          ))}

          <Popover trigger="hover">
            {/* @ts-ignore: Error with react 18 :-(, seems to work though */}
            <PopoverTrigger>
              <Button>games</Button>
            </PopoverTrigger>

            <PopoverContent border={0} boxShadow="xl" maxWidth="200px">
              <Stack>
                {gameLinks.map(([name, link], i) => (
                  <NLink href={link} passHref key={i}>
                    <Button>{name}</Button>
                  </NLink>
                ))}
              </Stack>
            </PopoverContent>
          </Popover>
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

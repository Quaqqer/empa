import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useColorMode,
  useColorModeValue,
  forwardRef,
  LinkProps,
} from "@chakra-ui/react";
import NLink from "next/link";
import { useMemo } from "react";

const leftLinks = [
  ["empa.xyz", "/"],
  ["About", "/about"],
];

const gameLinks = [
  ["Snake", "/games/snake"],
  ["Game of Life", "/games/gameoflife"],
  ["CineMraft", "/games/cinemraft"],
];

const NavLink = forwardRef((props: LinkProps & { href?: string }, ref) => {
  const normalColor = useColorModeValue("gray.800", "gray.200");
  const hoverColor = useColorModeValue("purple.500", "purple.200");

  const { href, ...linkProps } = props;

  const link = useMemo(
    () => (
      <Link
        p={2}
        fontWeight={600}
        color={normalColor}
        _hover={{ color: hoverColor }}
        {...linkProps}
        ref={ref}
      />
    ),
    [normalColor, hoverColor, ref, linkProps]
  );

  return href === undefined ? (
    link
  ) : (
    <NLink href={href} passHref>
      {link}
    </NLink>
  );
});

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
          {leftLinks.map(([name, path], i) => (
            <NavLink href={path} key={i}>
              {name}
            </NavLink>
          ))}

          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <NavLink>Games</NavLink>
            </PopoverTrigger>

            <PopoverContent border={0} boxShadow="xl" maxWidth="200px">
              <Stack>
                {gameLinks.map(([name, link], i) => (
                  <NavLink href={link} key={i}>
                    {name}
                  </NavLink>
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

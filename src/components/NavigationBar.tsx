import { Box, Flex, Text } from "@chakra-ui/react";

export default function NavigationBar(): JSX.Element {
  return (
    <Box
      width="100%"
      bg="white"
      position="sticky"
      top={0}
      mb={1}
      borderBottom={1}
      borderStyle="solid"
      borderColor="grey"
    >
      <Flex p={4}>
        <Text>Hej</Text>
      </Flex>
    </Box>
  );
}

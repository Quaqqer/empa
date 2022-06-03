import { Text } from "@chakra-ui/react";

type HeroProps = {
  children: string;
};

export default function Hero({ children }: HeroProps): JSX.Element {
  return (
    <Text fontSize="6xl" fontWeight="semibold" mx={5} mt={2}>
      {children}
    </Text>
  );
}

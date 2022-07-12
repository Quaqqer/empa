import { Text } from "@chakra-ui/react";

type HeroProps = {
  children: string;
  size: "large" | "medium" | "small";
};

export default function Hero({ children, size }: HeroProps): JSX.Element {
  const fontSizes = { large: "6xl", medium: "4xl", small: "2xl" };
  return (
    <Text fontSize={fontSizes[size]} fontWeight="semibold" mt={2}>
      {children}
    </Text>
  );
}

Hero.defaultProps = {
  size: "large",
};

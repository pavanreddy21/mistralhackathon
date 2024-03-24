import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";

function StepperFlow({
  title,
  description,
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
}) {
  return (
    <Card>
      <CardHeader>
        <Heading textAlign="justify" size="md">
          {title}
        </Heading>
      </CardHeader>
      <CardBody>
        <Text textAlign={"justify"}>{description}</Text>
      </CardBody>
      <CardFooter justify="space-between">
        <Button onClick={handlePrev} disabled={isFirstStep} colorScheme="blue">
          Prev
        </Button>

        <Button disabled={isLastStep} onClick={handleNext} colorScheme="blue">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default StepperFlow;

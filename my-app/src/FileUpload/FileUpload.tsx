import React from "react";
import {
  AspectRatio,
  Box,
  Container,
  forwardRef,
  Heading,
  Input,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";

const second = {
  rest: {
    rotate: "0deg",
    scale: 0.95,
    // x: "50%",
    // filter: "grayscale(80%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn",
    },
  },
  hover: {
    // x: "70%",
    scale: 1.1,
    // rotate: "20deg",
    // filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut",
    },
  },
};

const PreviewImage = forwardRef((props, ref) => {
  return (
    <Box
      bg="white"
      top="0"
      height="100%"
      width="100%"
      position="absolute"
      borderWidth="1px"
      borderStyle="solid"
      rounded="sm"
      borderColor="gray.400"
      as={motion.div}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      backgroundImage="/demo/toast3.jpeg"
      {...props}
      ref={ref}
    />
  );
});

const FileUpload = ({ handleFileUpload }) => {
  const [sliderValue, setSliderValue] = React.useState({
    width: 512,
    height: 512,
  });
  const [showTooltip, setShowTooltip] = React.useState(false);

  const controls = useAnimation();
  const toast = useToast();

  const startAnimation = () => controls.start("hover");
  const stopAnimation = () => controls.stop();

  const handleChange = (e) => {
    const pathName = e.target.value;
    const imageExtensionsRegex = /\.(script)$/i;
    if (imageExtensionsRegex.test(pathName)) {
      // It's an image file
      handleFileUpload(e);
    } else {
      // It's not an image file
      toast({
        title: "Please select an file.",
        description: " Acceptable formats are .script",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex">
        <Container
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <AspectRatio width="64" ratio={1}>
            <Box
              borderColor="gray.300"
              borderStyle="dashed"
              borderWidth="2px"
              rounded="md"
              shadow="sm"
              role="group"
              transition="all 150ms ease-in-out"
              _hover={{
                shadow: "md",
              }}
              as={motion.div}
              initial="rest"
              animate="rest"
              whileHover="hover"
            >
              <Box position="relative" height="100%" width="100%">
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  height="100%"
                  width="100%"
                  display="flex"
                  flexDirection="column"
                >
                  <Stack
                    height="100%"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justify="center"
                    spacing="4"
                  >
                    <Box height="16" width="12" position="relative">
                      <PreviewImage
                        variants={second}
                        backgroundImage="/demo/toast2.jpeg"
                      />
                    </Box>
                    <Stack p="8" textAlign="center" spacing="1">
                      <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                        Drop File here
                      </Heading>
                      <Text fontWeight="light">or click to upload</Text>
                    </Stack>
                  </Stack>
                </Box>
                <Input
                  type="file"
                  height="100%"
                  width="100%"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  aria-hidden="true"
                  accept="*.script"
                  onDragEnter={startAnimation}
                  onDragLeave={stopAnimation}
                  onChange={handleChange}
                />
              </Box>
            </Box>
          </AspectRatio>
        </Container>
      </div>
    </div>
  );
};

export default FileUpload;

import { useState } from "react";
import { Box, Divider, Flex, Progress, useTheme } from "@chakra-ui/react";
import StepperFlow from "../DescriptionFlow/DescriptionFlow";
import FileUpload from "../FileUpload/FileUpload";
import ChatUI from "../ChatUI/ChatUI";
import MOCK_RESPONSE from "./mockResponseFromBE";
import CustomFlameGraph from "../Flamegraph/FlameGraph";

function Dashboard() {
  const [responseFromBE, setResponseFromBE] = useState(null);
  const theme = useTheme();

  const [isFileUploading, setFileUploading] = useState(false);

  const [url, setUrl] = useState(null);

  const handleFileUpload = async (eventUpload) => {
    const reader = new FileReader();
    const API_URL = "http://localhost:5000/api";
    reader.onload = async (eventLoad) => {
      const response = await fetch("API_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [eventLoad.target.result],
        }),
      });

      const data = await response.json();
      setResponseFromBE(data);
      setFileUploading(false);
    };
    setUrl(eventUpload.target.files[0]);
    reader.readAsDataURL(eventUpload.target.files[0]);
    setFileUploading(true);

    //comment this once API is Integrated
    setTimeout(() => {
      setFileUploading(false);
      setResponseFromBE(MOCK_RESPONSE[0]);
    }, 2000);
  };

  const handleNext = () => {
    const reader = new FileReader();
    reader.onload = async (eventLoad) => {
      const response = await fetch("API_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [eventLoad.target.result],
        }),
      });

      const data = await response.json();
      setResponseFromBE(data);
    };
    reader.readAsDataURL(url);
    setFileUploading(true);

    //comment this once API is Integrated
    setTimeout(() => {
      setFileUploading(false);
      setResponseFromBE(
        MOCK_RESPONSE[(responseFromBE?.currentIndex + 1) % MOCK_RESPONSE.length]
      );
    }, 2000);
  };

  const handlePrev = () => {
    const reader = new FileReader();
    reader.onload = async (eventLoad) => {
      const response = await fetch("API_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [eventLoad.target.result],
        }),
      });

      const data = await response.json();
      setResponseFromBE(data);
    };
    reader.readAsDataURL(url);
    setFileUploading(true);

    //comment this once API is Integrated
    setTimeout(() => {
      setFileUploading(false);
      setResponseFromBE(
        MOCK_RESPONSE[
          responseFromBE?.currentIndex - 1 < 0
            ? MOCK_RESPONSE.length - 1
            : (responseFromBE?.currentIndex - 1) % MOCK_RESPONSE.length
        ]
      );
    }, 2000);
  };

  if (isFileUploading) {
    return <Progress size="xs" isIndeterminate />;
  }
  return (
    <Box p={5} bg={theme.colors.gray[50]} borderRadius="md" boxShadow="md">
      {!responseFromBE ? (
        <Box p={4} bg={theme.colors.white} borderRadius="md" boxShadow="sm">
          <FileUpload handleFileUpload={handleFileUpload} />
        </Box>
      ) : (
        <Flex direction="row" height="100%">
          <Box
            w="50%"
            h="100%"
            p={4}
            bg={theme.colors.white}
            borderRadius="md"
            boxShadow="sm"
          >
            <Flex direction="column" height="100%">
              <Box w={"100%"}>
                <StepperFlow
                  title={responseFromBE?.title}
                  description={responseFromBE?.description}
                  isFirstStep={responseFromBE?.isFirstStep}
                  isLastStep={responseFromBE?.isLastStep}
                  handleNext={handleNext}
                  handlePrev={handlePrev}
                />
              </Box>
              <Divider orientation="horizontal" h={5} />
              <Box flex="1" w={"100%"}>
                <CustomFlameGraph graphData={responseFromBE?.graphJson} />
              </Box>
            </Flex>
          </Box>
          <Divider orientation="vertical" w={10} />

          <Box
            w="50%"
            h="100%"
            p={4}
            bg={theme.colors.white}
            borderRadius="md"
            boxShadow="sm"
          >
            <ChatUI />
          </Box>
        </Flex>
      )}
    </Box>
  );
}

export default Dashboard;

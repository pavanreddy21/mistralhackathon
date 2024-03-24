import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Progress,
  useTheme,
} from "@chakra-ui/react";
import FileUpload from "../FileUpload/FileUpload";
import CustomFlameGraph from "../Flamegraph/FlameGraph";
import Markdown from "react-markdown";
import ChatUI from "../ChatUI/ChatUI";

function Dashboard() {
  const [responseFromBE, setResponseFromBE] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFileUploading, setFileUploading] = useState(false);
  const theme = useTheme();

  const handleFileUpload = async (eventUpload) => {
    if (eventUpload.target.files.length === 0) {
      return; // No file selected
    }

    const file = eventUpload.target.files[0];
    const API_URL = "http://localhost:5000/analyze";
    const formData = new FormData();
    formData.append("perf_script", file);

    setFileUploading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData, // Send formData directly without JSON.stringify
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setResponseFromBE(data.analysis); // Adjusted to set the analysis part of the response
      setCurrentCardIndex(0); // Reset to the first explanation card
    } catch (error) {
      console.error("Error during file upload:", error);
      // Handle the error state appropriately. For example, you might want to:
      // - Show an error message to the user
      // - Reset any relevant state
    } finally {
      setFileUploading(false);
    }
  };

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return responseFromBE.explanation_cards &&
        nextIndex < responseFromBE.explanation_cards.length
        ? nextIndex
        : prevIndex;
    });
  };

  const handlePrev = () => {
    setCurrentCardIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      return nextIndex >= 0 ? nextIndex : prevIndex;
    });
  };

  if (isFileUploading) {
    return <Progress size="xs" isIndeterminate />;
  }

  console.log(responseFromBE);

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
            <Flex direction="column" height="100%" textAlign="justify">
              {responseFromBE.explanation_cards &&
                responseFromBE.explanation_cards.length > 0 && (
                  <Box
                    p={4}
                    bg={theme.colors.white}
                    borderRadius="md"
                    boxShadow="sm"
                    mb={4}
                    width="50"
                  >
                    <Heading noOfLines={1}>
                      {responseFromBE.explanation_cards[currentCardIndex].title}
                    </Heading>
                    <Box p="4" fontSize='medium' >
                      <Markdown
                        components={{
                          // Customize the root element to set the overall theme background and text color
                          // root: {
                          //   style: {
                          //     backgroundColor: "#1e1e1e", // Dark background
                          //     color: "#dcdcdc", // Light text
                          //     fontFamily:
                          //       "'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace",
                          //     padding: "20px",
                          //     borderRadius: "4px",
                          //     lineHeight: "1.6",
                          //   },
                          // },
                          // Customize headers, adjust sizes as needed
                          h1: ({ node, ...props }) => (
                            <h1 style={{ color: "#569cd6" }} {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 style={{ color: "#4ec9b0" }} {...props} />
                          ),
                          // Customize paragraphs
                          p: ({ node, ...props }) => (
                            <p style={{ margin: "10px 0" }} {...props} />
                          ),
                          // Customize links
                          a: ({ node, ...props }) => (
                            <a style={{ color: "#9cdcfe" }} {...props} />
                          ),
                          // Customize code blocks
                          code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return match ? (
                              <pre
                                style={{
                                  background: "#1e1e1e",
                                  padding: "10px",
                                  borderRadius: "5px",
                                }}
                              >
                                <code
                                  style={{
                                    fontFamily:
                                      "'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace",
                                    color: "#ce9178",
                                  }}
                                  {...props}
                                >
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code
                                style={{
                                  fontFamily:
                                    "'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace",
                                  backgroundColor: "#2E3440",
                                  color: "#D8DEE9",
                                  padding: "0 2px",
                                  margin: "4px",
                                  borderRadius: "4px",
                                }}
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          // Add other customizations for different elements as needed
                        }}
                      >
                        {
                          responseFromBE.explanation_cards[currentCardIndex]
                            .content
                        }
                      </Markdown>
                    </Box>
                    <Flex mt={4} justify="space-between">
                      <Button
                        onClick={handlePrev}
                        isDisabled={currentCardIndex === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={handleNext}
                        isDisabled={
                          currentCardIndex ===
                          (responseFromBE.explanation_cards?.length ?? 0) - 1
                        }
                      >
                        Next
                      </Button>
                    </Flex>
                  </Box>
                )}
              <Divider orientation="horizontal" my={2} />
              <Box
                p={4}
                bg={theme.colors.white}
                borderRadius="md"
                boxShadow="sm"
                width="50"
              >
                {responseFromBE.flame_graph && (
                  <CustomFlameGraph
                    graphData={JSON.parse(responseFromBE.flame_graph)}
                  />
                )}
              </Box>
            </Flex>
          </Box>
          <Divider orientation="vertical" mx={2} />
          <Box
            w="50%"
            h="100%"
            p={4}
            bg={theme.colors.white}
            borderRadius="md"
            boxShadow="sm"
          >
            <ChatUI
              initialMessage={
                responseFromBE?.summary
              }
            />
          </Box>
        </Flex>
      )}
    </Box>
  );
}

export default Dashboard;

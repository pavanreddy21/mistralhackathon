import { Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import ThreeDotsLoader from "./DotsLoader";
import { colors } from "../theme";
import { AnimatePresence } from "framer-motion";
import Chat from "./Chat";
import InputField from "./InputField";
import MistralClient from "@mistralai/mistralai";

type Chat = {
  user: "me" | "agent";
  message: string;
  originalIndex: number;
};

const apiKey = "TWfVrlX659GSTS9hcsgUcPZ8uNzfoQsg"; // Ensure you have MISTRAL_API_KEY in your .env file
const client = new MistralClient(apiKey);

const PROMPT_TO_APPEND = ``;

const ChatUI = ({ initialMessage }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [initialMessageSent, setInitialMessageSent] = useState(false);
  const sentMessageRef = useRef(false);

  const handleSubmit = async (e?: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault();

    try {
      setIsSubmitting(true);
      setValue("");
      setChats((prev) => [
        { user: "me", message: value, originalIndex: prev.length },
        ...prev,
      ]);
      // Prepare the conversation history for the Mistral chat API
      const conversationHistory = chats
        .map((chat) => ({
          role: chat.user === "me" ? "user" : "assistant", // Adjust if needed based on your API's expected roles
          content: chat.message,
        }))
        .reverse(); // Reverse to maintain the order of messages as they were sent

      // Include the new message by the user at the end of the conversation history
      conversationHistory.push({ role: "user", content: value });

      const chatResponse = await client.chat({
        model: "mistral-large-latest",
        messages: conversationHistory,
      });
      if (chatResponse && chatResponse.choices.length > 0) {
        // Update the chat with the response from the Mistral chat API
        setChats((prev) => [
          {
            user: "agent",
            message: chatResponse.choices[0].message.content,
            originalIndex: prev.length,
          },
          ...prev,
        ]);
      }
      setValue(""); // Clear the input after sending
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log("rendering twise");
    // if (initialMessageSent) return;
    // setInitialMessageSent(true);
    if (sentMessageRef.current) return;
    sentMessageRef.current = true;
    const messageToSend = PROMPT_TO_APPEND + initialMessage;
    setChats((prev) => [
      { user: "me", message: messageToSend, originalIndex: prev.length },
      ...prev,
    ]);
    setValue(messageToSend);
    handleSubmit(null);
  }, [initialMessage]);

  console.log("chats", chats);
  return (
    <Flex bg="main-bg" h="90vh" color="main-color">
      <Flex
        maxW="1000px"
        flexDir="column"
        justify="space-between"
        bg={colors["button-color"]}
        maxH="90vh"
        rounded="xl"
        w="full"
        mx="auto"
        pb="1rem"
        pt="2rem"
        px="1rem"
      >
        <Flex
          flexDir="column-reverse"
          justify="flex-start"
          align="flex-start"
          maxW="800px"
          h="full"
          w="full"
          mx="auto"
          gap="2rem"
          overflowY="auto"
          px={[0, 0, "1rem"]}
          py="2rem"
        >
          {isSubmitting && (
            <Flex alignSelf="flex-start" justify="center" px="2rem" py="0.5rem">
              <ThreeDotsLoader />
            </Flex>
          )}
          <AnimatePresence>
            {chats.map((chat, index) => {
              if (chat.originalIndex === 0 && chat.user === "me") {
                return null;
              }
              return (
                <Chat
                  key={chat.originalIndex}
                  message={chat.message}
                  user={chat.user}
                />
              );
            })}
          </AnimatePresence>
        </Flex>
        <InputField
          inputProps={{
            onChange: (e) => setValue(e.target.value),
            autoFocus: true,
            value,
          }}
          onSubmit={handleSubmit!}
        />
      </Flex>
    </Flex>
  );
};

export default ChatUI;

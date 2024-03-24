import { Avatar, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

const Chat = ({ message, user }: { message: string; user: "me" | "agent" }) => {
  const chatStringIndex = useRef(0);
  const [chatMessage, setChatMessage] = useState("");

  function appendChar() {
    setChatMessage((prev) => prev + message[chatStringIndex.current]);
    chatStringIndex.current++;
  }

  useEffect(() => {
    if (chatStringIndex.current < message.length - 1) {
      const appendCharInterval = setInterval(appendChar, 50);
      return () => clearInterval(appendCharInterval);
    }
  }, [chatMessage, chatStringIndex.current]);

  return (
    <motion.div
      style={{
        alignSelf: user === "agent" ? "flex-start" : "flex-end",
        width: "auto",
        maxWidth: "90%",
      }}
      initial={{
        opacity: 0,
        translateY: "100%",
      }}
      animate={{ opacity: 1, translateY: 0, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, translateY: 0 }}
    >
      <Flex
        gap="5px"
        w="full"
        flexDir={user === "agent" ? "row" : "row-reverse"}
      >
        <Avatar
          name={user === "me" ? "Me" : "agent"}
          size="sm"
          bg="border-color"
          mt="-6px"
        />
        <Flex
          borderWidth={1}
          borderColor="blue.400"
          bg="main-bg"
          p="0.5rem 1rem"
          w="auto"
          rounded={user === "agent" ? "0 20px 20px 20px" : "20px 0 20px 20px"}
          fontSize="18px"
          flexDir="column"
        >
          {user === "agent" && (
            <Flex
              alignSelf="flex-end"
              fontStyle="italic"
              opacity={0.4}
              fontSize="10px"
              as="small"
              fontWeight={500}
            >
              Agent
            </Flex>
          )}
          {user === "me" && (
            <Flex
              alignSelf="flex-start"
              fontStyle="italic"
              opacity={0.4}
              fontSize="10px"
              as="small"
              fontWeight={500}
            >
              Me
            </Flex>
          )}
          <ReactMarkdown rehypePlugins={[]}>
            {user === "agent" ? chatMessage || "" : message || ""}
          </ReactMarkdown>
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default Chat;

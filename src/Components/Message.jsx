import React from "react";
import { HStack, Avatar, Text } from "@chakra-ui/react";

const Message = ({ text, uri, user = "other" }) => {
  return (
    <HStack
      alignSelf={user === "me" ? "flex-end" : "flex-start"}
      borderRadius={"8px"}
      bg="gray.100"
      paddingY={"2"}
      paddingX={user === "me" ? "4" : "2"}
    >
      {user === "other" && (
        <Avatar src={uri} width={"10"} h={"10"} padding={"3px"} />
      )}
      <Text>{text}</Text>
      {user === "me" && (
        <Avatar src={uri} width={"10"} h={"10"} padding={"3px"} />
      )}
    </HStack>
  );
};

export default Message;

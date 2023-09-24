import { app } from "./firebase";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { FiLogOut } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

import {
  Text,
  Box,
  Button,
  Container,
  VStack,
  HStack,
  Input,
  Avatar,
  Menu,
  Icon,
  // MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import Message from "./Components/Message";
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { MenuButton } from "@chakra-ui/react";

const auth = getAuth(app);
const db = getFirestore(app);
const loginHandler = () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider);
};

function App() {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divForScroll = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
      console.log(data);
    });

    const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;

          return { id, ...item.data() };
        })
      );
    });

    return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
    // eslint-disable-next-line
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setMessage("");

      if (message === "") {
        alert("please enter a message");
        return;
      }
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      document.getElementById("message-input").focus();
    } catch (error) {
      alert(error);
    }
  };

  const logoutHandler = async () => {
    try {
      // Sign out the user
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const clearChatHandler = async () => {
    try {
      if (!user) {
        // Handle the case when the user is not logged in
        return;
      }

      if (user.email === "faizan26696@gmail.com") {
        // Query all messages (assuming there's a collection called "Messages")
        const allMessagesQuery = query(collection(db, "Messages"));

        const allMessagesSnapshot = await getDocs(allMessagesQuery);

        // Delete each message
        allMessagesSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } else {
        alert("Only Admin can access to delete the messages");
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  useEffect(() => {
    //  scroll to bottom every time messages change
    divForScroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box bg={"red.50"}>
      {user ? (
        <Container h={"100vh"} bg={"white"} background={"purple.100"}>
          <VStack
            h="full"
            paddingY={"4"}
            alignItems={"flex-end"}
            position={"sticky"}
          >
            <Menu>
              <MenuButton
                as={Button}
                minH="60px"
                rightIcon={<ChevronDownIcon />}
              >
                <HStack>
                  {" "}
                  <Avatar
                    border={"solid blue 1px"}
                    paddingBottom={"5px"}
                    padding={"2px"}
                    src={user.photoURL}
                    w={"12"}
                    h={"12"}
                  />
                  <h3>{user.displayName}</h3>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem minH="30px" gap={"2px"} onClick={logoutHandler}>
                  <Icon as={FiLogOut} color="purple.800" boxSizing={"6"} />
                  <Text as="b" color={"purple.400"}>
                    Logout
                  </Text>
                </MenuItem>
                <MenuItem minH="30px" gap={"2px"} onClick={clearChatHandler}>
                  <Icon color="purple.800" boxSizing={8} as={MdDeleteOutline} />
                  <Text as="b" color={"purple.400"}>
                    Clear Chat
                  </Text>
                </MenuItem>
              </MenuList>
            </Menu>

            <VStack
              h={"full"}
              width={"full"}
              overflowY={"auto"}
              css={{ "&::-webkit-scrollbar": { display: "none" } }}
            >
              {messages.map((item) => {
                return (
                  <>
                    <Message
                      key={item.id}
                      user={item.uid === user.uid ? "me" : "other"}
                      text={item.text}
                      uri={item.uri}
                    />
                    {/* <span>{messageTime}</span> */}
                  </>
                );
              })}
              <div ref={divForScroll}></div>
            </VStack>
            <form
              onSubmit={submitHandler}
              style={{ width: "100%" }}
              position={"fixed"}
            >
              <HStack paddingBottom={"0.8rem"}>
                <Input
                  variant="unstyled"
                  id="message-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a message"
                  type="text"
                  padding={"0.5rem"}
                  backgroundColor={"purple.300"}
                  color={"grey.500"}
                  outlineColor={"purple.300"}
                />
                <Button colorScheme={"purple"} type="submit" padding={"1.4rem"}>
                  send{" "}
                  <ArrowRightIcon
                    boxSizing={"6"}
                    h={"14px"}
                    paddingLeft={"8px"}
                  />
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack h="100vh" justifyContent={"center"}>
          <Button onClick={loginHandler} colorScheme={"purple"}>
            signUp with google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;

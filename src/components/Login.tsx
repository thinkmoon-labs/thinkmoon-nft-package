import React from "react";
import { Box, Flex, Select, Input, Button } from "@chakra-ui/react";

import { useMutation } from "react-query";
import UAuth from "@uauth/js";

type LoginWithUnStoppablePropsType = {
  setWalletAddr?: (addr: string) => void;
};
export const LoginWithUnStoppable = (props: LoginWithUnStoppablePropsType) => {
  const uauth = new UAuth({
    clientID: "b01d9b11-e0a9-466a-9ac5-14c6ac488a89",
    redirectUri: "http://localhost:3000",
  });
  const loginUn = async () => {
    try {
      const authorization = await uauth.loginWithPopup();

      console.log(authorization);
      if (props.setWalletAddr && authorization.idToken.wallet_address) {
        props.setWalletAddr(authorization.idToken.wallet_address);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Flex mb="4">
        <Button
          mr="1"
          onClick={() => {
            loginUn();
          }}
          w="120px"
          ml="20px"
        >
          Login
        </Button>
      </Flex>
    </Box>
  );
};

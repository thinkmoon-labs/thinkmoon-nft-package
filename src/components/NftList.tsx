import React from "react";
import {
  Box,
  Flex,
  Select,
  Input,
  Button,
  Text,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useMutation } from "react-query";
import { Spinner } from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { LoginWithUnStoppable } from "./Login";
import { fetchNftBasedOnUserAddress } from "../utils";
import { NftImageSection } from "./NftImageSection";

export const NFT = () => {
  const { mutate, data: nftData } = useMutation(fetchNftBasedOnUserAddress);
  const [fieldValue, selectField] = React.useState({
    chain: "polygon",
    address: "",
  });

  const handleFieldChange = (e: any) => {
    selectField({ ...fieldValue, [e.target.name]: e.target.value });
  };
  const handleWalletAddr = (addr: string) => {
    selectField({ ...fieldValue, address: addr });
    console.log(`fieldValue`, fieldValue);
    if (addr && fieldValue?.chain) {
      mutate({ ...fieldValue, address: addr });
    }
  };

  return (
    <Box>
      <Flex mb="4">
        <Input
          onChange={(e) => handleFieldChange(e)}
          mr="10px"
          name="address"
          value={fieldValue?.address}
          type="text"
          placeholder="Address"
        />
        <Select
          onChange={(e) => handleFieldChange(e)}
          name="chain"
          value={fieldValue?.chain}
          placeholder="Select Chain"
        >
          <option value="eth">Eth Mainnet</option>
          <option value="ropsten">Ropsten</option>
          <option value="rinkeby">Rinkeby</option>
          <option value="goreli">Goreli</option>
          <option value="kovan">Kovan</option>
          <option value="polygon">Polygon Mainet</option>
          <option value="mumbai">Polygon Testnet</option>
          <option value="bsc">Binance</option>
          <option value="bsc testnet">Binance Testnet</option>
          <option value="avalanche">Avalance</option>
          <option value="avalanche testnet">Avalance TestNet</option>
          <option value="fantom">Fantom</option>
        </Select>
        <Button
          mr="1"
          onClick={() => mutate({ ...fieldValue })}
          w="120px"
          ml="20px"
        >
          Submit
        </Button>
      </Flex>
      <Text>OR</Text>
      {["polygon", "eth"].includes(fieldValue?.chain) && (
        <Flex mt="4" justifyContent="center">
          <LoginWithUnStoppable setWalletAddr={handleWalletAddr} />
        </Flex>
      )}
      {nftData && <NftImageSection nftData={nftData} />}
    </Box>
  );
};

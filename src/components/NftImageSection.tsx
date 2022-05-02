import React from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
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
import { Image } from "@chakra-ui/image";
import { Spinner } from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { LoginWithUnStoppable } from "./Login";
import { fetchNftBasedOnUserAddress, fetchNftFromUri } from "../utils";

const fetchTransfers = async ({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) => {
  const data = await fetch(
    `https://deep-index.moralis.io/api/v2/nft/${contractAddress}/${tokenId}/transfers?chain=eth&format=decimal`,
    {
      // @ts-ignore
      headers: {
        Accept: "application/json",
        "X-Api-Key": process.env.REACT_APP_MORALIS_KEY,
      },
    }
  );
  return await data?.json();
};

const ShowProperties = ({ properties }: any) => {
  return properties?.data?.map((data: any) => {
    if (!properties?.isObject)
      return (
        <Tr>
          <Td>{data}</Td>
        </Tr>
      );
    const key = properties.keys;
    return (
      <Tr>
        <Td>{data[key[0]]}</Td>
        <Td>{data[key[1]]}</Td>
      </Tr>
    );
  });
};

const Transfers = ({ nftTransferDetails, isTransferLoading }: any) => {
  const isTransfersDataPresent =
    !isTransferLoading && !nftTransferDetails?.result?.length;
  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Transfer History
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Box height="50vh" overflow="scroll">
            {isTransfersDataPresent && <Text>NO Data</Text>}
            {!isTransfersDataPresent && (
              <Table>
                <Thead>
                  <Tr>
                    <Th>From</Th>
                    <Th>To</Th>
                    <Th>Value</Th>
                  </Tr>
                </Thead>
                <Tbody>{isTransferLoading && <Spinner />}</Tbody>
                {nftTransferDetails?.result?.map((item: any) => {
                  return (
                    <Tr>
                      <Td>
                        <CopyToClipboard text={item?.from_address}>
                          <Flex alignItems="center">
                            <Text
                              maxW="200px"
                              whiteSpace="nowrap"
                              overflow="hidden"
                              cursor="pointer"
                              textOverflow="ellipsis"
                            >
                              {item?.from_address}
                            </Text>
                            <Button>
                              <CopyIcon w={4} h={4} />
                            </Button>
                          </Flex>
                        </CopyToClipboard>
                      </Td>
                      <Td>
                        <CopyToClipboard text={item?.to_address}>
                          <Flex alignItems="center">
                            <Text
                              maxW="200px"
                              whiteSpace="nowrap"
                              overflow="hidden"
                              cursor="pointer"
                              textOverflow="ellipsis"
                            >
                              {item?.to_address}
                            </Text>
                            <Button>
                              <CopyIcon w={4} h={4} />
                            </Button>
                          </Flex>
                        </CopyToClipboard>
                      </Td>
                      <Td> {(item?.value / 1000000000000000000).toFixed(4)}</Td>
                    </Tr>
                  );
                })}
              </Table>
            )}
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

function NftModal({
  isOpen,
  onClose,
  nftItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  nftItem: any;
}) {
  const {
    mutate,
    data: nftTransferDetails,
    isLoading: isTransferLoading,
  } = useMutation(fetchTransfers);

  const [properties, setProperties] = React.useState<any>({
    keys: [],
    data: [],
    isObject: true,
  });
  React.useEffect(() => {
    if (!nftItem) return;
    const metaData = JSON.parse(nftItem?.metadata);
    mutate({
      contractAddress: nftItem?.token_address,
      tokenId: nftItem?.token_id,
    });
    const metaDataKeys = metaData && Object.keys(metaData);
    const nftPropertKey = metaDataKeys?.filter((key: string) =>
      Array.isArray(metaData[key])
    );
    if (!nftPropertKey?.length) return;
    const nftPropertyKeys = Object.keys(metaData?.[nftPropertKey[0]]?.[0]);
    const typeOfProperty = typeof metaData?.[nftPropertKey[0]][0] === "object";
    setProperties({
      keys: nftPropertyKeys,
      data: metaData[nftPropertKey[0]],
      isObject: typeOfProperty,
    });
  }, [nftItem, mutate]);
  return (
    <>
      <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent className="nft-modal">
          <ModalHeader className="nft-modal">
            {nftItem?.name} - {nftItem?.token_id}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="nft-modal">
            <Accordion allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Properties
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Box height="50vh" overflow="scroll">
                    <Table mt="2">
                      <Thead>
                        <Tr>
                          <Th>Type</Th>
                          {properties?.isObject && <Th>Properties</Th>}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {properties?.keys?.length > 0 && (
                          <ShowProperties properties={properties} />
                        )}
                      </Tbody>
                    </Table>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Transfers
              nftTransferDetails={nftTransferDetails}
              isTransferLoading={isTransferLoading}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

const LoadImage = ({
  uri,
  item,
  nftData,
}: {
  uri: string;
  item: any;
  nftData: any;
}) => {
  const { mutate, data: imageData, isLoading } = useMutation(fetchNftFromUri);
  React.useEffect(() => {
    mutate({ uri });
  }, []);

  const metaData = JSON.parse(item?.metadata);
  const imageUrlFormatting = () => {
    if (["ipfs"].includes(imageData?.image?.split(":")[0])) {
      return `https://ipfs.io/${imageData?.image.replace(":", "")}`;
    }
    return imageData?.image ?? imageData?.image_url ?? metaData?.image;
  };

  if (!nftData || isLoading)
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        height="200px"
        width="200px"
      >
        <Spinner />
      </Flex>
    );
  return (
    <Box mx="2" mt="1">
      <Image src={imageUrlFormatting()} height="200px" width="200px" />
    </Box>
  );
};

export const NftImageSection = ({ nftData }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nftItem, setItem] = React.useState();
  const handleNftModal = (item: any) => {
    setItem(item);
    onOpen();
  };
  if (!nftData?.result?.length) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="xl" fontWeight="bold">
          No Data
        </Text>
      </Flex>
    );
  }
  return (
    <Flex
      justifyContent="space-evenly"
      flexWrap="wrap"
      overflow="scroll"
      height="80vh"
      cursor="pointer"
    >
      {nftData?.result?.map((item: any, index: number) => {
        return (
          <Box key={item?.name + index} onClick={() => handleNftModal(item)}>
            <LoadImage nftData={nftData} item={item} uri={item?.token_uri} />
            <Flex
              className="nftContent"
              p="2"
              maxWidth="200px"
              mx="2"
              flexWrap="wrap"
              justifyContent="space-between"
              borderBottomRadius="10px"
              mb="1"
            >
              <Flex w="100%">
                <Text
                  fontWeight="bold"
                  maxW="200px"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  Name: {item?.name || item?.metadata?.name}
                </Text>
              </Flex>
              <Flex>
                <Text fontWeight="bold">Symbol: {item?.symbol}</Text>
              </Flex>
              <Flex justifyContent="flex-end">
                <Text
                  maxW="100px"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  fontWeight="bold"
                >
                  TokenId: {item?.token_id}
                </Text>
              </Flex>
            </Flex>
          </Box>
        );
      })}
      <NftModal isOpen={isOpen} onClose={onClose} nftItem={nftItem} />
    </Flex>
  );
};

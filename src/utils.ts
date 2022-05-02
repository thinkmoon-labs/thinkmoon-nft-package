export const fetchNftBasedOnUserAddress = async ({
  chain,
  address,
}: {
  chain: string;
  address: string;
}) => {
  const data = await fetch(
    `${process.env.REACT_APP_NFT_URL}/${address}/nft?chain=${chain}&format=decimal`,
    {
      // @ts-ignore
      headers: {
        Accept: "application/json",
        "X-Api-Key": process.env.REACT_APP_KEY,
      },
    }
  );
  return await data?.json();
};

export const fetchNftFromUri = async ({ uri }: { uri: string }) => {
  let res = await fetch(uri, {
    method: "GET",
  });
  const data = res.json();
  return data;
};

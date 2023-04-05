import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Grid, Box, CircularProgress, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import NFT from "./NFT";
import DonatedNFT from "./DonatedNFT";

const PaginationNFTGrid = ({
  loading,
  data,
  selectedToken,
  setSelectedToken,
  isRWLK,
}) => {
  const [collection, setCollection] = useState([]);
  const [perPage] = useState(9);
  const [curPage, setCurPage] = useState(1);
  const router = useRouter();

  const handleNextPage = (page) => {
    router.query["page"] = page;
    router.push({ pathname: router.pathname, query: router.query });
  };

  useEffect(() => {
    setCollection(data);
  }, [data]);

  useEffect(() => {
    const page = parseInt(router.query["page"] as string) || 1;
    setCurPage(page);
  }, [router]);

  return (
    <Box mt={4}>
      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress color="secondary" />
        </Box>
      )}
      {data.length > 0 && (
        <>
          <Grid spacing={4} container>
            {collection
              .slice((curPage - 1) * perPage, curPage * perPage)
              .map((index) => (
                <Grid
                  key={index}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  onClick={() => {
                    setSelectedToken(index);
                  }}
                >
                  {isRWLK ? (
                    <NFT
                      tokenId={index}
                      selectable={true}
                      selected={index === selectedToken}
                    />
                  ) : (
                    <DonatedNFT
                      tokenId={index}
                      selectable={true}
                      selected={index === selectedToken}
                    />
                  )}
                </Grid>
              ))}
          </Grid>
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              color="primary"
              page={curPage}
              onChange={(e, page) => handleNextPage(page)}
              count={Math.ceil(collection.length / perPage)}
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
      {!loading && !data.length && (
        <Typography variant="h6" align="center">
          Nothing Found!
        </Typography>
      )}
    </Box>
  );
};

export default PaginationNFTGrid;

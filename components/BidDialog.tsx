import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PaginationNFTGrid from "./PaginationNFTGrid";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const BidDialog = ({ bidOptions, nfts, open, onClose, onSelect }) => {
  const [selectedToken, setSelectedToken] = useState("");
  const [nftAddress, setNftAddress] = useState("");
  const [nftID, setNftID] = useState("");

  const onClick = () => {
    onSelect(selectedToken, nftAddress, nftID);
    setNftAddress("");
    setNftID("");
    setSelectedToken("");
    onClose();
  };

  return (
    <BootstrapDialog onClose={onClose} open={open} maxWidth="md" fullWidth>
      <BootstrapDialogTitle onClose={onClose}>Bid Dialog</BootstrapDialogTitle>
      <DialogContent dividers>
        {bidOptions.withRWLK && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Random Walk NFT to bid with.
            </Typography>
            <PaginationNFTGrid
              loading={false}
              data={nfts}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              isRWLK={true}
            />
          </Box>
        )}
        {bidOptions.withDonation && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Input NFT to donate.
            </Typography>
            <Box>
              <TextField
                label="NFT Contract Address"
                variant="standard"
                value={nftAddress}
                fullWidth
                onChange={(e) => setNftAddress(e.target.value)}
              />
            </Box>
            <Box mt={2}>
              <TextField
                type="number"
                label="NFT ID"
                variant="standard"
                value={nftID}
                fullWidth
                onChange={(e) => setNftID(e.target.value)}
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={onClick}
          disabled={
            (bidOptions.withRWLK && !selectedToken) ||
            (bidOptions.withDonation && (!nftAddress || !nftID))
          }
        >
          Select
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default BidDialog;

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
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PaginationNFTGrid from "./PaginationNFTGrid";
import PaginationDonatedNFTGrid from "./PaginationDonatedNFTGrid";

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

const DonatedNFTDialog = ({ nfts, open, onClose, onSelect }) => {
  const [nft, setNft] = useState(null);

  const onClick = () => {
    onSelect(nft);
    setNft(null);
    onClose();
  };

  return (
    <BootstrapDialog onClose={onClose} open={open} maxWidth="md" fullWidth>
      <BootstrapDialogTitle onClose={onClose}>
        Donated NFT Dialog
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Box>
          <Typography variant="h6" gutterBottom>
            Select Donated NFT to claim.
          </Typography>
          <PaginationDonatedNFTGrid
            loading={false}
            data={nfts}
            selectedToken={nft}
            setSelectedToken={setNft}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClick} disabled={!nft}>
          Select
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default DonatedNFTDialog;

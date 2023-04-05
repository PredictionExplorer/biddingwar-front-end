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
  const [nftID, setNftID] = useState(-1);

  const onClick = () => {
    onSelect(nftID);
    setNftID(-1);
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
          <PaginationNFTGrid
            loading={false}
            data={nfts}
            selectedToken={nftID}
            setSelectedToken={setNftID}
            isRWLK={false}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClick} disabled={nftID < 0}>
          Select
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default DonatedNFTDialog;

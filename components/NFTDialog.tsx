import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
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

const NFTDialog = ({ nfts, open, onClose, onSelect }) => {
  const [selectedToken, setSelectedToken] = useState();
  return (
    <BootstrapDialog onClose={onClose} open={open}>
      <BootstrapDialogTitle onClose={onClose}>
        Available NFTs
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <PaginationNFTGrid
          loading={false}
          data={nfts}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
        />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            onSelect(selectedToken);
          }}
          disabled={!selectedToken}
        >
          Select
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default NFTDialog;

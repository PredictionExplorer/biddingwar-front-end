import * as React from 'react'
import {
  Box,
  Link,
  AppBar,
  List,
  Chip,
  Container,
  Button,
  Accordion,
  CardMedia,
  Card,
  TextField,
  Skeleton,
  TableContainer,
  TableCell,
  TableHead,
  AccordionDetails,
  TableRow,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { isMobile } from 'react-device-detect'

export const StyledLink = styled(Link)({
  color: '#fff',
  textDecoration: 'underline',
})

export const StyledCard = styled(Card)({
  position: "relative",
  background: "transparent",
  boxShadow: "none",
  button: {
    position: "relative",
    border: 0,
    "--border": "1px",
    "--radius": "16px",
    "--t": 0,
    "--path": "0 0px,32px 0,100% 0,100% 80%,70% 100%,0 100%",
    "-webkit-mask": "paint(rounded-shape)",
    background: "transparent",
    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    "&:before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: "linear-gradient(-27.86deg, #15BFFD 9.96%, #9C37FD 100%)",
      opacity: 0.7,
      "--t": 1,
      "-webkit-mask": "paint(rounded-shape)"
    }
  }
})

export const TablePrimaryContainer = styled(TableContainer)({
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  borderRadius: '8px 8px 0px 0px'
})

export const TablePrimaryHead = styled(TableHead)({
  backgroundColor: '#15BFFD',
})

export const TablePrimaryCell = styled(TableCell)({
  fontSize: 14,
  color: "rgba(255, 255, 255, 0.68)",
  borderBottom: 0
})

export const TablePrimaryRow = styled(TableRow)({
  border: "1px solid rgba(255, 255, 255, 0.06)"
})

export const NavLink = styled(StyledLink)({
  textTransform: 'uppercase',
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
})

export const AppBarWrapper = styled(AppBar)(({ theme }) => ({
  backgroundImage: "none",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}))

export const FooterWrapper = styled(AppBar)({
  top: 'auto',
  bottom: 0,
  backgroundImage: "none",
})

export const DrawerList = styled(List)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  width: 265,
  height: '100%',
  backgroundColor: '#080B2A',
  borderLeft: '1px solid #F4BFFF',
}))

export const Wallet = styled(Chip)(({ theme }) => ({
  padding: theme.spacing(1),
  height: 'auto',
  marginLeft: 'auto',
  fontSize: 16,
}))

export const MobileWallet = styled(Wallet)({
  margin: '0 auto',
})

export const ConnectButton = styled(Button)({
  marginLeft: 'auto',
})

export const MobileConnectButton = styled(ConnectButton)({
  marginRight: 'auto',
})

export const MainWrapper = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(20),
  paddingBottom: theme.spacing(24),
  overflow: 'hidden',
  lineHeight: 1,
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    paddingTop: theme.spacing(18),
    paddingBottom: theme.spacing(18),
  },
}))

export const CenterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-start',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
  },
}))

export const CounterWrapper = styled(Box)({
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  justifyContent: isMobile ? 'center' : 'start',
  alignItems: 'center',
})

export const CounterItemWrapper = styled(Box)({
  position: "relative",
  width: "75px",
  padding: "6px 16px",
  margin: "0 auto 8px",
  border: 0,
  "--border": "1px",
  "--radius": "4px",
  "--t": 0,
  "--path": "0 0,8px 0,100% 0,100% calc(100% - 14px),calc(100% - 16px) 100%,0 100%",
  "-webkit-mask": "paint(rounded-shape)",
  background: "transparent",
  "&:before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(152.14deg, #15BFFD 9.96%, #9C37FD 100%)",
    "--t": 1,
    "-webkit-mask": "paint(rounded-shape)"
  }
})

export const CounterItem = styled(Box)({
  width: isMobile ? '80%' : '20%',
  padding: '8px 0',
  boxSizing: 'border-box',
  marginBottom: isMobile ? 24 : 0,
})

export const QuestionIcon = styled('img')({
  marginRight: '0.5rem',
})

export const FaqAccordion = styled(Accordion)({
  border: 0,
  marginBottom: "40px !important",
  padding: '12px 16px',
  position: 'relative',
  borderRadius: '8px',
  zIndex: 0,
  "& > .MuiAccordionSummary-root": {
    border: "0 !important"
  },
  '&:before': {
    display: 'none',
  },
  '&:after': {
    zIndex: -1,
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: '8px',
    padding: "1px",
    height: "100%",
    background: "linear-gradient(152.14deg, rgba(21, 191, 253, 0.49) 9.96%, rgba(156, 55, 253, 0.49) 100%)",
    "-webkit-mask": "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    "-webkit-mask-composite": "xor",
    opacity: "1 !important"
  },
  '&:first-of-type': {
    borderRadius: '8px',
  },
  '&:last-of-type': {
    borderRadius: '8px',
  }
})

export const FaqAccordionDetails = styled(AccordionDetails)({
  padding: "0 40px 12px"
})

export const NFTImage = styled(CardMedia)({
  width: '100%',
  paddingTop: '64%',
})

export const NFTImageWrapper = styled(Box)({
  position: "relative",
  border: 0,
  "--border": "1px",
  "--radius": "8px",
  "--t": 0,
  "--path": "0 0,16px 0,100% 0,100% calc(100% - 16px),100% 100%,0 100%",
  "-webkit-mask": "paint(rounded-shape)",
  background: "transparent",
  "&:before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(152.14deg, #15BFFD 9.96%, #9C37FD 100%)",
    "--t": 1,
    "-webkit-mask": "paint(rounded-shape)"
  }
})

export const NFTSkeleton = styled(Skeleton)({
  width: '100%',
  paddingTop: '64%',
})

export const NFTCheckMark = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
})

export const NFTInfoWrapper = styled('div')({
  position: 'absolute',
  top: 16,
  left: 20,
})

export const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
  },
}))

export const SearchField = styled(TextField)(({ theme }) => ({
  marginRight: theme.spacing(1),
  width: 360,
  [theme.breakpoints.down('xs')]: {
    marginRight: 0,
    marginBottom: theme.spacing(2),
    width: '100%',
  },
}))

export const SearchButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
}))

export const VideoCard = styled(StyledCard)({
  position: 'relative',
  background: "linear-gradient(#080B2A, #080B2A) padding-box, linear-gradient(90deg, rgba(21, 191, 253, 0) 8.19%, rgba(21, 191, 253, 0.7) 70.61%, rgba(156, 55, 253, 0.7) 100%) border-box",
  borderRadius: "16px",
  border: "6px solid transparent",
  padding: "21px 16px",

  ".MuiCardMedia-root": {
  }
})

export const SectionWrapper = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}))

export const GradientText = styled(Typography)({
  background: "linear-gradient(117.76deg, #35C9FF 3.35%, #1D9BEF 3.35%, #AC56FF 82.8%)",
  "-webkit-background-clip": "text",
  "-webkit-text-fill-color": "transparent"
})

export const GradientBorder = styled(Box)({
  position: "relative",
  border: 0,
  "--border": "1px",
  "--radius": "16px",
  "--t": 0,
  "--path": "0 0,32px 0,100% 0,100% calc(100% - 32px),100% 100%,0 100%",
  "-webkit-mask": "paint(rounded-shape)",
  background: "transparent",
  "&:before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(152.14deg, rgba(21, 191, 253, 0.7) 9.96%, rgba(156, 55, 253, 0.7) 100%)",
    "--t": 1,
    "-webkit-mask": "paint(rounded-shape)"
  }
})

export const CodeWrapper = styled(Box)({
  position: "relative",
  border: 0,
  "--border": "1px",
  "--radius": "16px",
  "--t": 0,
  "--path": "0 0,32px 0,100% 0,100% 85%,80% 100%,0 100%",
  "-webkit-mask": "paint(rounded-shape)",
  background: "rgba(255, 255, 255, 0.05)",
  "&:before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(152.14deg, rgba(156, 55, 253, 0.7) 9.96%, rgba(21, 191, 253, 0.7) 100%)",
    "--t": 1,
    "-webkit-mask": "paint(rounded-shape)"
  }
})


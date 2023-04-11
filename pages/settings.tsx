import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { BigNumber } from "@ethersproject/bignumber";
import Head from "next/head";
import { MainWrapper } from "../components/styled";

const Settings = () => {
  const [ignoreSteps, setIgnoreSteps] = useState(0);
  const [numberOfSteps, setNumberOfSteps] = useState(200000);
  const [bodies, setBodies] = useState([false, false, false]);
  const [perspective, setPerspective] = useState(0);

  const onSave = () => {
    let result = BigNumber.from(0);
    let bnIgnoreSteps = BigNumber.from(ignoreSteps);
    let bnNumberOfSteps = BigNumber.from(numberOfSteps);
    let bnPerspective = BigNumber.from(perspective);
    result = bnIgnoreSteps;
    result = result.add(bnNumberOfSteps.mul(BigNumber.from(2).pow(32)));
    for (let i = 0; i < 3; i++) {
      if (bodies[i]) {
        result = result.add(BigNumber.from(2).pow(64 + i));
      }
    }
    result = result.add(bnPerspective.mul(BigNumber.from(2).pow(68)));
    console.log(result.toNumber());
  };
  return (
    <>
      <Head>
        <title>Settings | Bidding War</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography variant="h4" component="span">
            BIDDING WAR SETTINGS
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
          <Typography component="span" mr={2}>
            Ignore Some Number Of Initial Steps:
          </Typography>
          <TextField
            type="number"
            defaultValue={ignoreSteps}
            inputProps={{ min: 0 }}
            onChange={(e) => setIgnoreSteps(Number(e.target.value))}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
          <Typography component="span" mr={2}>
            Number Of Steps:
          </Typography>
          <TextField
            type="number"
            defaultValue={numberOfSteps}
            inputProps={{ min: 1 }}
            onChange={(e) => setNumberOfSteps(Number(e.target.value))}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
          <Typography component="span" mr={2}>
            Display 1st Body:
          </Typography>
          <Switch
            defaultChecked={bodies[0]}
            onChange={(e) =>
              setBodies([e.target.checked, bodies[1], bodies[2]])
            }
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
          <Typography component="span" mr={2}>
            Display 2nd Body:
          </Typography>
          <Switch
            defaultChecked={bodies[1]}
            onChange={(e) =>
              setBodies([bodies[0], e.target.checked, bodies[2]])
            }
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
          <Typography component="span" mr={2}>
            Display 3rd Body:
          </Typography>
          <Switch
            defaultChecked={bodies[2]}
            onChange={(e) =>
              setBodies([bodies[0], bodies[1], e.target.checked])
            }
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
          <Typography component="span" mr={2}>
            Display Color:
          </Typography>
          <Switch defaultChecked />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
          <Typography component="span" mr={2}>
            Perspective:
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="perspective-select-label">Perspective</InputLabel>
            <Select
              labelId="perspective-select-label"
              value={perspective}
              label="Perspective"
              onChange={(e) => setPerspective(Number(e.target.value))}
            >
              <MenuItem value={0}>Front</MenuItem>
              <MenuItem value={1}>Side</MenuItem>
              <MenuItem value={2}>Top</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button autoFocus onClick={onSave}>
          Save
        </Button>
      </MainWrapper>
    </>
  );
};

export default Settings;

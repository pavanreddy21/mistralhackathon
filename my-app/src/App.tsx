import * as React from "react";
import { ChakraProvider, Box, Grid } from "@chakra-ui/react";
import theme from "./theme";
import Dashboard from "./Dashboard/Dashboard";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <Dashboard />
      </Grid>
    </Box>
  </ChakraProvider>
);

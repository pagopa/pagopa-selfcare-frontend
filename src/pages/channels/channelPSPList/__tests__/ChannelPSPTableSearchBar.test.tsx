import React from "react";
import ChannelPSPTableSearchBar from "../ChannelPSPTableSearchBar";
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from "@mui/system";
import { theme } from "@pagopa/mui-italia";
import { store } from "../../../../redux/store";
import { MemoryRouter, Route } from "react-router-dom";

//SNAPSHOT TESTING
it('renders correctly', () => {
    const channelId = "channelId"
    const tree = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}`]}>
          <Route path="/channels/:channelId">
            <ThemeProvider theme={theme}>
              <ChannelPSPTableSearchBar channelId={channelId} pspNameInput={""} setPspNameInput={() => ""} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(tree).toMatchSnapshot();
  });
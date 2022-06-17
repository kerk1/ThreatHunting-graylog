/*
 * Copyright (C) 2020 Graylog, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Server Side Public License, version 1,
 * as published by MongoDB, Inc.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Server Side Public License for more details.
 *
 * You should have received a copy of the Server Side Public License
 * along with this program. If not, see
 * <http://www.mongodb.com/licensing/server-side-public-license>.
 */
import * as React from 'react';
import { render } from 'wrappedTestingLibrary';
import { useLocation } from 'react-router-dom';

import { asMock } from 'helpers/mocking';

import DashboardPageContext from './DashboardPageContext';
import DashboardPageContextProvider from './DashboardPageContextProvider';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(() => ({
    pathname: '',
    search: '',
  })),
}));

jest.mock('views/stores/ViewStatesStore', () => ({
  ViewStatesStore: {
    getInitialState: jest.fn(() => ({
      has: jest.fn((pageId) => pageId === 'page-id' || pageId === 'page2-id'),
    })),
    listen: jest.fn(),
  },
}));

const emptyLocation = {
  pathname: '',
  search: '',
  hash: '',
  state: undefined,
  key: '',
};

describe('DashboardPageContextProvider', () => {
  beforeEach(() => {
    asMock(useLocation).mockReturnValue(emptyLocation);
  });

  const renderSUT = (consume) => render(
    <DashboardPageContextProvider>
      <DashboardPageContext.Consumer>
        {consume}
      </DashboardPageContext.Consumer>
    </DashboardPageContextProvider>,
  );

  it('should update url on page set', () => {
    let contextValue;

    const consume = (value) => {
      contextValue = value;
    };

    renderSUT(consume);

    contextValue.setDashboardPage('page-id');

    expect(mockNavigate).toBeCalledWith('?page=page-id', { replace: true });
  });

  it('should update url on page change', () => {
    asMock(useLocation).mockReturnValueOnce({
      ...emptyLocation,
      search: '?page=page2-id',
    });

    let contextValue;

    const consume = (value) => {
      contextValue = value;
    };

    renderSUT(consume);

    contextValue.setDashboardPage('page-id');

    expect(mockNavigate).toBeCalledWith('?page=page-id', { replace: true });
  });

  it('should unset a page from url', () => {
    asMock(useLocation).mockReturnValueOnce({
      ...emptyLocation,
      search: '?page=page-id',
    });

    let contextValue;

    const consume = (value) => {
      contextValue = value;
    };

    renderSUT(consume);

    contextValue.unsetDashboardPage();

    expect(mockNavigate).toBeCalledWith('', { replace: true });
  });

  it('should not set to an unknown page', () => {
    asMock(useLocation).mockReturnValueOnce({
      ...emptyLocation,
      search: '?page=page-id',
    });

    let contextValue;

    const consume = (value) => {
      contextValue = value;
    };

    renderSUT(consume);

    contextValue.setDashboardPage('new');

    expect(mockNavigate).toBeCalledWith('', { replace: true });
  });
});

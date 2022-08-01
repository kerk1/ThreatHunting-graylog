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
import { render, waitFor } from 'wrappedTestingLibrary';
import { BrowserRouter as Router } from 'react-router-dom';
import { PluginManifest, PluginStore } from 'graylog-web-plugin/plugin';

import CaffeineCacheSummary from './caches/CaffeineCacheSummary';
import { CACHE } from './fixtures';
import Cache from './Cache';

PluginStore.register(new PluginManifest({}, {
  lookupTableCaches: [
    {
      type: 'guava_cache',
      displayName: 'Node-local, in-memory cache',
      summaryComponent: CaffeineCacheSummary,
    },
  ],
}));

const renderedCache = (scope: string) => {
  CACHE._metadata = {
    scope: scope,
    revision: 2,
    created_at: '2022-06-13T08:47:12Z',
    updated_at: '2022-06-29T12:00:28Z',
  };

  CACHE.config = {
    type: 'guava_cache',
    max_size: 1000,
    expire_after_access: 60,
    expire_after_access_unit: 'SECONDS',
    expire_after_write: 0,
    expire_after_write_unit: 'MILLISECONDS',
  };

  return render(
    <Router><Cache cache={CACHE} /></Router>,
  );
};

describe('Cache', () => {
  it('should show "edit" button', async () => {
    const { baseElement } = renderedCache('DEFAULT');

    await waitFor(() => {
      const actionBtn = baseElement.querySelector('button[alt="edit button"]');

      expect(actionBtn).toBeVisible();
    });
  });

  it('should not show "edit" button', async () => {
    const { baseElement } = renderedCache('ILLUMINATE');

    await waitFor(() => {
      const actionBtn = baseElement.querySelector('button[alt="edit button"]');

      expect(actionBtn).toBeNull();
    });
  });
});
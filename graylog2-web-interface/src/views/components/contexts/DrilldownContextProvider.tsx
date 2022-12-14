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
import { useContext } from 'react';

import connect from 'stores/connect';
import type Widget from 'views/logic/widgets/Widget';
import View from 'views/logic/views/View';
import type Query from 'views/logic/queries/Query';
import { createElasticsearchQueryString, filtersToStreamSet } from 'views/logic/queries/Query';
import { CurrentQueryStore } from 'views/stores/CurrentQueryStore';
import { GlobalOverrideStore } from 'views/stores/GlobalOverrideStore';
import type GlobalOverride from 'views/logic/search/GlobalOverride';

import DrilldownContext from './DrilldownContext';
import ViewTypeContext from './ViewTypeContext';
import type { Drilldown } from './DrilldownContext';

const useDrillDownContextValue = (widget: Widget, globalOverride: GlobalOverride | undefined, currentQuery: Query): Drilldown => {
  const viewType = useContext(ViewTypeContext);

  if (viewType === View.Type.Dashboard) {
    const { streams, timerange, query } = widget;

    return ({
      streams,
      timerange: (globalOverride && globalOverride.timerange ? globalOverride.timerange : timerange) || { type: 'relative', from: 300 },
      query: (globalOverride && globalOverride.query ? globalOverride.query : query) || createElasticsearchQueryString(''),
    });
  }

  if (currentQuery) {
    const streams = filtersToStreamSet(currentQuery.filter).toJS();
    const { timerange, query } = currentQuery;

    return ({ streams, timerange, query });
  }

  return undefined;
};

type Props = {
  children: React.ReactElement,
  widget: Widget,
  globalOverride: GlobalOverride | undefined,
  currentQuery: Query,
};

const DrilldownContextProvider = ({ children, widget, globalOverride, currentQuery }: Props) => {
  const drillDownContextValue = useDrillDownContextValue(widget, globalOverride, currentQuery);

  if (drillDownContextValue) {
    return <DrilldownContext.Provider value={drillDownContextValue}>{children}</DrilldownContext.Provider>;
  }

  return children;
};

export default connect(
  DrilldownContextProvider,
  {
    currentQuery: CurrentQueryStore,
    globalOverride: GlobalOverrideStore,
  },
);

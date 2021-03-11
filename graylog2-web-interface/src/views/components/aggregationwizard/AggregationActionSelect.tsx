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
import styled from 'styled-components';

import { Select } from 'components/common';

import type { AggregationAction } from './AggregationWizard';

const _getOptions = (aggregationActions: Array<AggregationAction>, configuredActions: Array<string>) => {
  return aggregationActions.reduce((availableActions, aggregationAction) => {
    if (!configuredActions.find((actionKey) => aggregationAction.value === actionKey)) {
      availableActions.push({ value: aggregationAction.value, label: aggregationAction.label });
    }

    return availableActions;
  }, []);
};

type Props = {
  aggregationActions: Array<AggregationAction>,
  configuredActions: Array<string>,
  onActionCreate: (actionKey: string) => void,
}

const AggregationActionSelect = ({ aggregationActions, configuredActions, onActionCreate }: Props) => {
  const options = _getOptions(aggregationActions, configuredActions);

  return (
    <Select options={options} onChange={onActionCreate} placeholder="Select action..." />
  );
};

export default AggregationActionSelect;
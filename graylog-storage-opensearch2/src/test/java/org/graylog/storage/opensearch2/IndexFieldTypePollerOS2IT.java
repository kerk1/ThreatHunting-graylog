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
package org.graylog.storage.opensearch2;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.graylog.storage.opensearch2.cat.CatApi;
import org.graylog.storage.opensearch2.cluster.ClusterStateApi;
import org.graylog.storage.opensearch2.mapping.FieldMappingApi;
import org.graylog.storage.opensearch2.stats.StatsApi;
import org.graylog.storage.opensearch2.testing.OpenSearchInstance;
import org.graylog.testing.elasticsearch.SearchServerInstance;
import org.graylog2.indexer.fieldtypes.IndexFieldTypePollerAdapter;
import org.graylog2.indexer.fieldtypes.IndexFieldTypePollerIT;
import org.graylog2.indexer.indices.IndicesAdapter;
import org.graylog2.shared.bindings.providers.ObjectMapperProvider;
import org.junit.Rule;

public class IndexFieldTypePollerOS2IT extends IndexFieldTypePollerIT {
    @Rule
    public final OpenSearchInstance openSearchInstance = OpenSearchInstance.create();

    private final ObjectMapper objectMapper = new ObjectMapperProvider().get();

    @Override
    protected IndicesAdapter createIndicesAdapter() {
        final OpenSearchClient client = openSearchInstance.elasticsearchClient();
        return new IndicesAdapterOS2(
                client,
                new StatsApi(objectMapper, client),
                new CatApi(objectMapper, client),
                new ClusterStateApi(objectMapper, client)
        );
    }

    @Override
    protected IndexFieldTypePollerAdapter createIndexFieldTypePollerAdapter() {
        final OpenSearchClient client = openSearchInstance.elasticsearchClient();
        return new IndexFieldTypePollerAdapterOS2(new FieldMappingApi(objectMapper, client));
    }

    @Override
    protected SearchServerInstance elasticsearch() {
        return this.openSearchInstance;
    }
}
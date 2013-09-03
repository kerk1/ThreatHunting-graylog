/**
 * Copyright 2013 Lennart Koopmann <lennart@torch.sh>
 *
 * This file is part of Graylog2.
 *
 * Graylog2 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog2 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog2.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
package models;

import lib.APIException;
import lib.ApiClient;
import models.api.responses.system.ServerThroughputResponse;

import java.io.IOException;

/**
 * @author Lennart Koopmann <lennart@torch.sh>
 */
public class Throughput {

    public static int getTotal() throws IOException, APIException {
        int total = 0;

        for(Node node: Node.all()) {
            total += get(node);
        }

        return total;
    }

    public static int get(Node node) throws IOException, APIException {
        return ApiClient.get(ServerThroughputResponse.class).node(node).path("/system/throughput").execute().throughput;
    }

}

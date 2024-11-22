import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
let transport = new HTTPTransport("http://localhost:8080/rpc/v1");
let client = new Client(new RequestManager([transport]));

export const getClient = () => {
    return client;
}

export const setAuthorizationHeader = (header: string) => {
    header = header.replace(/^["']|["']$/g, '');
    client = new Client(new RequestManager([new HTTPTransport("http://localhost:8080/rpc/v1", {
        headers: {
            Authorization: "Bearer " + header,
        },
    })]));
}

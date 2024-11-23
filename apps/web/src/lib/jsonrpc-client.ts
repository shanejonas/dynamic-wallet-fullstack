import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
const URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/rpc/v1";
let transport = new HTTPTransport(URL);
let client = new Client(new RequestManager([transport]));

export const getClient = () => {
    return client;
}

export const setAuthorizationHeader = (header: string) => {
    // header = header.replace(/^["']|["']$/g, ''); // TODO: remove this
    client = new Client(new RequestManager([new HTTPTransport(URL, {
        headers: {
            Authorization: "Bearer " + header,
        },
    })]));
}

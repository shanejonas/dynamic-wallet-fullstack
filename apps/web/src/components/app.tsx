"use client";

import { useState, useEffect } from "react";
import { getClient, setAuthorizationHeader } from "@/lib/jsonrpc-cient";
import { Client } from "@open-rpc/client-js";

import Form, { IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { DynamicWidget, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { ContentDescriptorObject, MethodObject, OpenrpcDocument, MethodOrReference } from "@open-rpc/meta-schema";

export default function App() {
  const [client, setClient] = useState<Client | null>(null);
  const [openrpcDoc, setOpenrpcDoc] = useState<OpenrpcDocument | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<MethodObject | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    const t = window.localStorage.getItem("dynamic_authentication_token");
    setToken(t);
  }, [isLoggedIn]);

  useEffect(() => {
    setClient(getClient());
  }, []);

  useEffect(() => {
    if (token && isLoggedIn) {
      setAuthorizationHeader(token);
      setClient(getClient());
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (client) {
      client.request({ method: "rpc.discover", params: [] }).then((res) => {
        setOpenrpcDoc(res);
      });
    }
  }, [client]);

  const handleSubmit = async (
    data: IChangeEvent<any, any, any>,
  ) => {
    try {
      const result = await client?.request({
        method: selectedMethod?.name || "",
        params: data.formData,
      });
      setResult(result);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const method = openrpcDoc?.methods.find(
      (m: MethodOrReference) => {
        if ('name' in m) {
          return m.name === e.target.value;
        }
        return false;
      }
    );
    setResult(null);
    setSelectedMethod(method && 'name' in method ? method : null);
  };

  // Create a combined schema from all params to feed to react-jsonschema-form
  const getCombinedSchema = (params: ContentDescriptorObject[]) => {
    if (!params) return {};

    return {
      type: "object",
      properties: params.reduce(
        (acc, param) => ({
          ...acc,
          [param.name]: param.schema,
        }),
        {}
      ),
    };
  };

  return (
    <>
      <header className="flex h-16 items-center justify-between pl-4">
        <select
          className="h-9 w-48 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          onChange={handleMethodChange}
          value={selectedMethod?.name || ""}
        >
          <option value="">Select method</option>
          {openrpcDoc?.methods.map((method: MethodOrReference) => {
            if ('name' in method) {
              return (
                <option key={method.name} value={method.name}>
                  {method.name}
                </option>
              );
            }
            return null;
          })}
        </select>
        <div className="px-4">
          <DynamicWidget />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {!selectedMethod && <div className="text-red-500">Please select a method from the dropdown to start interacting with the API</div>}
        {!isLoggedIn && selectedMethod && <div className="text-red-500">Please login to use the form</div>}
        {selectedMethod && (
          <>
            <Form
              className="schema-form"
              schema={getCombinedSchema(
                selectedMethod?.params as ContentDescriptorObject[]
              )}
              uiSchema={{
                "ui:autofocus": true,
              }}
              validator={validator}
              onSubmit={handleSubmit}
              disabled={!isLoggedIn}
              children={
                <>
                  <button type="submit" className="border w-auto p-2 mr-4">Submit</button>
                  <button type="button" className="border w-auto p-2" onClick={() => setResult(null)}>Clear</button>
                </>
              }
            />
          </>
        )}
        {result && (
          <>
            <h1>Result</h1>
            <div className="flex-1">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </>
        )}
      </div>
    </>
  );
}

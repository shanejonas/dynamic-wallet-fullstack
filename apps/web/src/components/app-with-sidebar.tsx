'use client';

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useState, useEffect, FormEvent } from "react";
import { getClient, setAuthorizationHeader } from "@/lib/jsonrpc-cient-proxy";
import { Client } from "@open-rpc/client-js";

import Form, { IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { zodToJsonSchema } from "zod-to-json-schema";
import { UserDto, userSchema } from '@repo/schemas';

const jsonSchema = zodToJsonSchema(userSchema, "userSchema");

const log = (type) => console.log.bind(console, type);

export default function Page() {
  const [client, setClient] = useState<Client | null>(null);
  const token = window.localStorage.getItem('dynamic_authentication_token');

  useEffect(() => {
    if (token) {
      setAuthorizationHeader(token);
      setClient(getClient());
    }
  }, [token])

  const onSubmit = async (data: IChangeEvent<any, any, any>, event: FormEvent<any>) => {
    try {
      const result = await client?.request({method: 'test.myMethod', params: data.formData});
      console.log('result', result);
    } catch (error) {
      console.error('error', error);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Playground
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>History</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Form
              className="schema-form"
              schema={jsonSchema as any}
              validator={validator}
              onChange={log('changed')}
              onSubmit={onSubmit}
              onError={log('errors')}
              disabled={!client}
            />
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

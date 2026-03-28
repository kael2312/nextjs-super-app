'use client'

import {QueryClient} from "@tanstack/query-core";
import {ReactNode} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import RefreshToken from "@/components/refresh-token";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        }
    }
});

export default function AppProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <RefreshToken/>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}
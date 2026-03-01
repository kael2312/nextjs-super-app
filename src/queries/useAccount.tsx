import {useQuery} from "@tanstack/react-query";
import accountApiRequest from "@/apiRequests/account";

export const useAccount = () => {
    return useQuery({
        queryKey: ['account-profile'],
        queryFn: accountApiRequest.me
    })
}
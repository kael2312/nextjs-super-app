import {useMutation, useQuery} from "@tanstack/react-query";
import accountApiRequest from "@/apiRequests/account";
import {AccountResType} from "@/schemaValidations/account.schema";

export const useAccount = () => {
    return useQuery({
        queryKey: ['account-profile'],
        queryFn: accountApiRequest.me
    })
}

export const useUpdateMe = () => {
    return useMutation({
        mutationFn: accountApiRequest.updateMe,
    })
}
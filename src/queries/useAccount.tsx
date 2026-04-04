import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
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

export const useGetAccountList = () => {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: accountApiRequest.list,
    })
}

export const useGetAccount = ({id}: { id: number }) => {
    return useQuery({
        queryKey: ['accounts', id],
        queryFn: () => accountApiRequest.getEmployee,
    })
}

export const useAddAccountMutation = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: accountApiRequest.addEmployee,
    })
}
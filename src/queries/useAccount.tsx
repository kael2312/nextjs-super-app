import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import accountApiRequest from "@/apiRequests/account";
import {
    AccountResType,
    GetGuestListQueryParamsType,
    UpdateEmployeeAccountBodyType
} from "@/schemaValidations/account.schema";

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

export const useGetAccount = ({
                                  id,
                                  enabled
                              }: {
    id: number
    enabled: boolean
}) => {
    return useQuery({
        queryKey: ['accounts', id],
        queryFn: () => accountApiRequest.getEmployee(id),
        enabled
    })
}

export const useAddAccountMutation = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: accountApiRequest.addEmployee,
    })
}

export const useUpdateAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         ...body
                     }: UpdateEmployeeAccountBodyType & { id: number }) =>
            accountApiRequest.updateEmployee(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['accounts'],
                exact: true
            })
        }
    })
}

export const useGetGuestListQuery = (
    queryParams: GetGuestListQueryParamsType
) => {
    return useQuery({
        queryFn: () => accountApiRequest.guestList(queryParams),
        queryKey: ['guests', queryParams]
    })
}

export const useCreateGuestMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.createGuest
    })
}
import http from "@/lib/http";
import {
    AccountListResType,
    AccountResType,
    CreateEmployeeAccountBodyType,
    CreateGuestBodyType,
    CreateGuestResType, GetGuestListQueryParamsType, GetListGuestsResType, UpdateEmployeeAccountBodyType,
    UpdateMeBodyType
} from "@/schemaValidations/account.schema";
import queryString from "query-string";


const prefix = '/accounts'

const accountApiRequest = {
    me: () => http.get<AccountResType>('/accounts/me'),
    updateMe: (body: UpdateMeBodyType) => http.put<UpdateMeBodyType, AccountResType>('/accounts/me', body),
    list: () => http.get<AccountListResType>(`${prefix}`),
    addEmployee: (body: CreateEmployeeAccountBodyType) => http.post<CreateEmployeeAccountBodyType, AccountResType>(`${prefix}`, body),
    updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) => http.put<UpdateEmployeeAccountBodyType, AccountResType>(`${prefix}/detail/${id}`, body),
    getEmployee: (id: number) => http.get<AccountResType>(`${prefix}/detail/${id}`),
    deleteEmployee: (id: number) => http.delete<AccountResType>(`${prefix}/detail/${id}`),
    guestList: (queryParams: GetGuestListQueryParamsType) =>
        http.get<GetListGuestsResType>(
            `${prefix}/guests?` +
            queryString.stringify({
                fromDate: queryParams.fromDate?.toISOString(),
                toDate: queryParams.toDate?.toISOString()
            })
        ),
    createGuest: (body: CreateGuestBodyType) =>
        http.post<CreateGuestBodyType, CreateGuestResType>(`${prefix}/guests`, body)
}

export default accountApiRequest;
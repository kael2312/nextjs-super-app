import http from "@/lib/http";
import {
    AccountListResType,
    AccountResType,
    CreateEmployeeAccountBodyType, UpdateEmployeeAccountBodyType,
    UpdateMeBodyType
} from "@/schemaValidations/account.schema";


const prefix = '/accounts'

const accountApiRequest = {
    me: () => http.get<AccountResType>('/accounts/me'),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', body),
    list: () => http.get<AccountListResType>(`${prefix}`),
    addEmployee: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>(`${prefix}`, body),
    updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) => http.put<AccountResType>(`${prefix}/detail/${id}`, body),
    getEmployee: (id: number) => http.get<AccountResType>(`${prefix}/detail/${id}`),
    deleteEmployee: (id: number) => http.delete<AccountResType>(`${prefix}/detail/${id}`),
}

export default accountApiRequest;
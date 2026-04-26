import http from "@/lib/http";
import {
    LoginBodyType,
    LoginResType,
    LogoutBodyType,
    RefreshTokenBodyType,
    RefreshTokenResType
} from "@/schemaValidations/auth.schema";
import refreshToken from "@/components/refresh-token";

const authApiRequest = {
    refreshTokenRequest: null as Promise<{
        status: number,
        payload: RefreshTokenResType
    }> | null,
    sLogin: (body: LoginBodyType) => http.post<LoginBodyType, LoginResType>('/auth/login', body),
    login: (body: LoginBodyType) => http.post<LoginBodyType, LoginResType>('/api/auth/login', body, {
        baseUrl: ''
    }),
    serverLogout: (body: LogoutBodyType, accessToken: string) => http.post('/auth/logout', body, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }),
    logout: () => http.post('/api/auth/logout', null, {
        baseUrl: ''
    }),
    serverRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenBodyType, RefreshTokenResType>('/auth/refresh-token', body),
    async refreshToken(){
        if(this.refreshTokenRequest) return this.refreshTokenRequest;
        this.refreshTokenRequest = http.post('/api/auth/refresh-token', null, {baseUrl: ''})
        const result = await this.refreshTokenRequest;
        this.refreshTokenRequest = null;
        return result;
    }
}

export default authApiRequest;
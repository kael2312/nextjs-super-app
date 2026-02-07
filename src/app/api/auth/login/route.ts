import {LoginBodyType} from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import authApiRequest from "@/apiRequests/auth";
import jwt from "jsonwebtoken";
import {HttpError} from "@/lib/http";

export async function POST(request: Request) {
    const body = (await request.json()) as LoginBodyType
    const cookieStore = await cookies()
    try {
        const {payload} = await authApiRequest.sLogin(body)
        const  {
            data: { accessToken, refreshToken },
        } = payload

        const decodeAccessToken = jwt.decode(accessToken) as {exp: number}
        const decodeRefreshToken = jwt.decode(refreshToken) as {exp: number}

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: decodeAccessToken.exp * 1000
        })

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: decodeRefreshToken.exp * 1000
        })

        return Response.json(payload)
    } catch (error) {
        if(error instanceof HttpError) {
            return  Response.json(error.payload, {
                status: error.status,
            })
        }else{
            return Response.json({
                message: 'Có lôỗi xaảy ra',
                status: 500
            })
        }
    }
}
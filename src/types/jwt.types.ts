import {Role, TokenType} from "@/constants/type";

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType];
export type RoleTye = (typeof Role)[keyof typeof Role];

export interface TokenPayload {
    useId: number;
    role: RoleTye;
    tokenType: TokenTypeValue;
    exp: number;
    iat: number;
}

export interface TableTokenPayload {
    iat: number;
    number: number;
    tokenType: (typeof TokenType)['TableToken'];
}
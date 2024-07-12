import type { OctokitOptions } from "@octokit/core/dist-types/types";
import type {
        RestEndpointMethodTypes
} from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types";

export interface GithubOptions extends OctokitOptions {
        owner: string
        repo: string
        path: string
        branch?: string
}

export interface GithubRepoPathCtx {
        content: string
        sha: string
}

export interface GithubRepoUpdateInfo {
        sha: string
        committer: {
                name: string
                email: string
                date: string
        },
        message: string
}

export interface GithubDBOptions {
        token: string
        owner: string
        repo: string
        path: string
        branch?: string
}

export type GithubUsageInfo = RestEndpointMethodTypes["rateLimit"]["get"]["response"]["data"]["rate"];

export type DB_INSERTONE = (doc: object) => Promise<object>;
export type DB_INSERTMANY = (docs: Array<object>) => Promise<Array<object>>;
export type DB_FIND = (query: object) => Promise<Array<object>>;
export type DB_UPDATEONE = (query: object, doc: object) => Promise<object | null>;
export type DB_UPDATEMANY = (query: object, doc: object) => Promise<Array<object>>;
export type DB_DELETEONE = (query: object) => Promise<number>;
export type DB_DELETEMANY = (query: object) => Promise<number>;
export type DB_CONNECT = () => Promise<void>;
export type API_USAGEINFO = () => Promise<GithubUsageInfo>;

export interface GithubInter {
        connect(): Promise<void>
        usageInfo(): Promise<GithubUsageInfo>
        checkCreate(): Promise<boolean>
        getRepoFileCtx(): Promise<GithubRepoPathCtx>
        updateFile(ctx: string, sha: string): Promise<GithubRepoUpdateInfo>
}

export interface GithubDBInter {
        usageInfo: API_USAGEINFO
        connect: DB_CONNECT
        insertOne: DB_INSERTONE
        insertMany: DB_INSERTMANY
        find: DB_FIND
        updateOne: DB_UPDATEONE
        updateMany: DB_UPDATEMANY
        deleteOne: DB_DELETEONE
        deleteMany: DB_DELETEMANY
}

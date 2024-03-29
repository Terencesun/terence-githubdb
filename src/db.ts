import { Github } from "./github";
import type {
        GithubDBInter,
        GithubDBOptions,
} from "./interface";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PicoDB = require("picodb");
import { parseJson } from "./utils";

export class GithubDb implements GithubDBInter {

        private db = PicoDB();
        private github: Github;

        public constructor(options: GithubDBOptions) {
                this.github = new Github({
                        auth: options.token,
                        owner: options.owner,
                        repo: options.repo,
                        path: options.path,
                        branch: options.branch,
                        log: {
                                debug: () => {},
                                info: () => {},
                                warn: console.warn,
                                error: console.error
                        },
                });
        }

        public async connect(): Promise<void> {
                await this.github.connect();
                await this.github.checkCreate();
        }

        public async loadDatas(): Promise<string> {
                const ctxInfo = await this.github.getRepoFileCtx();
                const sha = ctxInfo.sha;
                const ctx = parseJson(ctxInfo.content);
                await this.db.deleteMany({});
                await this.db.insertMany(ctx);
                return sha;
        }

        public async restoreDatas(sha: string): Promise<void> {
                const docs = await this.db.find({}).toArray();
                await this.github.updateFile(JSON.stringify(docs), sha);
                await this.db.deleteMany({});
        }

        public async deleteMany(query: object): Promise<number> {
                const sha = await this.loadDatas();
                const count: number = await this.db.deleteMany(query);
                await this.restoreDatas(sha);
                return count;
        }

        public async deleteOne(query: object): Promise<number> {
                const sha = await this.loadDatas();
                const count: number = await this.db.deleteMany(query);
                await this.restoreDatas(sha);
                return count;
        }

        public async find(query: object): Promise<Array<object>> {
                await this.loadDatas();
                const docs: any = await this.db.find(query).toArray();
                return docs;
        }

        public async insertOne(doc: object): Promise<object> {
                const sha = await this.loadDatas();
                const docInfo = await this.db.insertOne(doc);
                await this.restoreDatas(sha);
                return docInfo[0];
        }

        public async insertMany(docs: Array<object>): Promise<Array<object>> {
                const sha = await this.loadDatas();
                const docInfos = await this.db.insertMany(docs);
                await this.restoreDatas(sha);
                return docInfos;
        }

        public async updateMany(query: object, doc: object): Promise<Array<object>> {
                const sha = await this.loadDatas();
                const docInfos = await this.db.updateMany(query, doc);
                await this.restoreDatas(sha);
                return docInfos;
        }

        public async updateOne(query: object, doc: object): Promise<object | null> {
                const sha = await this.loadDatas();
                const docInfo = await this.db.updateOne(query, doc);
                await this.restoreDatas(sha);
                return docInfo.length === 1 ? docInfo[0] : null;
        }
}

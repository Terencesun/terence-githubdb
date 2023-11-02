import { Octokit } from "@octokit/rest";
import type {
        GithubOptions,
        GithubRepoPathCtx,
        GithubRepoUpdateInfo,
        GithubInter,
} from "./interface";

export class Github implements GithubInter {

        private octokit: Octokit;
        private owner: string;
        private repo: string;
        private path: string;

        public constructor(options: GithubOptions) {
                this.octokit = new Octokit(options);
                this.owner = options.owner;
                this.repo = options.repo;
                this.path = options.path;
        }

        public async connect() {
                // check the repo, if no exist then create
                // check the path, if no exist then create
                if (!await this.isRepoExist()) {
                        // no exist
                        await this.createRepo();
                }
                if (!await this.isRepoPathExist()) {
                        // no exist
                        await this.createPath();
                }
        }

        public async isRepoExist(): Promise<boolean> {
                try {
                        await this.octokit.rest.repos.get({
                                owner: this.owner,
                                repo: this.repo,
                        });
                } catch (e) {
                        if ((e as any).status === 404) {
                                return false;
                        } else {
                                throw e;
                        }
                }
                return true;
        }

        public async isRepoPathExist(): Promise<boolean> {
                try {
                        await this.octokit.rest.repos.getContent({
                                owner: this.owner,
                                repo: this.repo,
                                path: this.path,
                        });
                } catch (e) {
                        if ((e as any).status === 404) {
                                return false;
                        } else {
                                throw e;
                        }
                }
                return true;
        }

        public async createRepo(): Promise<void> {
                await this.octokit.rest.repos.createForAuthenticatedUser({
                        name: this.repo,
                        description: "githubdb",
                        private: true,
                });
        }

        public async createPath(): Promise<void> {
                await this.octokit.rest.repos.createOrUpdateFileContents({
                        owner: this.owner,
                        repo: this.repo,
                        path: this.path,
                        message: "create path file",
                        content: "",
                });
        }

        public async getRepoFileCtx(): Promise<GithubRepoPathCtx> {
                const ctxRaw = await this.octokit.rest.repos.getContent({
                        owner: this.owner,
                        repo: this.repo,
                        path: this.path,
                });
                const data = ctxRaw.data as { content: string, sha: string };
                const ctx = Buffer.from(data.content, "base64").toString("utf-8");
                return {
                        content: ctx,
                        sha: data.sha,
                };
        }

        public async updateFile(ctx: string, sha: string): Promise<GithubRepoUpdateInfo> {
                const updateInfo = await this.octokit.repos.createOrUpdateFileContents({
                        owner: this.owner,
                        repo: this.repo,
                        path: this.path,
                        message: `${this.path} file update at ${new Date().toUTCString()}`,
                        content: new Buffer(ctx).toString("base64"),
                        sha,
                });
                return {
                        sha: updateInfo.data.commit.sha as string,
                        message: updateInfo.data.commit.message as string,
                        committer: {
                                name: updateInfo.data.commit.committer?.name as string,
                                email: updateInfo.data.commit.committer?.email as string,
                                date: updateInfo.data.commit.committer?.date as string,
                        }
                };
        }

}

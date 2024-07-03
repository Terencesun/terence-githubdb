import { Octokit } from "@octokit/rest";
import { fileDownload, getAllBranchs } from "./utils";
import fs from "node:fs";
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
        private branch: string | null;

        public constructor(options: GithubOptions) {
                this.octokit = new Octokit(options);
                this.owner = options.owner;
                this.repo = options.repo;
                this.path = options.path;
                this.branch = options.branch ? options.branch : null;
        }

        public async connect() {
                // check the repo, if no exist then create
                // check the branch, if no exist then create
                // check the path, if no exist then create
                if (!await this.isRepoExist()) {
                        // no exist
                        await this.createRepo();
                }
                if (this.branch && !await this.isBranchExist()) {
                        // no exist
                        await this.createBranch();
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
                        const refObj: any = {};
                        if (this.branch) refObj["ref"] = `refs/heads/${this.branch}`;
                        await this.octokit.rest.repos.getContent({
                                owner: this.owner,
                                repo: this.repo,
                                path: this.path,
                                ...refObj,
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

        public async isBranchExist(): Promise<boolean> {
                const branches: Array<{ name: string }> = [];
                await getAllBranchs(this.octokit, {
                        owner: this.owner,
                        repo: this.repo,
                }, branches, 0);
                const findRet = branches.find(x => x.name === this.branch);
                return findRet ? true : false;
        }

        public checkCreate(): Promise<boolean> {
                let timmer: NodeJS.Timeout;
                let lock = false;
                let count = 0;
                return new Promise((resolve, reject) => {
                        timmer = setInterval(async () => {
                                if (!lock) {
                                        lock = true;
                                        count += 1;
                                        const repoRet = await this.isRepoExist();
                                        const repoPathRet = await this.isRepoPathExist();
                                        const branchRet = await this.isBranchExist();
                                        if (repoRet && repoPathRet && branchRet) {
                                                clearInterval(timmer);
                                                resolve(true);
                                        }
                                        lock = false;
                                }
                                if (count > 5) {
                                        reject(false);
                                }
                        }, 1000);
                });
        }

        public async createRepo(): Promise<void> {
                await this.octokit.rest.repos.createForAuthenticatedUser({
                        name: this.repo,
                        description: "githubdb",
                        private: true,
                });
        }

        public async createPath(): Promise<void> {
                const branchInfo: any = {};
                if (this.branch) branchInfo["branch"] = this.branch;
                await this.octokit.rest.repos.createOrUpdateFileContents({
                        owner: this.owner,
                        repo: this.repo,
                        path: this.path,
                        ...branchInfo,
                        message: "create path file",
                        content: "",
                });
        }

        public async createBranch(): Promise<void> {
                // get the default branch
                const { data: branchData } = await this.octokit.repos.get({
                        owner: this.owner,
                        repo: this.repo,
                });
                const defaultBranch = branchData.default_branch;
                // get the default ref's  latest sha
                const { data: branchInfo } = await this.octokit.repos.getBranch({
                        owner: this.owner,
                        repo: this.repo,
                        branch: defaultBranch
                });
                const sha = branchInfo.commit.sha;
                const ref = "refs/heads/" + this.branch as string;
                // create a new branch
                await this.octokit.git.createRef({
                        owner: this.owner,
                        repo: this.repo,
                        ref: ref,
                        sha: sha,
                });
        }

        public async getRepoFileCtx(): Promise<GithubRepoPathCtx> {
                const refObj: any = {};
                if (this.branch) refObj["ref"] = `refs/heads/${this.branch}`;
                const ctxRaw = await this.octokit.rest.repos.getContent({
                        owner: this.owner,
                        repo: this.repo,
                        path: this.path,
                        ...refObj,
                });
                const data = ctxRaw.data as { download_url: string, sha: string };
                const info = await fileDownload(data.download_url, __dirname);
                const filePath = info.filePath;
                const content = fs.readFileSync(filePath, "utf-8");
                fs.unlinkSync(filePath);
                return {
                        content: content,
                        sha: data.sha,
                };
        }

        public async updateFile(ctx: string, sha: string): Promise<GithubRepoUpdateInfo> {
                const branchInfo: any = {};
                if (this.branch) branchInfo["branch"] = this.branch;
                const updateInfo = await this.octokit.repos.createOrUpdateFileContents({
                        owner: this.owner,
                        repo: this.repo,
                        path: this.path,
                        ...branchInfo,
                        message: `${this.path} file update at ${new Date().toUTCString()}`,
                        content: Buffer.from(ctx).toString("base64"),
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

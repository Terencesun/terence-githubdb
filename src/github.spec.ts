import { Github } from "./github";
import { parseJson } from "./utils";

describe.skip("test_github", () => {
        const token: string = "xxxx";
        const owner: string = "Terencesun";
        const repo: string = "test_db";
        const path: string = "terence_db_test.json";

        it("test_getRepoFileCtx", async () => {
                const github = new Github({
                        owner: owner,
                        repo: repo,
                        path: "test_file_for_test_15",
                        auth: token,
                        branch: "test_15",
                        userAgent: "github",
                        log: {
                                debug: () => {},
                                info: console.log,
                                warn: console.warn,
                                error: console.error
                        },
                });
                const data = await github.getRepoFileCtx();
                console.log(data);
        });

        it("test_updateFile", async () => {
                const github = new Github({
                        owner: owner,
                        repo: repo,
                        path: "test_file_for_test_15",
                        auth: token,
                        branch: "test_15",
                        userAgent: "github",
                        log: {
                                debug: () => {},
                                info: console.log,
                                warn: console.warn,
                                error: console.error
                        },
                });
                const ctxInfo = await github.getRepoFileCtx();
                const ctx = ctxInfo.content;
                const arr = parseJson(ctx);
                arr.push({ aaa: 111 });
                await github.updateFile(JSON.stringify(arr), ctxInfo.sha);
        });

        it("test_isRepoExist", async () => {
                const github = new Github({
                        owner: owner,
                        repo: repo,
                        path: path,
                        auth: token,
                        userAgent: "github",
                        log: {
                                debug: () => {},
                                info: console.log,
                                warn: console.warn,
                                error: console.error
                        },
                });
                const ret = await github.isRepoExist();
                console.log(ret);
        });

        it("test_isRepoPathExist", async () => {
                const github = new Github({
                        owner: owner,
                        repo: repo,
                        path: "test_file_for_test_15",
                        auth: token,
                        branch: "test_11",
                        userAgent: "github",
                        log: {
                                debug: () => {},
                                info: console.log,
                                warn: console.warn,
                                error: console.error
                        },
                });
                const ret = await github.isRepoPathExist();
                console.log(ret);
        });

        it("test_createRepo", async () => {
                const github = new Github({
                        owner: owner,
                        repo: "test_10",
                        path: path,
                        auth: token,
                        userAgent: "github",
                        log: {
                                debug: () => {},
                                info: console.log,
                                warn: console.warn,
                                error: console.error
                        },
                });
                await github.createRepo();
        });

        it("test_createPath", async () => {
                const github = new Github({
                        owner: owner,
                        repo: "test_db",
                        path: "test_file_for_test_15",
                        auth: token,
                        branch: "test_15",
                        userAgent: "github",
                        log: {
                                debug: () => {},
                                info: console.log,
                                warn: console.warn,
                                error: console.error
                        },
                });
                await github.createPath();
        });

        it("test_connect", async () => {
                const github = new Github({
                        owner: owner,
                        repo: "test_10",
                        path: "test_file",
                        auth: token,
                        userAgent: "github",
                        log: {
                                debug: () => {},
                                info: console.log,
                                warn: console.warn,
                                error: console.error
                        },
                });
                await github.connect();
        });

        it("test_isBranchExist", async () => {
                const github = new Github({
                        owner: owner,
                        repo: "test_db",
                        path: "test_file",
                        auth: token,
                        branch: "test_1",
                        userAgent: "github",
                        log: {
                                debug: () => {},
                                info: console.log,
                                warn: console.warn,
                                error: console.error
                        },
                });
                await github.connect();
                console.log(await github.isBranchExist());
        });

        it("test_createBranch", async () => {
                const github = new Github({
                        owner: owner,
                        repo: "test_db",
                        path: "test_file",
                        auth: token,
                        branch: "test_15",
                        userAgent: "github",
                        log: {
                                debug: () => {},
                                info: console.log,
                                warn: console.warn,
                                error: console.error
                        },
                });
                await github.createBranch();
        });

        it("test_usageInfo", async () => {
                const github = new Github({
                        owner: owner,
                        repo: "test_10",
                        path: "test_file",
                        auth: token,
                        userAgent: "github",
                        log: {
                                debug: () => {},
                                info: console.log,
                                warn: console.warn,
                                error: console.error
                        },
                });
                const usage = await github.usageInfo();
                console.log(usage);
        });
});

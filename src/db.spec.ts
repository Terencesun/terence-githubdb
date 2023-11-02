import { GithubDb } from "./db";

describe.skip("test_githubdb", () => {
        const token: string = "xxxx";
        const owner: string = "Terencesun";
        const repo: string = "test_db";
        const path: string = "terence_db_test.json";

        it("test_insertOne", async () => {
                const github = new GithubDb({
                        token: token,
                        owner: owner,
                        repo: repo,
                        path: path,
                });
                const doc = await github.insertOne({
                        test: 1,
                        test2: 2,
                        test3: 3,
                });
                console.log(doc);
        });

        it("test_insertMany", async () => {
                const github = new GithubDb({
                        token: token,
                        owner: owner,
                        repo: repo,
                        path: path,
                });
                const docs = await github.insertMany([
                        {
                                test: 1,
                                test2: 2,
                        },
                        {
                                test3: 3,
                        }
                ]);
                console.log(docs);
        });

        it("test_deleteOne", async () => {
                const github = new GithubDb({
                        token: token,
                        owner: owner,
                        repo: repo,
                        path: path,
                });
                const count = await github.deleteOne({
                        _id: "h88ow8tiio",
                });
                console.log(count);
        });

        it("test_deleteMany", async () => {
                const github = new GithubDb({
                        token: token,
                        owner: owner,
                        repo: repo,
                        path: path,
                });
                const count = await github.deleteMany({
                        test: 1,
                });
                console.log(count);
        });

        it("test_find", async () => {
                const github = new GithubDb({
                        token: token,
                        owner: owner,
                        repo: repo,
                        path: path,
                });
                const docs = await github.find({
                        test3: 3,
                });
                console.log(docs);
        });

        it("test_updateOne", async () => {
                const github = new GithubDb({
                        token: token,
                        owner: owner,
                        repo: repo,
                        path: path,
                });
                const doc = await github.updateOne({
                        test3: 3,
                }, { $set: { test1: 2333 } });
                console.log(doc);
        });

        it("test_updateMany", async () => {
                const github = new GithubDb({
                        token: token,
                        owner: owner,
                        repo: repo,
                        path: path,
                });
                const docs = await github.updateMany({
                        test3: 3,
                }, { $set: { test1: 2333 } });
                console.log(docs);
        });

});

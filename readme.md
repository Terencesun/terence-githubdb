## GithubDB by TerenceSun
---
> A lightweight GitHub database operator, let your GitHub repo like mongodb

### Usage
```shell
npm install @terencesun/githubdb
```

```Typescript
import { GithubDb } from "@terence/githubdb";

async function main() {
        const githubdb = new GithubDb({
                token: "<your GitHub token, generat from https://github.com/settings/tokens>",
                owner: "<your username, like db server name>",
                repo: "<your repository to store the db's data, like database name>",    // Suggest that repo be private
                path: "<your file path in the repository to store the db's data, like table name>",
                branch: "<your repository's branch you can choose, optional, default is your default branch>"
        });
        
        // NOTE: the programe will create the branch you set if you branch is not created, and the base sha is the latest default branch commit
        // if you don't want the behavior, you should create the branch by yourself
        
        // connect to db, if the repo or path is not exist, here will create them
        await githubdb.connect();
        
        // insert operations, insertOne/insertMany
        await githubdb.insertOne({ test: 1 });
        await githubdb.insertMany([ { test: 1, test2: 2 }, { test3: 3 } ]);
        
        // delete operations, deleteOne/deleteMany
        await githubdb.deleteOne({ test: 1 });
        await githubdb.deleteMany({ test: 1 });
        
        // update operations, updateOne/updateMany, here is not the options like mongodb's update operation
        await githubdb.updateOne({ test: 1 }, { $set: { test2: 123 } });
        await githubdb.updateMany({ test: 1 }, { $set: { test2: 123 } });
        
        // find operations, find, only one method here
        await githubdb.find({ test: 1 });
        
        /*
        * Support Operators
        * Query Operators: $eq/$gt/$gte/$lt/$lte/$ne/$in/$nin/$exists/$and/$or/$not/$geoWithin/$geoIntersects/$near
        * Update Operators: $inc/$mul/$rename/$set/$unset/$min/$max/$currentDate/$pop/$pullAll/$pull/$push
        * - Array Update Operator Modifiers: $each/$slice/$position
        * - Array Update Comparison Operators: $eq/$gt/$gte/$lt/$lte/$ne/$in/$nin
        * Powered by https://github.com/jclo/picodb
        * thx so much
        * */
        
        // All the methods and operators is above
}

main();
```

### Performance
We all use GitHub as a database, so, Low performance, but can be used to record some small things

### CHANGES
- 1.1.2
    - github.ts: add pre_page: 9999 into method isBranchExist, to avoid the github api branch number limit

### Licence
MIT

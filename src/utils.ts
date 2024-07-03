import { DownloaderHelper } from "node-downloader-helper";
import type { Octokit } from "@octokit/rest";

export const parseJson = (str: string): Array<any> => {
        if (str) return JSON.parse(str);
        return [];
};

interface FileDownload {
        fileName: string;
        filePath: string;
        totalSize: number;
        incomplete: boolean;
        onDiskSize: number;
        downloadedSize: number;
}

export const fileDownload = (url: string, folder: string): Promise<FileDownload> => {
        return new Promise((resolve, reject) => {
                const dl = new DownloaderHelper(url, folder, {
                        override: true,
                        fileName: new Date().getTime() + ".tmp",
                });
                dl.on("end", resolve as any);
                dl.on("error", reject);
                dl.start().catch(reject);
        });
};

export const getAllBranchs = async (octokit: Octokit, config: { owner: string, repo: string }, store: Array<any>, page: number) => {
        const pageSize = 100;
        const { data } = await octokit.repos.listBranches({
                owner: config.owner,
                repo: config.repo,
                per_page: pageSize,
                page: page,
        });
        store.push(...data);
        if (data.length === pageSize) {
                await getAllBranchs(octokit, config, store, page + 1);
        }
};

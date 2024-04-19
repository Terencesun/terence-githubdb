import { DownloaderHelper } from "node-downloader-helper";

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

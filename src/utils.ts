export const parseJson = (str: string): Array<any> => {
        if (str) return JSON.parse(str);
        return [];
};

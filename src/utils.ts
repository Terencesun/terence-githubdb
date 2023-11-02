export const parseJson = (str: string): Array<any> => {
        try {
                return JSON.parse(str);
        } catch (e) {
                return [];
        }
};

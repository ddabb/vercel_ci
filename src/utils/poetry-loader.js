export const loadPoetryData = async () => {
    const { getPoetPaths, getPoetByPath } = await import('poetryesm');
    return {
        poetPaths: await getPoetPaths(),
        getPoetByPath
    };
};
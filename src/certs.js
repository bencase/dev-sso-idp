import fs from 'fs';

const getContentsOfFilesInDir = (dir) => {
    const paths = fs.readdirSync(dir, { withFileTypes: true });
    return paths
        .filter(
            (dirEntry) =>
                dirEntry.isFile() &&
                dirEntry.name !== '.DS_Store' &&
                dirEntry.name !== '.gitignore'
        )
        .map((dirent) => {
            return fs.readFileSync(`${dir}/${dirent.name}`);
        });
};

export const getCerts = () => {
    return getContentsOfFilesInDir('ssl/cert');
};

export const getIntermediateCerts = () => {
    return getContentsOfFilesInDir('ssl/ca');
};

export const getKeys = () => {
    return getContentsOfFilesInDir('ssl/key');
};

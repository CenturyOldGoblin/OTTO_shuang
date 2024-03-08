const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;

// 输入数组，包含要复制的文件和文件夹的路径
const filesToCopy = [
    "index.html",
    "src",
    "img",
    "build"
];

// 指定目标文件夹路径
const destinationFolder = 'packed';

// 确保目标文件夹存在，如果不存在则创建
if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder, { recursive: true });
}

// 使用ncp模块复制文件和文件夹
filesToCopy.forEach((sourcePath) => {
    const sourceAbsolutePath = path.resolve(sourcePath);
    const destinationAbsolutePath = path.resolve(destinationFolder, path.basename(sourcePath));

    ncp(sourceAbsolutePath, destinationAbsolutePath, (err) => {
        if (err) {
            console.error(`Error copying ${sourcePath}: ${err}`);
        } else {
            console.log(`Copied ${sourcePath} to ${destinationAbsolutePath}`);
        }
    });
});

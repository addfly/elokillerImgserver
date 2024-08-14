const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');

const app = new Koa();
const router = new Router();

// 配置静态文件服务
app.use(serve(path.join(__dirname, 'public')));

// 获取图片列表
async function getImagesList() {
    const imagesPath = path.join(__dirname, 'public', 'images');
    const subDirs = await fs.promises.readdir(imagesPath);
    let images = [];

    for (const dir of subDirs) {
        const fullDirPath = path.join(imagesPath, dir);
        try {
            const files = await fs.promises.readdir(fullDirPath);
            images = images.concat(files.map(file => ({
                name: file,
                url: `/images/${dir}/${file}`
            })));
        } catch (error) {
            // 如果不是目录则跳过
            if (error.code === 'ENOTDIR') continue;
            throw error;
        }
    }

    return images;
}

// 路由
router.get('/images', async (ctx) => {
    const images = await getImagesList();
    ctx.body = images;
});

// 使用路由
app.use(router.routes());

// 启动服务器
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
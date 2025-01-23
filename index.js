import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

// 接收输入参数
const btnText = process.argv[2];

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // 取消无头模式
  });
  const page = await browser.newPage(); // 打开一个页面
  await page.setViewport({ width: 1920, height: 1080 }); // 设置页面宽高
  await page.goto('https://juejin.cn/'); // 跳转到掘金
  await page.waitForSelector('.side-navigator-wrap'); // 等待这个元素出现

  const elements = await page.$$('.side-navigator-wrap .nav-item-wrap span'); // 获取menu下面的span

  let matched = false;
  for (let el of elements) {
    const text = await el.getProperty('innerText');
    const name = await text.jsonValue();
    console.log(name);
    if (name.trim() === (btnText || '前端')) {
      await el.click(); // 自动点击对应的菜单
      matched = true;
      break; // 找到匹配项后跳出循环
    }
  }

  if (matched) {
    await collectFunc(page); // 调用函数收集文章信息
  }

  async function collectFunc(page) {
    // 获取列表的信息
    await page.waitForSelector('.entry-list');
    const elements = await page.$$('.entry-list .title-row a');
    const articleList = [];
    for (let el of elements) {
      const text = await el.getProperty('innerText');
      const name = await text.jsonValue();
      articleList.push(name);
    }
    console.log(articleList);

    // 调用python脚本进行中文分词 输出词云图
    const pythonProcess = spawn('python', ['index.py', articleList.join(', ')]);
    pythonProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    pythonProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }

  await browser.close(); // 关闭浏览器
})();
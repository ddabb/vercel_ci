const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.development.local' }); // 使用开发环境变量

const { createClient } = require('@supabase/supabase-js');

// 创建 Supabase 客户端
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

let dbOperationsResults = {};

// 检查并执行数据库操作的函数
async function performDbOperations(operationName, operationFn) {
  console.log(`开始执行 ${operationName} 操作...`);
  try {
    const { data, error } = await operationFn();
    if (error) throw error;
    dbOperationsResults[operationName] = { success: true, data };
    console.log(`${operationName} 操作成功.`);
  } catch (err) {
    dbOperationsResults[operationName] = { success: false, msg: err.message };
    console.error(`${operationName} 操作失败:`, err.message);
  }
}

(async () => {
  console.log("初始化数据库操作...");

  // 删除旧的操作结果文件（如果有的话）
  const oldResultFilePath = path.join(__dirname, 'jsons', 'dbOperationsResult.json');
  try {
    await fs.unlink(oldResultFilePath);
    console.log('旧的 dbOperationsResult.json 文件已被删除');
  } catch (err) {
    if (err.code !== 'ENOENT') throw err; // 如果文件不存在，则无需处理
    else console.log('未找到旧的 dbOperationsResult.json 文件，跳过删除');
  }

  // 确保 jsons 目录存在
  const jsonDir = path.join(__dirname, 'jsons');
  try {
    await fs.access(jsonDir);
    console.log(`${jsonDir} 目录已存在`);
  } catch {
    await fs.mkdir(jsonDir, { recursive: true });
    console.log(`${jsonDir} 目录已创建`);
  }

  // 执行数据库操作
  await performDbOperations('insert', async () => {
    let { data, error } = await supabase
      .from('test_table')
      .insert([{ name: 'Test Name' }])
      .select();
    return { data, error };
  });

  await performDbOperations('select', async () => {
    let { data, error } = await supabase
      .from('test_table')
      .select('*');
    return { data, error };
  });

  await performDbOperations('update', async () => {
    let { data: insertedData } = await supabase
      .from('test_table')
      .select('id')
      .limit(1)
      .single();

    let { data, error } = await supabase
      .from('test_table')
      .update({ name: 'Updated Test Name' })
      .eq('id', insertedData.id)
      .select();
    return { data, error };
  });

  await performDbOperations('delete', async () => {
    let { data: insertedData } = await supabase
      .from('test_table')
      .select('id')
      .limit(1)
      .single();

    let { data, error } = await supabase
      .from('test_table')
      .delete()
      .eq('id', insertedData.id)
      .select();
    return { data, error };
  });

  // 写入数据库操作结果到 JSON 文件
  if (Object.keys(dbOperationsResults).length > 0) {
    const resultFilePath = path.join(__dirname, 'jsons', 'dbOperationsResult.json');
    await fs.writeFile(resultFilePath, JSON.stringify(dbOperationsResults, null, 2));
    console.log('数据库操作完成，结果已保存至 jsons/dbOperationsResult.json');
  } else {
    console.log('未执行任何数据库操作');
  }

  // 不需要额外的代码来阻止控制台关闭，因为当脚本执行完毕时它自然会等待用户输入或其他事件。
  console.log("所有操作已完成，按任意键退出...");
})().catch(err => {
  console.error("执行数据库操作时发生错误", err);
});
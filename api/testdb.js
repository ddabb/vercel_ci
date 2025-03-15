require('dotenv').config({ path: '.env.production' }); // 使用生产环境变量

const { createClient } = require('@supabase/supabase-js');

// 创建 Supabase 客户端
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 导出默认函数作为API端点处理程序
module.exports = async (req, res) => {
  try {
    console.log("Starting database operations...");

    // 确保表已创建（Supabase中通常不需要手动创建表，这里仅作示例）
    // 注意：Supabase不直接支持像PostgreSQL那样的CREATE TABLE语句执行，需要通过UI或API管理表结构

    // 插入数据
    let insertRes = await supabase
      .from('test_table')
      .insert([{ name: 'Test Name' }])
      .select();
    if (insertRes.error) throw insertRes.error;
    console.log("Inserted data:", insertRes.data[0]);

    // 查询数据
    let selectRes = await supabase
      .from('test_table')
      .select('*');
    if (selectRes.error) throw selectRes.error;
    console.log("Selected data:", selectRes.data);

    // 更新数据
    let updateRes = await supabase
      .from('test_table')
      .update({ name: 'Updated Test Name' })
      .eq('id', insertRes.data[0].id)
      .select();
    if (updateRes.error) throw updateRes.error;
    console.log("Updated data:", updateRes.data[0]);

    // 删除数据
    let deleteRes = await supabase
      .from('test_table')
      .delete()
      .eq('id', insertRes.data[0].id)
      .select();
    if (deleteRes.error) throw deleteRes.error;
    console.log("Deleted data:", deleteRes.data[0]);

    res.status(200).json({ message: "Database operations successful", data: deleteRes.data[0] });
  } catch (err) {
    console.error("Database operation failed:", err.message); // 输出详细的错误信息
    res.status(500).json({ error: err.message || "An error occurred during database operations" });
  }
};
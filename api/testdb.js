// api/testdb.js

require('dotenv').config({ path: '.env.production' }); // 使用生产环境变量

const { Client } = require('pg');

// 创建 PostgreSQL 客户端
const client = new Client({
  connectionString: process.env.zenan_POSTGRES_URL_NON_POOLING,
  ssl: {
    rejectUnauthorized: false, // 确保这是你想要的配置，特别是在生产环境中
  },
});

// 导出默认函数作为API端点处理程序
module.exports = async (req, res) => {
  try {
    console.log("Attempting to connect to the database...");
    await client.connect();
    console.log("Connected to the database.");

    // 创建测试表
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `);
    console.log("Table created or already exists.");

    // 插入数据
    const insertRes = await client.query(
      'INSERT INTO test_table (name) VALUES ($1) RETURNING *',
      ['Test Name']
    );
    console.log("Inserted data:", insertRes.rows[0]);

    // 查询数据
    const selectRes = await client.query('SELECT * FROM test_table');
    console.log("Selected data:", selectRes.rows);

    // 更新数据
    const updateRes = await client.query(
      'UPDATE test_table SET name=$1 WHERE id=$2 RETURNING *',
      ['Updated Test Name', insertRes.rows[0].id]
    );
    console.log("Updated data:", updateRes.rows[0]);

    // 删除数据
    const deleteRes = await client.query(
      'DELETE FROM test_table WHERE id=$1 RETURNING *',
      [insertRes.rows[0].id]
    );
    console.log("Deleted data:", deleteRes.rows[0]);

    res.status(200).json({ message: "Database operations successful", data: deleteRes.rows[0] });
  } catch (err) {
    console.error("Database operation failed:", err.stack); // 输出详细的错误信息
    res.status(500).json({ error: err.message || "An error occurred during database operations" });
  } finally {
    await client.end();
    console.log("Disconnected from the database.");
  }
};
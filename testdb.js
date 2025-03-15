// 加载环境变量
require('dotenv').config({ path: '.env.development.local' });

const { Client } = require('pg');

// 输出环境变量以确认加载无误
console.log('Environment Variables:', {
  zenan_POSTGRES_URL_NON_POOLING: process.env.zenan_POSTGRES_URL_NON_POOLING,
});

// 创建 PostgreSQL 客户端
const client = new Client({
  connectionString: process.env.zenan_POSTGRES_URL_NON_POOLING,
  ssl: {
    rejectUnauthorized: false, // 禁用 SSL 验证（仅用于开发环境）
  },
});

// 主函数：测试数据库连接和基本操作
async function main() {
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

  } catch (err) {
    console.error("Database operation failed:", err.stack); // 输出详细的错误信息
  } finally {
    await client.end();
    console.log("Disconnected from the database.");
  }
}

// 执行主函数
main();


const express = require('express');
const cors = require('cors');
const { connectToDatabase, sql } = require('./config/database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend API is working!' });
});

// Dynamic sales summary - now supports /today, /week, /month, /quarter, /yearly
// Default route (no period specified - defaults to today)
app.get('/api/sales-summary', async (req, res) => {
    try {
        const period = 'today';
        const pool = await connectToDatabase();
        
        const whereClause = "WHERE CAST([F253] as DATE) = CAST(GETDATE() as DATE)";
        
        const result = await pool.request().query(`
            SELECT 
                SUM(CAST([F65] as DECIMAL(12,2))) as total_sales,
                COUNT(*) as total_transactions,
                AVG(CAST([F65] as DECIMAL(12,2))) as avg_order_value,
                COUNT(DISTINCT [F1057]) as active_terminals
            FROM [dbo].[RPT_FIN]
            ${whereClause}
        `);
        
        const data = result.recordset[0];
        
        res.json({
            success: true,
            period: period,
            data: {
                totalSales: data.total_sales || 0,
                transactions: data.total_transactions || 0,
                avgOrder: data.avg_order_value || 0,
                activeCustomers: data.active_terminals || 0
            }
        });
        
    } catch (error) {
        console.error('Sales summary error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route with period parameter
app.get('/api/sales-summary/:period', async (req, res) => {
    try {
        const { period } = req.params;
        const pool = await connectToDatabase();
        
        let whereClause;
        switch(period.toLowerCase()) {
            case 'today':
                whereClause = "WHERE CAST([F253] as DATE) = CAST(GETDATE() as DATE)";
                break;
            case 'week':
                whereClause = "WHERE [F253] >= DATEADD(day, -7, GETDATE())";
                break;
            case 'month':
                whereClause = "WHERE [F253] >= DATEADD(month, -1, GETDATE())";
                break;
            case 'quarter':
                whereClause = "WHERE [F253] >= DATEADD(quarter, -1, GETDATE())";
                break;
            case 'yearly':
                whereClause = "WHERE [F253] >= DATEADD(year, -1, GETDATE())";
                break;
            default:
                whereClause = "WHERE CAST([F253] as DATE) = CAST(GETDATE() as DATE)";
        }
        
        const result = await pool.request().query(`
            SELECT 
                SUM(CAST([F65] as DECIMAL(12,2))) as total_sales,
                COUNT(*) as total_transactions,
                AVG(CAST([F65] as DECIMAL(12,2))) as avg_order_value,
                COUNT(DISTINCT [F1057]) as active_terminals
            FROM [dbo].[RPT_FIN]
            ${whereClause}
        `);
        
        const data = result.recordset[0];
        
        res.json({
            success: true,
            period: period,
            data: {
                totalSales: data.total_sales || 0,
                transactions: data.total_transactions || 0,
                avgOrder: data.avg_order_value || 0,
                activeCustomers: data.active_terminals || 0
            }
        });
        
    } catch (error) {
        console.error('Sales summary error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
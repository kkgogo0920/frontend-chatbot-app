import React from 'react';
import { Table, Button, Steps } from '@arco-design/web-react';
import '../styles/ProcurementFlow.css';

const Step = Steps.Step;

const ProcurementFlow = () => {
  const columns = [
    {
      title: '物品名称',
      dataIndex: 'name',
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
    },
    {
      title: '阈值',
      dataIndex: 'threshold',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <span className={status === '需要补货' ? 'status-warning' : ''}>
          {status}
        </span>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: '米饭',
      currentStock: 50,
      threshold: 100,
      status: '需要补货',
    },
    {
      key: '2',
      name: '蔬菜',
      currentStock: 30,
      threshold: 80,
      status: '需要补货',
    },
  ];

  return (
    <div className="procurement-flow">
      <h2>中餐馆进货 Agent</h2>
      
      <Steps current={0} className="procurement-steps">
        <Step 
          title="数据分析" 
          description="库存和销售数据"
        />
        <Step 
          title="采购决策" 
          description="是否需要进货"
        />
        <Step 
          title="供应商选择" 
          description="AI辅助决策"
        />
        <Step 
          title="完成" 
          description="自动下单"
        />
      </Steps>

      <div className="inventory-table">
        <Table 
          columns={columns} 
          data={data} 
          pagination={{
            total: data.length,
            pageSize: 10,
            current: 1,
          }}
        />
      </div>

      <Button type="primary" className="analyze-button">
        分析库存状况
      </Button>
    </div>
  );
};

export default ProcurementFlow; 
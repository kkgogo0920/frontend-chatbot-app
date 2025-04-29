import React from 'react';
import { Table, Button, Steps } from '@arco-design/web-react';
import '../styles/ProcurementFlow.css';

const Step = Steps.Step;

const ProcurementFlow = () => {
  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
    },
    {
      title: 'Current Stock',
      dataIndex: 'currentStock',
    },
    {
      title: 'Threshold',
      dataIndex: 'threshold',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <span className={status === 'Restock Needed' ? 'status-warning' : ''}>
          {status}
        </span>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Rice',
      currentStock: 50,
      threshold: 100,
      status: 'Restock Needed',
    },
    {
      key: '2',
      name: 'Vegetables',
      currentStock: 30,
      threshold: 80,
      status: 'Restock Needed',
    },
  ];

  return (
    <div className="procurement-flow">
      <h2>Chinese Restaurant Procurement Agent</h2>
      
      <Steps current={0} className="procurement-steps">
        <Step 
          title="Data Analysis" 
          description="Inventory and Sales Data"
        />
        <Step 
          title="Procurement Decision" 
          description="Restock Decision"
        />
        <Step 
          title="Supplier Selection" 
          description="AI Assisted Decision"
        />
        <Step 
          title="Complete" 
          description="Auto Order"
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
        Analyze Inventory Status
      </Button>
    </div>
  );
};

export default ProcurementFlow; 
import React from 'react';
import { Radio, Space } from '@arco-design/web-react';

const RadioGroup = Radio.Group;

export default function SummaryOptions() {
  return (
    <div className="summary-options">
      <RadioGroup defaultValue="medium">
        <Space direction="horizontal" size="large">
          <Radio value="short">
            Short
            <div className="option-description">Concise overview (1-2 paragraphs)</div>
          </Radio>
          <Radio value="medium">
            Medium
            <div className="option-description">Balanced summary (2-3 paragraphs)</div>
          </Radio>
          <Radio value="long">
            Long
            <div className="option-description">Detailed analysis (3-4 paragraphs)</div>
          </Radio>
        </Space>
      </RadioGroup>
    </div>
  );
} 
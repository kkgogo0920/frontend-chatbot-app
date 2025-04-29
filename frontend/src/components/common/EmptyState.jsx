import React from 'react';
import { Empty, Button } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';

const EmptyState = ({ 
  description = 'No data available', 
  actionText,
  onAction,
  style,
  className,
  size = 'default' // 'small' | 'default' | 'large'
}) => {
  const sizeStyles = {
    small: {
      wrapper: { padding: '16px' },
      image: { width: '48px', height: '48px' },
      description: { fontSize: '12px' }
    },
    default: {
      wrapper: { padding: '24px' },
      image: { width: '64px', height: '64px' },
      description: { fontSize: '14px' }
    },
    large: {
      wrapper: { padding: '32px' },
      image: { width: '80px', height: '80px' },
      description: { fontSize: '16px' }
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.default;

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        ...currentSize.wrapper,
        ...style 
      }}
      className={className}
    >
      <Empty
        style={currentSize.image}
        description={description}
      >
        {actionText && onAction && (
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={onAction}
            style={{ marginTop: '16px' }}
          >
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState; 
import React, { useState } from 'react';
import { Modal, Button, Radio, Typography, Space, Divider, Rate } from '@arco-design/web-react';
import { IconClose } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;

const ProductDetailModal = ({
  visible,
  onCancel,
  item,
  quantity,
  setQuantity,
  onAddToCart
}) => {
  const [selectedVariant, setSelectedVariant] = useState('default');
  
  if (!item) return null;
  
  // Extract numeric price
  const priceValue = parseFloat(item.price?.replace(/[^0-9.]/g, '')) || 0;
  
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title={item.name}
      style={{ width: 520 }}
      closeIcon={<Button type="text" icon={<IconClose />} />}
    >
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: '#666' }}>{item.dimensions}</Text>
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <Title heading={6} style={{ marginBottom: 16 }}>1. Section <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>Required</Text></Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <div>
                <Text strong>{item.material}</Text>
                <Text style={{ display: 'block', color: '#666' }}>{item.price}</Text>
              </div>
              <Radio checked={selectedVariant === 'default'} onChange={() => setSelectedVariant('default')} />
            </div>
            
            {item.features && item.features.length > 0 && (
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                <Text style={{ fontSize: 14, color: '#666', display: 'block', marginBottom: 8 }}>Features:</Text>
                {item.features.map((feature, index) => (
                  <div key={index} style={{ marginBottom: 4 }}>
                    <Text style={{ fontSize: 14 }}>• {feature}</Text>
                  </div>
                ))}
              </div>
            )}
          </Space>
        </div>
        
        {item.ratings && (
          <div style={{ marginBottom: 24 }}>
            <Title heading={6} style={{ marginBottom: 8 }}>Product Details</Title>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#666' }}>Rating:</Text>
              <div>
                <Rate
                  allowHalf
                  readonly
                  value={item.ratings}
                  style={{ fontSize: 18 }}
                />
                <Text style={{ marginLeft: 8 }}>({item.reviews} reviews)</Text>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <Text style={{ color: '#666' }}>Min Order:</Text>
              <Text>{item.minOrder}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <Text style={{ color: '#666' }}>Case Quantity:</Text>
              <Text>{item.caseQuantity}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <Text style={{ color: '#666' }}>Available Stock:</Text>
              <Text>{item.stock}</Text>
            </div>
          </div>
        )}
        
        <Divider style={{ margin: '24px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <Space>
            <Button 
              shape="circle" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <Text strong style={{ padding: '0 16px' }}>{quantity}</Text>
            <Button 
              shape="circle" 
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </Space>
          <Button 
            type="primary" 
            onClick={onAddToCart} 
            style={{ width: 280 }}
          >
            Add {quantity} to cart · ${(priceValue * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
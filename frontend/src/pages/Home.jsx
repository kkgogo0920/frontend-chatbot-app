import React, { useState, useCallback, useEffect } from 'react';
import { Card, Typography, Avatar, List, Space, Button, Pagination, Empty, Rate } from '@arco-design/web-react';
import { Grid } from '@arco-design/web-react';
import { IconPlayArrow, IconHeart, IconRight, IconLeft, IconPlus } from '@arco-design/web-react/icon';
import styled from 'styled-components';
import { 
  categories, 
  products, 
  categoryColors, 
  themes,
  ITEMS_PER_PAGE,
  DEFAULT_CATEGORY,
  formatPrice,
  calculateDiscount
} from '../mock/data';
import { EmptyInfo } from '../components/common';
import ProductDetailModal from "../components/ProductDetailModal";

const { Row, Col } = Grid;
const { Title, Text } = Typography;

// Keep the remaining styled components for items
const ItemContainer = styled(List.Item)`
  border-radius: 12px;
  height: 100%;
  background: ${props => props.theme.light.background};
  box-shadow: ${props => props.theme.light.shadow};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemColorBlock = styled.div`
  width: 100%;
  height: 160px;
  border-radius: 8px;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`;

// Home 页面，展示首页仪表盘和用户信息
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const scrollRef = React.useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Function to generate random color
  const getRandomColor = useCallback(() => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  }, []);

  // Generate random colors for items once when component mounts
  const [itemColors] = useState(() => 
    Object.keys(products).reduce((acc, category) => ({
      ...acc,
      [category]: (products[category] || []).map(() => getRandomColor())
    }), {})
  );

  // Function to get current items based on pagination
  const getCurrentItems = useCallback(() => {
    const items = products[selectedCategory] || [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [selectedCategory, currentPage]);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
    setQuantity(1);
  };
  
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };
  
  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${selectedItem.name} to cart for a total of ${quantity * parseFloat(selectedItem.price.replace(/[^0-9.]/g, ''))} dollars`);
    setModalVisible(false);
  };

  const currentItems = getCurrentItems();
  const categoryInfo = categories.find(c => c.key === selectedCategory);

  return (
    <div style={{ padding: '20px', minHeight: '100%', background: themes.light.background, maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Categories Section - Now using Arco Design components */}
      <Card style={{ borderRadius: 24, marginBottom: 24, background: themes.light.surface, padding: 0 }} bodyStyle={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title heading={5} style={{ margin: 0, color: themes.light.secondary }}>Categories</Title>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              shape="circle" 
              icon={<IconLeft />} 
              style={{ color: themes.light.secondary, border: 'none', background: 'transparent' }}
              onClick={() => handleScroll('left')}
            />
            <Button 
              shape="circle" 
              icon={<IconRight />} 
              style={{ color: themes.light.secondary, border: 'none', background: 'transparent' }}
              onClick={() => handleScroll('right')}
            />
          </div>
        </div>
        
        {/* Replaced with Arco Design components */}
        <div 
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            paddingBottom: '8px',
            paddingLeft: '8px',
            paddingRight: '8px',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          {categories.map((cat) => (
            <div 
              key={cat.key} 
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                flexShrink: 0,
                cursor: 'pointer',
                width: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Card
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: categoryColors[cat.key]?.primary || cat.bgColor,
                  boxShadow: selectedCategory === cat.key ? '0 8px 24px rgba(36, 104, 242, 0.25)' : 'none',
                  transform: selectedCategory === cat.key ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  border: selectedCategory === cat.key ? '2px solid #1e62ff' : 'none',
                  marginTop: '10px'
                }}
                bodyStyle={{ padding: 0, height: '100%' }}
              >
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '16px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.6))'
                }}>
                  <Text style={{ color: '#fff', fontSize: 14 }}>{cat.description}</Text>
                </div>
              </Card>
              <div style={{ textAlign: 'center' }}>
                <Text 
                  style={{ 
                    fontSize: '15px',
                    fontWeight: '600',
                    color: selectedCategory === cat.key ? '#2468f2' : themes.light.text.primary,
                    display: 'block',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {cat.label}
                </Text>
                {selectedCategory === cat.key && (
                  <div style={{
                    height: '2px',
                    width: '40px',
                    backgroundColor: '#2468f2',
                    borderRadius: '2px',
                    margin: '6px auto 0',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Items List Section */}
      <Card style={{ borderRadius: 24, background: themes.light.surface }} bodyStyle={{ padding: 24, minHeight: 180 }}>
        <Title heading={6} style={{ marginBottom: 16 }}>{categoryInfo?.label || 'Selected'} Items</Title>
        {currentItems?.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {currentItems.map((item, idx) => (
                <Col span={8} key={item.id}>
                  <ItemContainer theme={themes} onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
                    <ItemColorBlock color={itemColors[selectedCategory][idx]}>
                      <Text style={{ 
                        fontSize: 24, 
                        color: 'rgba(0,0,0,0.25)', 
                        fontWeight: 500 
                      }}>
                        {item.name.split(' ')[0]}
                      </Text>
                    </ItemColorBlock>
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontWeight: 600, fontSize: 16, display: 'block', marginBottom: 4 }}>{item.name}</Text>
                      <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>{item.desc}</Text>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Dimensions: {item.dimensions}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>Material: {item.material}</Text>
                      </Space>
                    </div>
                    <Space direction="vertical" size={6} style={{ width: '100%' }}>
                      {item.ratings && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Rate allowHalf readonly value={item.ratings} size="small" style={{ fontSize: 14 }} />
                          <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>({item.reviews})</Text>
                        </div>
                      )}
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Space direction="vertical" size={2}>
                          <Text style={{ color: themes.light.primary, fontWeight: 600 }}>{item.price}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>Min Order: {item.minOrder}</Text>
                        </Space>
                        <Space direction="vertical" size={2} align="end">
                          <Text type="secondary" style={{ fontSize: 13 }}>Stock: {item.stock}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>Case Qty: {item.caseQuantity}</Text>
                        </Space>
                      </Space>
                    </Space>
                  </ItemContainer>
                </Col>
              ))}
            </Row>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                total={products[selectedCategory]?.length || 0}
                current={currentPage}
                pageSize={ITEMS_PER_PAGE}
                onChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <Empty
            description={`No items available${categoryInfo ? ` in ${categoryInfo.label}` : ''}`}
            style={{
              background: themes.light.background,
              borderRadius: 12,
              marginTop: 16,
              padding: 24
            }}
          >
            <Button type="primary" icon={<IconPlus />} onClick={() => console.log('Add new item clicked')}>
              Add New Item
            </Button>
          </Empty>
        )}
      </Card>

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={modalVisible}
        onCancel={handleModalClose}
        item={selectedItem}
        quantity={quantity}
        setQuantity={setQuantity}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
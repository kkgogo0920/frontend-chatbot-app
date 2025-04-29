import React, { useState, useCallback, useEffect } from 'react';
import { Card, Typography, Avatar, List, Space, Button, Breadcrumb, Pagination, Empty } from '@arco-design/web-react';
import { Grid } from '@arco-design/web-react';
import { IconPlayArrow, IconHeart, IconRight, IconLeft, IconPlus } from '@arco-design/web-react/icon';
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
import { EmptyState } from '../components/common';

const { Row, Col } = Grid;
const { Title, Text } = Typography;

const charts = [
  { title: 'AI Music Genre', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', type: 'Top 50' },
  { title: 'Pop', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', type: 'Top 50' },
  { title: 'Hip Hop', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', type: 'Top 50' },
  { title: 'Rock', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', type: 'Top 50' },
  { title: 'R&B Soul', img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99', type: 'Top 50' },
  { title: 'Country', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', type: 'Top 50' },
];

const history = [
  { title: 'She Will Be Loved', artist: 'Maroon 5', img: charts[0].img, plays: '120k' },
  { title: 'Dumb Little Bug', artist: 'Em Beihold', img: charts[1].img, plays: '120k' },
  { title: 'In World Be Yours', artist: 'Unknown', img: charts[2].img, plays: '120k' },
];

const player = {
  title: 'Living My Best Life',
  artist: 'Ben Hector',
  img: charts[3].img,
  progress: 0.6,
  duration: '2:36',
  current: '1:21',
};

// Product images array (sample images for different types of containers)
const productImages = {
  black: [
    'https://images.unsplash.com/photo-1607215036603-338e3e88d01c',
    'https://images.unsplash.com/photo-1605027690604-1cbb8575a735',
    'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd',
    'https://images.unsplash.com/photo-1587416899639-560ed644d8c7',
    'https://images.unsplash.com/photo-1610419241908-144d050c0613',
    'https://images.unsplash.com/photo-1581955957646-b8c7636552de'
  ],
  plastic: [
    'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
    'https://images.unsplash.com/photo-1597106087825-c96d6981b07d',
    'https://images.unsplash.com/photo-1581955957646-b8c7636552de',
    'https://images.unsplash.com/photo-1610419241908-144d050c0613',
    'https://images.unsplash.com/photo-1587416899639-560ed644d8c7',
    'https://images.unsplash.com/photo-1605027690604-1cbb8575a735'
  ]
  // ... Add more image arrays for other categories
};

// Mock items for each category
const mockItems = {
  black: [
    { name: 'Black Rectangular 28oz', desc: 'Microwave Safe', price: '$45.99', stock: 150 },
    { name: 'Black Round 24oz', desc: 'With Lid', price: '$38.99', stock: 200 },
    { name: 'Black Square 32oz', desc: 'Heavy Duty', price: '$52.99', stock: 175 },
    { name: 'Black Oval 26oz', desc: 'Stackable Design', price: '$41.99', stock: 120 },
    { name: 'Black Bento 36oz', desc: '3-Compartment', price: '$56.99', stock: 90 },
    { name: 'Black Platter Large', desc: 'Catering Size', price: '$62.99', stock: 80 }
  ],
  plastic: [
    { name: 'Clear Deli 16oz', desc: 'PET Plastic', price: '$32.99', stock: 300 },
    { name: 'Salad Bowl 32oz', desc: 'With Dome Lid', price: '$35.99', stock: 250 },
    { name: 'Hinged Container', desc: 'Clear PET', price: '$28.99', stock: 400 },
    { name: 'Round Container 24oz', desc: 'Microwave Safe', price: '$31.99', stock: 280 },
    { name: 'Square Container 28oz', desc: 'Tamper Evident', price: '$34.99', stock: 320 },
    { name: 'Rectangle 38oz', desc: 'Deep Dish', price: '$37.99', stock: 180 }
  ],
  compostable: [
    { name: 'Bagasse Clamshell', desc: 'Eco-friendly', price: '$48.99', stock: 200 },
    { name: 'Compostable Plate', desc: '9 inch', price: '$42.99', stock: 350 },
    { name: 'Bio Bowl 24oz', desc: 'Plant-based', price: '$45.99', stock: 280 },
    { name: 'Eco Container 32oz', desc: 'With Green Lid', price: '$51.99', stock: 150 },
    { name: 'Kraft Box Medium', desc: 'Recyclable', price: '$38.99', stock: 400 },
    { name: 'Green Line Platter', desc: 'Biodegradable', price: '$54.99', stock: 120 }
  ],
  soup: [
    { name: 'Paper Soup Cup 12oz', desc: 'With Vented Lid', price: '$28.99', stock: 500 },
    { name: 'Kraft Soup Bowl', desc: '16oz', price: '$31.99', stock: 400 },
    { name: 'Hot & Sour Bowl', desc: '24oz', price: '$34.99', stock: 300 },
    { name: 'Ramen Container', desc: 'Extra Large', price: '$42.99', stock: 200 },
    { name: 'Pho Bowl Special', desc: '32oz', price: '$38.99', stock: 250 },
    { name: 'Broth Cup 8oz', desc: 'Double Wall', price: '$26.99', stock: 600 }
  ],
  portion: [
    { name: '2oz Portion Cup', desc: 'PP Plastic', price: '$12.99', stock: 1000 },
    { name: '4oz Portion Cup', desc: 'With Lid', price: '$14.99', stock: 800 },
    { name: '1oz Sauce Cup', desc: 'Clear', price: '$10.99', stock: 1200 },
    { name: '3oz Dressing Cup', desc: 'Leak Proof', price: '$13.99', stock: 900 },
    { name: '6oz Portion Cup', desc: 'Heavy Duty', price: '$16.99', stock: 600 },
    { name: '8oz Large Cup', desc: 'With Seal', price: '$18.99', stock: 500 }
  ],
  sushi: [
    { name: 'Sushi Tray A', desc: 'With Clear Lid', price: '$45.99', stock: 200 },
    { name: 'Sushi Box B', desc: 'Black Base', price: '$48.99', stock: 180 },
    { name: 'Roll Container', desc: '8-Piece', price: '$42.99', stock: 250 },
    { name: 'Bento Box Large', desc: 'Divided', price: '$52.99', stock: 150 },
    { name: 'Party Platter', desc: '24-Piece', price: '$58.99', stock: 100 },
    { name: 'Combo Box', desc: 'With Sauce Cup', price: '$46.99', stock: 220 }
  ],
  aluminum: [
    { name: 'Aluminum Pan 1/2', desc: 'Deep', price: '$38.99', stock: 300 },
    { name: 'Aluminum Lid', desc: 'Fits 1/2 Pan', price: '$28.99', stock: 300 },
    { name: 'Full Pan', desc: 'Standard', price: '$48.99', stock: 200 },
    { name: 'Quarter Pan', desc: 'With Lid', price: '$32.99', stock: 400 },
    { name: 'Loaf Pan', desc: 'Medium', price: '$26.99', stock: 350 },
    { name: 'Steam Table Pan', desc: '4-inch Deep', price: '$44.99', stock: 250 }
  ],
  utensils: [
    { name: 'Forks (1000ct)', desc: 'Individually Wrapped', price: '$45.99', stock: 50 },
    { name: 'Chopsticks', desc: 'Bamboo', price: '$28.99', stock: 100 },
    { name: 'Spoons (1000ct)', desc: 'Heavy Duty', price: '$45.99', stock: 50 },
    { name: 'Knives (500ct)', desc: 'Premium', price: '$38.99', stock: 60 },
    { name: 'Napkins (2000ct)', desc: 'Eco-Friendly', price: '$32.99', stock: 40 },
    { name: 'Stirrers (1000ct)', desc: 'Wooden', price: '$22.99', stock: 80 }
  ]
};

// Home 页面，展示首页仪表盘和用户信息
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const scrollRef = React.useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const currentItems = getCurrentItems();
  const categoryInfo = categories.find(c => c.key === selectedCategory);

  return (
    <div style={{ padding: 0, minHeight: '100%', background: themes.light.background, maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* 顶部导航 */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={36} style={{ background: '#2468f2' }}>W</Avatar>
          <div>
            <Text style={{ fontWeight: 600 }}>Wade Warren</Text>
            <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Premium</Text>
          </div>
        </div>
      </div>

      {/* Categories Section */}
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
        
        <div 
          ref={scrollRef}
          style={{ 
            display: 'flex', 
            gap: 24,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            paddingBottom: 8,
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
                width: 160,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12
              }}
            >
              <div style={{
                width: 160,
                height: 160,
                borderRadius: 24,
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: categoryColors[cat.key]?.primary || cat.bgColor,
                boxShadow: selectedCategory === cat.key ? themes.light.shadow : 'none',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 16,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.6))'
                }}>
                  <Text style={{ color: '#fff', fontSize: 14 }}>{cat.description}</Text>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text style={{ 
                  fontSize: 15,
                  fontWeight: 600,
                  color: themes.light.text.primary,
                  display: 'block'
                }}>
                  {cat.label}
                </Text>
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
                  <List.Item style={{ 
                    borderRadius: 12, 
                    height: '100%',
                    background: themes.light.background, 
                    boxShadow: themes.light.shadow, 
                    padding: 16, 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ 
                      width: '100%', 
                      height: 160, 
                      borderRadius: 8, 
                      backgroundColor: itemColors[selectedCategory][idx],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}>
                      <Text style={{ 
                        fontSize: 24, 
                        color: 'rgba(0,0,0,0.25)', 
                        fontWeight: 500 
                      }}>
                        {item.name.split(' ')[0]}
                      </Text>
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontWeight: 600, fontSize: 16, display: 'block', marginBottom: 4 }}>{item.name}</Text>
                      <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>{item.desc}</Text>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Dimensions: {item.dimensions}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>Material: {item.material}</Text>
                      </Space>
                    </div>
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
                  </List.Item>
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

      <Row gutter={24}>
        <Col span={18}>
          {/* Listening History */}
          <Card style={{ borderRadius: 24, background: '#fafdff' }} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title heading={5} style={{ margin: 0 }}>Listening History</Title>
              <Button type="text" icon={<IconRight />} style={{ color: '#b0b8c4' }}>See All</Button>
            </div>
            <List
              dataSource={history}
              render={(item, idx) => (
                <List.Item key={idx} style={{ borderRadius: 16, marginBottom: 12, background: '#fff', boxShadow: '0 2px 8px #f0f1f2', padding: 16, display: 'flex', alignItems: 'center' }}>
                  <Avatar shape="square" size={48} style={{ marginRight: 16 }} src={item.img} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 600 }}>{item.title}</Text>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{item.artist}</Text>
                  </div>
                  <Space>
                    <Button shape="circle" size="mini" icon={<IconPlayArrow />} />
                    <Button shape="circle" size="mini" icon={<IconHeart />} />
                    <Button type="text" style={{ fontWeight: 600, color: '#b0b8c4', background: '#f6f8fa', borderRadius: 12 }}>{item.plays}</Button>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={6}>
          {/* 右侧播放卡片 */}
          <Card style={{ borderRadius: 24, background: '#fff', boxShadow: '0 2px 12px #e6eaf1', padding: 0 }} bodyStyle={{ padding: 0 }}>
            <div style={{ borderRadius: 24, overflow: 'hidden' }}>
              <img src={player.img} alt={player.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
            </div>
            <div style={{ padding: 20 }}>
              <Text style={{ fontWeight: 600, fontSize: 18 }}>{player.title}</Text>
              <Text type="secondary" style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>{player.artist}</Text>
              <div style={{ margin: '16px 0 8px 0', height: 6, background: '#f6f8fa', borderRadius: 3, position: 'relative' }}>
                <div style={{ width: `${player.progress * 100}%`, height: '100%', background: '#2468f2', borderRadius: 3 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#b0b8c4', marginBottom: 8 }}>
                <span>{player.current}</span>
                <span>{player.duration}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                <Button shape="circle" size="large" icon={<IconPlayArrow />} type="primary" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 
import React, { useState } from 'react';
import { Card, Avatar, Typography, Space, Button, Rate, List, Tag, Divider, Pagination } from '@arco-design/web-react';
import { IconHeart, IconMessage, IconThumbUp, IconMore } from '@arco-design/web-react/icon';

const { Title, Text, Paragraph } = Typography;

// Mock product review data based on the actual product data structure
const mockReviews = [
  {
    id: 'r001',
    productId: 'b001',
    productName: 'Black Rectangular 28oz',
    productDesc: 'Microwave Safe',
    productCategory: 'black',
    rating: 4.5,
    reviewTitle: 'Great quality containers!',
    reviewText: 'These containers are exactly what I needed for my restaurant. Very durable and the customers love them. They maintain heat well and don\'t leak at all. Will definitely order more.',
    userName: 'Sarah Johnson',
    userInitial: 'S',
    userType: 'Verified Buyer',
    datePosted: '2 days ago',
    likes: 24,
    replies: 3,
    helpful: 18,
    tags: ['Microwave Safe', 'Stackable', 'Dishwasher Safe'],
    price: '$45.99',
    material: 'PP Plastic'
  },
  {
    id: 'r002',
    productId: 'p003',
    productName: 'Clear Square 24oz',
    productDesc: 'Salad Container',
    productCategory: 'plastic',
    rating: 5,
    reviewTitle: 'Perfect for my salad business',
    reviewText: 'I run a small salad delivery business and these containers showcase my products beautifully. The clear material lets customers see the ingredients, and the seal keeps everything fresh. Have been using these for over a year with no complaints!',
    userName: 'Michael Chen',
    userInitial: 'M',
    userType: 'Business Owner',
    datePosted: '1 week ago',
    likes: 42,
    replies: 7,
    helpful: 35,
    tags: ['Fresh Seal', 'Stackable', 'Crystal Clear'],
    price: '$33.99',
    material: 'PET'
  },
  {
    id: 'r003',
    productId: 'c001',
    productName: 'Bagasse Clamshell',
    productDesc: 'Eco-friendly',
    productCategory: 'compostable',
    rating: 4,
    reviewTitle: 'Good eco-friendly alternative',
    reviewText: "As part of our sustainability initiative, we switched to these compostable containers. They're sturdy enough for most hot foods and our customers appreciate the eco-friendly approach. Only giving 4 stars because they're a bit more expensive than plastic alternatives.",
    userName: 'Emma Lewis',
    userInitial: 'E',
    userType: 'Restaurant Manager',
    datePosted: '3 days ago',
    likes: 16,
    replies: 2,
    helpful: 12,
    tags: ['100% Compostable', 'Microwave Safe', 'Oil Resistant'],
    price: '$48.99',
    material: 'Sugarcane Fiber',
  },
  {
    id: 'r004',
    productId: 's005',
    productName: 'Noodle Box 26oz',
    productDesc: 'Asian Style',
    productCategory: 'soup',
    rating: 5,
    reviewTitle: 'Perfect for takeout ramen!',
    reviewText: "These boxes are ideal for our takeout ramen orders. The wire handle makes it convenient for customers to carry, and the design prevents leaks. We've been getting compliments from customers about how well the noodles and broth stay separated until they're ready to eat.",
    userName: 'David Kim',
    userInitial: 'D',
    userType: 'Ramen Shop Owner',
    datePosted: '5 days ago',
    likes: 31,
    replies: 5,
    helpful: 28,
    tags: ['Wire Handle', 'Leak Resistant', 'Convenient'],
    price: '$33.99',
    material: 'Paper'
  },
  {
    id: 'r005',
    productId: 'p006',
    productName: 'Clear Platter Large',
    productDesc: 'Party Size',
    productCategory: 'plastic',
    rating: 4.5,
    reviewTitle: 'Great for catering events',
    reviewText: "We use these platters for our catering service and they're excellent. The clear design makes the food presentation pop, and they're durable enough to handle heavy items. My only suggestion would be to include dividers as an option for different food items.",
    userName: 'Jennifer Garcia',
    userInitial: 'J',
    userType: 'Catering Business',
    datePosted: 'Yesterday',
    likes: 8,
    replies: 1,
    helpful: 7,
    tags: ['Professional Grade', 'Elegant Display', 'Durable'],
    price: '$45.99',
    material: 'PET'
  }
];

const ProductReviewFeed = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [likedReviews, setLikedReviews] = useState({});
  const [helpfulReviews, setHelpfulReviews] = useState({});

  const handleLike = (reviewId) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleMarkHelpful = (reviewId) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Generate product avatar color based on product category
  const getCategoryColor = (category) => {
    const colors = {
      black: '#5d5d5d',
      plastic: '#4ECDC4',
      compostable: '#45B7D1',
      soup: '#96CEB4',
      portion: '#FF7F50'
    };
    return colors[category] || '#2468f2';
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Card 
        style={{ 
          borderRadius: 12, 
          marginBottom: 24,
          background: 'linear-gradient(135deg, #2468f2, #4e96ff)'
        }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Title heading={4} style={{ color: 'white', margin: 0 }}>
          Product Reviews & Feedback
        </Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          See what our customers are saying about their recent purchases
        </Text>
      </Card>
      
      <List
        dataSource={mockReviews}
        render={(review, index) => (
          <Card
            key={review.id}
            style={{
              borderRadius: 12,
              marginBottom: 16,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: 0 }}
            hoverable
          >
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                <Avatar 
                  size={48} 
                  style={{ 
                    background: getCategoryColor(review.productCategory),
                    marginRight: 12
                  }}
                >
                  {review.productName.substring(0, 2)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Title heading={6} style={{ margin: 0 }}>
                        {review.productName}
                      </Title>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        {review.productDesc} · {review.price} · {review.material}
                      </Text>
                    </div>
                    <Rate 
                      allowHalf 
                      value={review.rating} 
                      readonly 
                      style={{ fontSize: 14 }} 
                    />
                  </div>
                </div>
              </div>
              
              <Title heading={6} style={{ marginBottom: 8, fontWeight: 600 }}>
                {review.reviewTitle}
              </Title>
              
              <Paragraph
                style={{ 
                  margin: '0 0 12px 0',
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: '#333'
                }}
              >
                {review.reviewText}
              </Paragraph>
              
              {review.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {review.tags.map((tag, idx) => (
                    <Tag key={idx} color="gray" style={{ borderRadius: 12 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <Avatar 
                  size={28} 
                  style={{ 
                    background: '#2468f2',
                    marginRight: 8
                  }}
                >
                  {review.userInitial}
                </Avatar>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {review.userName}
                </Text>
                <Tag 
                  color="arcoblue" 
                  size="small" 
                  style={{ marginLeft: 8, padding: '0 8px' }}
                >
                  {review.userType}
                </Tag>
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                  {review.datePosted}
                </Text>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Space size="large">
                  <Button 
                    type="text" 
                    icon={<IconHeart fill={likedReviews[review.id] ? '#f53f3f' : 'none'} />} 
                    onClick={() => handleLike(review.id)}
                    style={{ color: likedReviews[review.id] ? '#f53f3f' : '' }}
                  >
                    {likedReviews[review.id] ? review.likes + 1 : review.likes}
                  </Button>
                  <Button type="text" icon={<IconMessage />}>
                    {review.replies} Replies
                  </Button>
                </Space>
                <Space>
                  <Button 
                    type="text" 
                    icon={<IconThumbUp />} 
                    onClick={() => handleMarkHelpful(review.id)}
                    style={{ color: helpfulReviews[review.id] ? '#2468f2' : '' }}
                  >
                    Helpful ({helpfulReviews[review.id] ? review.helpful + 1 : review.helpful})
                  </Button>
                  <Button type="text" icon={<IconMore />} />
                </Space>
              </div>
            </div>
          </Card>
        )}
      />
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <Pagination
          total={50}
          current={currentPage}
          pageSize={pageSize}
          onChange={setCurrentPage}
          showTotal
          sizeCanChange
          sizeOptions={[5, 10, 20]}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};

export default ProductReviewFeed;
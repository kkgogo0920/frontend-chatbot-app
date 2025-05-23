// Product mock data with detailed information
export const products = {
  black: [
    {
      id: 'b001',
      name: 'Black Rectangular 28oz',
      desc: 'Microwave Safe',
      price: '$45.99',
      stock: 150,
      dimensions: '6" x 8.5" x 2"',
      material: 'PP Plastic',
      minOrder: 100,
      features: ['Microwave Safe', 'Stackable', 'Dishwasher Safe'],
      caseQuantity: 150,
      ratings: 4.5,
      reviews: 28
    },
    {
      id: 'b002',
      name: 'Black Round 24oz',
      desc: 'With Lid',
      price: '$38.99',
      stock: 200,
      dimensions: '5" diameter x 2.5"',
      material: 'PP Plastic',
      minOrder: 100,
      features: ['Leak Proof', 'Microwaveable', 'Reusable'],
      caseQuantity: 200,
      ratings: 4.8,
      reviews: 45
    },
    {
      id: 'b003',
      name: 'Black Square 32oz',
      desc: 'Heavy Duty',
      price: '$52.99',
      stock: 175,
      dimensions: '6" x 6" x 3"',
      material: 'PP Plastic',
      minOrder: 100,
      features: ['Extra Durable', 'Stackable', 'Freezer Safe'],
      caseQuantity: 150,
      ratings: 4.7,
      reviews: 32
    },
    {
      id: 'b004',
      name: 'Black Bento 36oz',
      desc: '3-Compartment',
      price: '$56.99',
      stock: 90,
      dimensions: '9" x 7.5" x 2.5"',
      material: 'PP Plastic',
      minOrder: 50,
      features: ['Divided Sections', 'Secure Lid', 'Microwave Safe'],
      caseQuantity: 100,
      ratings: 4.9,
      reviews: 56
    },
    {
      id: 'b005',
      name: 'Black Oval 26oz',
      desc: 'Stackable Design',
      price: '$41.99',
      stock: 120,
      dimensions: '7" x 5" x 2.5"',
      material: 'PP Plastic',
      minOrder: 100,
      features: ['Space Saving', 'Airtight', 'Dishwasher Safe'],
      caseQuantity: 200,
      ratings: 4.6,
      reviews: 38
    },
    {
      id: 'b006',
      name: 'Black Platter Large',
      desc: 'Catering Size',
      price: '$62.99',
      stock: 80,
      dimensions: '18" x 13" x 1.5"',
      material: 'PP Plastic',
      minOrder: 50,
      features: ['Professional Grade', 'Non-Slip Base', 'Reusable'],
      caseQuantity: 50,
      ratings: 4.8,
      reviews: 42
    },
    {
      id: 'b007',
      name: 'Black Mini Square 8oz',
      desc: 'Sauce Container',
      price: '$28.99',
      stock: 300,
      dimensions: '3" x 3" x 2"',
      material: 'PP Plastic',
      minOrder: 200,
      features: ['Compact', 'Leak Proof', 'Perfect Portions'],
      caseQuantity: 500,
      ratings: 4.4,
      reviews: 25
    },
    {
      id: 'b008',
      name: 'Black Deep Dish 48oz',
      desc: 'Extra Deep',
      price: '$58.99',
      stock: 100,
      dimensions: '8" x 8" x 4"',
      material: 'PP Plastic',
      minOrder: 75,
      features: ['Deep Container', 'Heavy Duty', 'Secure Seal'],
      caseQuantity: 100,
      ratings: 4.7,
      reviews: 33
    }
  ],
  plastic: [
    {
      id: 'p001',
      name: 'Clear Deli 16oz',
      desc: 'PET Plastic',
      price: '$32.99',
      stock: 300,
      dimensions: '4.5" x 4.5" x 2.5"',
      material: 'PET',
      minOrder: 250,
      features: ['Crystal Clear', 'Crack Resistant', 'Tamper Evident'],
      caseQuantity: 500,
      ratings: 4.6,
      reviews: 62
    },
    {
      id: 'p002',
      name: 'Clear Round 32oz',
      desc: 'Soup Container',
      price: '$35.99',
      stock: 250,
      dimensions: '5" diameter x 4"',
      material: 'PET',
      minOrder: 200,
      features: ['Microwave Safe', 'Leak Proof', 'Clear View'],
      caseQuantity: 200,
      ratings: 4.7,
      reviews: 48
    },
    {
      id: 'p003',
      name: 'Clear Square 24oz',
      desc: 'Salad Container',
      price: '$33.99',
      stock: 400,
      dimensions: '5" x 5" x 3"',
      material: 'PET',
      minOrder: 200,
      features: ['Fresh Seal', 'Stackable', 'Crystal Clear'],
      caseQuantity: 300,
      ratings: 4.5,
      reviews: 55
    },
    {
      id: 'p004',
      name: 'Clear Bento 28oz',
      desc: 'Divided Container',
      price: '$37.99',
      stock: 200,
      dimensions: '8" x 6" x 2.5"',
      material: 'PET',
      minOrder: 150,
      features: ['3-Compartment', 'Secure Lid', 'Display Ready'],
      caseQuantity: 150,
      ratings: 4.8,
      reviews: 42
    },
    {
      id: 'p005',
      name: 'Clear Hinged 12oz',
      desc: 'Single Piece',
      price: '$29.99',
      stock: 500,
      dimensions: '4" x 4" x 3"',
      material: 'PET',
      minOrder: 300,
      features: ['One-Piece Design', 'Easy Close', 'Tamper Evident'],
      caseQuantity: 400,
      ratings: 4.4,
      reviews: 38
    },
    {
      id: 'p006',
      name: 'Clear Platter Large',
      desc: 'Party Size',
      price: '$45.99',
      stock: 150,
      dimensions: '16" x 12" x 2"',
      material: 'PET',
      minOrder: 100,
      features: ['Professional Grade', 'Elegant Display', 'Durable'],
      caseQuantity: 100,
      ratings: 4.9,
      reviews: 52
    },
    {
      id: 'p007',
      name: 'Clear Mini 4oz',
      desc: 'Sampling Cup',
      price: '$25.99',
      stock: 1000,
      dimensions: '2.5" x 2.5" x 2"',
      material: 'PET',
      minOrder: 500,
      features: ['Sample Size', 'Clear View', 'Cost Effective'],
      caseQuantity: 1000,
      ratings: 4.3,
      reviews: 28
    },
    {
      id: 'p008',
      name: 'Clear Tall 44oz',
      desc: 'Extra Capacity',
      price: '$39.99',
      stock: 200,
      dimensions: '5" x 5" x 6"',
      material: 'PET',
      minOrder: 150,
      features: ['Large Volume', 'Secure Seal', 'Easy Pour'],
      caseQuantity: 150,
      ratings: 4.7,
      reviews: 35
    }
  ],
  compostable: [
    {
      id: 'c001',
      name: 'Bagasse Clamshell',
      desc: 'Eco-friendly',
      price: '$48.99',
      stock: 200,
      dimensions: '9" x 6" x 3"',
      material: 'Sugarcane Fiber',
      minOrder: 200,
      features: ['100% Compostable', 'Microwave Safe', 'Oil Resistant'],
      caseQuantity: 200,
      ratings: 4.7,
      reviews: 36
    },
    {
      id: 'c002',
      name: 'Kraft Bowl 32oz',
      desc: 'Paper Based',
      price: '$42.99',
      stock: 300,
      dimensions: '6" diameter x 3"',
      material: 'Recycled Paper',
      minOrder: 250,
      features: ['Biodegradable', 'Hot Food Safe', 'Sturdy'],
      caseQuantity: 250,
      ratings: 4.6,
      reviews: 42
    },
    {
      id: 'c003',
      name: 'PLA Clear Cup 16oz',
      desc: 'Plant Based',
      price: '$38.99',
      stock: 400,
      dimensions: '3.5" diameter x 5"',
      material: 'PLA',
      minOrder: 300,
      features: ['Clear', 'Eco-Friendly', 'Cold Use'],
      caseQuantity: 400,
      ratings: 4.5,
      reviews: 38
    },
    {
      id: 'c004',
      name: 'Bamboo Box 24oz',
      desc: 'Natural Material',
      price: '$52.99',
      stock: 150,
      dimensions: '6" x 6" x 2.5"',
      material: 'Bamboo Fiber',
      minOrder: 100,
      features: ['Premium Look', 'Sturdy', 'Sustainable'],
      caseQuantity: 150,
      ratings: 4.8,
      reviews: 45
    },
    {
      id: 'c005',
      name: 'Eco Plate 9"',
      desc: 'Disposable',
      price: '$35.99',
      stock: 500,
      dimensions: '9" diameter',
      material: 'Bagasse',
      minOrder: 400,
      features: ['Microwave Safe', 'Cut Resistant', 'Natural Color'],
      caseQuantity: 500,
      ratings: 4.4,
      reviews: 32
    },
    {
      id: 'c006',
      name: 'Green Line Tray',
      desc: 'Multi-Purpose',
      price: '$45.99',
      stock: 200,
      dimensions: '10" x 8" x 1"',
      material: 'Wheat Straw',
      minOrder: 150,
      features: ['Versatile', 'Rigid', 'Earth Friendly'],
      caseQuantity: 200,
      ratings: 4.6,
      reviews: 28
    },
    {
      id: 'c007',
      name: 'Bio Bowl 12oz',
      desc: 'Small Size',
      price: '$32.99',
      stock: 600,
      dimensions: '4" diameter x 2"',
      material: 'PLA & Bamboo',
      minOrder: 500,
      features: ['Lightweight', 'Durable', 'Compostable'],
      caseQuantity: 600,
      ratings: 4.3,
      reviews: 25
    },
    {
      id: 'c008',
      name: 'Eco Platter XL',
      desc: 'Large Format',
      price: '$58.99',
      stock: 100,
      dimensions: '15" x 10" x 1"',
      material: 'Bagasse',
      minOrder: 75,
      features: ['Heavy Duty', 'Party Size', 'Professional'],
      caseQuantity: 100,
      ratings: 4.7,
      reviews: 34
    }
  ],
  soup: [
    {
      id: 's001',
      name: 'Paper Soup Cup 12oz',
      desc: 'With Vented Lid',
      price: '$28.99',
      stock: 500,
      dimensions: '3.5" diameter x 3.5"',
      material: 'Double-wall Paper',
      minOrder: 500,
      features: ['Heat Resistant', 'Leak Proof', 'Stackable'],
      caseQuantity: 500,
      ratings: 4.4,
      reviews: 52
    },
    {
      id: 's002',
      name: 'Soup Container 16oz',
      desc: 'Clear View',
      price: '$31.99',
      stock: 400,
      dimensions: '4" diameter x 4"',
      material: 'PP Plastic',
      minOrder: 300,
      features: ['Microwave Safe', 'Clear', 'Secure Lid'],
      caseQuantity: 400,
      ratings: 4.6,
      reviews: 48
    },
    {
      id: 's003',
      name: 'Hot & Sour 24oz',
      desc: 'Extra Large',
      price: '$34.99',
      stock: 300,
      dimensions: '5" diameter x 4.5"',
      material: 'PP Plastic',
      minOrder: 200,
      features: ['Large Capacity', 'Vented', 'Non-Slip'],
      caseQuantity: 300,
      ratings: 4.7,
      reviews: 42
    },
    {
      id: 's004',
      name: 'Kraft Bowl 32oz',
      desc: 'Eco-Friendly',
      price: '$36.99',
      stock: 250,
      dimensions: '5.5" diameter x 4"',
      material: 'Kraft Paper',
      minOrder: 200,
      features: ['Biodegradable', 'Sturdy', 'Hot Food Safe'],
      caseQuantity: 250,
      ratings: 4.5,
      reviews: 38
    },
    {
      id: 's005',
      name: 'Noodle Box 26oz',
      desc: 'Asian Style',
      price: '$33.99',
      stock: 350,
      dimensions: '4" x 4" x 4.5"',
      material: 'Paper',
      minOrder: 250,
      features: ['Wire Handle', 'Leak Resistant', 'Convenient'],
      caseQuantity: 350,
      ratings: 4.8,
      reviews: 56
    },
    {
      id: 's006',
      name: 'Combo Bowl 22oz',
      desc: 'With Sleeve',
      price: '$32.99',
      stock: 400,
      dimensions: '4.5" diameter x 3.5"',
      material: 'Paper + Sleeve',
      minOrder: 300,
      features: ['Heat Protection', 'Comfortable', 'Eco-Friendly'],
      caseQuantity: 400,
      ratings: 4.6,
      reviews: 45
    },
    {
      id: 's007',
      name: 'Mini Soup 8oz',
      desc: 'Sample Size',
      price: '$25.99',
      stock: 800,
      dimensions: '3" diameter x 2.5"',
      material: 'Paper',
      minOrder: 500,
      features: ['Perfect Portion', 'Economic', 'Stackable'],
      caseQuantity: 800,
      ratings: 4.3,
      reviews: 32
    },
    {
      id: 's008',
      name: 'Premium Bowl 28oz',
      desc: 'Insulated',
      price: '$37.99',
      stock: 200,
      dimensions: '5" diameter x 4"',
      material: 'Triple-wall Paper',
      minOrder: 150,
      features: ['Superior Insulation', 'Premium Look', 'Secure Fit'],
      caseQuantity: 200,
      ratings: 4.9,
      reviews: 62
    }
  ]
};

// Additional product metadata
export const productMetadata = {
  shipping: {
    freeThreshold: 500,
    standardRate: 25,
    expressRate: 45
  },
  bulkDiscounts: [
    { threshold: 1000, discount: 0.05 },
    { threshold: 5000, discount: 0.10 },
    { threshold: 10000, discount: 0.15 }
  ],
  warranties: {
    standard: '30 days',
    extended: '90 days'
  }
}; 
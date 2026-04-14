const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const User = require('./models/User');
const Gig = require('./models/Gig');
const Review = require('./models/Review');
const Order = require('./models/Order');
const Message = require('./models/Message');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Gig.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Message.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      { name: 'Alex Chen', email: 'alex@mit.edu', password: 'password123', role: 'seller', university: 'MIT', bio: 'Senior CS student passionate about building beautiful web experiences.', skills: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'MongoDB'], isVerified: true, rating: 4.9, reviewCount: 127 },
      { name: 'Sarah Kim', email: 'sarah@stanford.edu', password: 'password123', role: 'seller', university: 'Stanford', bio: 'Design student specializing in brand identity and UI/UX.', skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX'], isVerified: true, rating: 4.8, reviewCount: 89 },
      { name: 'James Wilson', email: 'james@harvard.edu', password: 'password123', role: 'seller', university: 'Harvard', bio: 'English major with a passion for creative and technical writing.', skills: ['Content Writing', 'SEO', 'Copywriting', 'Blog Posts'], isVerified: true, rating: 4.7, reviewCount: 203 },
      { name: 'Maya Patel', email: 'maya@ucla.edu', password: 'password123', role: 'seller', university: 'UCLA', bio: 'Film student specializing in video editing and motion graphics.', skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Motion Graphics'], isVerified: true, rating: 5.0, reviewCount: 56 },
      { name: 'David Park', email: 'david@cmu.edu', password: 'password123', role: 'seller', university: 'CMU', bio: 'CS student focused on mobile development and cross-platform apps.', skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'], isVerified: true, rating: 4.9, reviewCount: 34 },
      { name: 'John Doe', email: 'john@nyu.edu', password: 'password123', role: 'buyer', university: 'NYU', bio: 'Business student looking for talented freelancers.', skills: [], isVerified: true },
      { name: 'Emily Carter', email: 'emily@upenn.edu', password: 'password123', role: 'buyer', university: 'UPenn', bio: 'Startup founder seeking student talent.', skills: [], isVerified: true },
    ]);
    console.log(`Created ${users.length} users`);

    // Create gigs
    const gigs = await Gig.create([
      {
        seller: users[0]._id, title: 'I will build a modern React website with Tailwind CSS', description: 'Professional React development with modern design, responsive layouts, and clean code.',
        category: 'web-development', tags: ['react', 'tailwind', 'nextjs', 'responsive'],
        pricing: {
          basic: { title: 'Basic', description: 'Simple landing page', price: 50, deliveryDays: 3, features: ['1 Page', 'Responsive', 'Source Code'] },
          standard: { title: 'Standard', description: 'Multi-page website', price: 120, deliveryDays: 5, features: ['Up to 5 Pages', 'Responsive', 'Animations', 'SEO'] },
          premium: { title: 'Premium', description: 'Full-stack application', price: 250, deliveryDays: 10, features: ['Unlimited Pages', 'Full-Stack', 'Database', 'Auth', 'API'] },
        },
        rating: 4.9, reviewCount: 127, orderCount: 234, isActive: true,
      },
      {
        seller: users[1]._id, title: 'Professional logo and brand identity design', description: 'Creative logo design with full brand guidelines and multiple concepts.',
        category: 'design', tags: ['logo', 'branding', 'identity', 'design'],
        pricing: {
          basic: { title: 'Basic', description: '2 logo concepts', price: 35, deliveryDays: 2, features: ['2 Concepts', 'PNG/JPG', '1 Revision'] },
          standard: { title: 'Standard', description: '4 concepts + brand kit', price: 75, deliveryDays: 4, features: ['4 Concepts', 'All Formats', 'Brand Guide', '3 Revisions'] },
          premium: { title: 'Premium', description: 'Full brand identity', price: 150, deliveryDays: 7, features: ['6 Concepts', 'All Formats', 'Full Brand Identity', 'Stationery', 'Unlimited Revisions'] },
        },
        rating: 4.8, reviewCount: 89, orderCount: 156, isActive: true,
      },
      {
        seller: users[2]._id, title: 'SEO-optimized blog posts and article writing', description: 'High-quality, research-backed content that ranks well on search engines.',
        category: 'writing', tags: ['blog', 'seo', 'content', 'articles'],
        pricing: {
          basic: { title: 'Basic', description: '500-word article', price: 25, deliveryDays: 1, features: ['500 Words', 'SEO Optimized', '1 Revision'] },
          standard: { title: 'Standard', description: '1000-word article', price: 45, deliveryDays: 2, features: ['1000 Words', 'SEO Optimized', 'Images', '2 Revisions'] },
          premium: { title: 'Premium', description: '2000-word in-depth article', price: 80, deliveryDays: 3, features: ['2000 Words', 'SEO Optimized', 'Images', 'Research', 'Unlimited Revisions'] },
        },
        rating: 4.7, reviewCount: 203, orderCount: 312, isActive: true,
      },
      {
        seller: users[3]._id, title: 'Cinematic video editing with motion graphics', description: 'Professional video editing with color grading, transitions, and motion graphics.',
        category: 'video-editing', tags: ['video', 'editing', 'motion-graphics', 'cinematic'],
        pricing: {
          basic: { title: 'Basic', description: 'Simple edit up to 5 min', price: 75, deliveryDays: 3, features: ['Up to 5 min', 'Basic Editing', 'Color Correction'] },
          standard: { title: 'Standard', description: 'Professional edit up to 15 min', price: 150, deliveryDays: 5, features: ['Up to 15 min', 'Pro Editing', 'Color Grading', 'Transitions', 'Music'] },
          premium: { title: 'Premium', description: 'Cinematic edit with VFX', price: 300, deliveryDays: 7, features: ['Up to 30 min', 'Cinematic Edit', 'VFX', 'Motion Graphics', 'Sound Design'] },
        },
        rating: 5.0, reviewCount: 56, orderCount: 89, isActive: true,
      },
      {
        seller: users[4]._id, title: 'Full-stack mobile app development in React Native', description: 'Cross-platform mobile apps with beautiful UI and robust backend integration.',
        category: 'mobile-development', tags: ['react-native', 'mobile', 'ios', 'android'],
        pricing: {
          basic: { title: 'Basic', description: 'Simple app with 3 screens', price: 150, deliveryDays: 7, features: ['3 Screens', 'Basic UI', 'Navigation'] },
          standard: { title: 'Standard', description: 'Full app with API integration', price: 350, deliveryDays: 14, features: ['Up to 10 Screens', 'API Integration', 'Auth', 'Push Notifications'] },
          premium: { title: 'Premium', description: 'Complete app with backend', price: 600, deliveryDays: 21, features: ['Unlimited Screens', 'Full Backend', 'Database', 'Real-time', 'App Store Ready'] },
        },
        rating: 4.9, reviewCount: 34, orderCount: 52, isActive: true,
      },
    ]);
    console.log(`Created ${gigs.length} gigs`);

    // Create reviews
    const reviews = await Review.create([
      { user: users[5]._id, gig: gigs[0]._id, rating: 5, comment: 'Incredible work! Delivered a stunning website ahead of schedule.' },
      { user: users[6]._id, gig: gigs[0]._id, rating: 5, comment: 'Exactly what I needed. Modern design and clean code.' },
      { user: users[5]._id, gig: gigs[1]._id, rating: 5, comment: 'Beautiful logo design. Very creative and professional.' },
      { user: users[6]._id, gig: gigs[2]._id, rating: 4, comment: 'Great writing quality. Well-researched and SEO-friendly.' },
    ]);
    console.log(`Created ${reviews.length} reviews`);

    // Create orders
    const orders = await Order.create([
      { buyer: users[5]._id, seller: users[0]._id, gig: gigs[0]._id, tier: 'standard', price: 120, status: 'active', deliveryDate: new Date(Date.now() + 5 * 86400000) },
      { buyer: users[6]._id, seller: users[1]._id, gig: gigs[1]._id, tier: 'basic', price: 35, status: 'completed', deliveryDate: new Date(Date.now() - 2 * 86400000) },
      { buyer: users[5]._id, seller: users[2]._id, gig: gigs[2]._id, tier: 'standard', price: 45, status: 'pending', deliveryDate: new Date(Date.now() + 2 * 86400000) },
    ]);
    console.log(`Created ${orders.length} orders`);

    // Create messages
    const convId = [users[5]._id, users[0]._id].sort().join('_');
    await Message.create([
      { conversationId: convId, sender: users[5]._id, receiver: users[0]._id, text: 'Hi! I need a React website for my startup.' },
      { conversationId: convId, sender: users[0]._id, receiver: users[5]._id, text: 'Sure! I\'d love to help. Can you share more details about your project?' },
      { conversationId: convId, sender: users[5]._id, receiver: users[0]._id, text: 'It\'s a SaaS dashboard with charts and user management.' },
      { conversationId: convId, sender: users[0]._id, receiver: users[5]._id, text: 'I can definitely build that. I recommend the Standard tier for this scope.' },
    ]);
    console.log('Created sample messages');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('  Seller: alex@mit.edu / password123');
    console.log('  Buyer:  john@nyu.edu / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();

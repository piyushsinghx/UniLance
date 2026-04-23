const Order = require('../models/Order');
const Gig = require('../models/Gig');

const getIsoWeekInfo = (date) => {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);

  return {
    year: utcDate.getUTCFullYear(),
    week,
  };
};

const getMonthSeries = (aggregateRows) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const result = [];

  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const found = aggregateRows.find((entry) => entry._id === key);

    result.push({
      label: months[date.getMonth()],
      earnings: found ? found.earnings : 0,
      orders: found ? found.orders : 0,
    });
  }

  return result;
};

const getWeekSeries = (aggregateRows) => {
  const result = [];
  const now = new Date();

  for (let i = 7; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - (i * 7));

    const { year, week } = getIsoWeekInfo(date);
    const key = `${year}-W${String(week).padStart(2, '0')}`;
    const found = aggregateRows.find((entry) => entry._id === key);

    result.push({
      label: `W${week}`,
      earnings: found ? found.earnings : 0,
      orders: found ? found.orders : 0,
    });
  }

  return result;
};

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    const orderQuery = role === 'seller' ? { seller: userId } : { buyer: userId };
    const orders = await Order.find(orderQuery);

    const completedOrders = orders.filter((order) => order.status === 'completed');
    const activeOrders = orders.filter((order) => ['active', 'delivered', 'revision'].includes(order.status));
    const pendingOrders = orders.filter((order) => order.status === 'pending');
    const totalEarnings = completedOrders.reduce((sum, order) => sum + order.price, 0);

    let totalViews = 0;
    let conversionRate = 0;

    if (role === 'seller') {
      const gigs = await Gig.find({ seller: userId });
      totalViews = gigs.reduce((sum, gig) => sum + (gig.viewCount || 0), 0);
      const totalOrders = gigs.reduce((sum, gig) => sum + (gig.orderCount || 0), 0);
      conversionRate = totalViews > 0 ? Math.round((totalOrders / totalViews) * 1000) / 10 : 0;
    }

    res.json({
      totalEarnings,
      activeOrders: activeOrders.length,
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
      totalOrders: orders.length,
      avgRating: req.user.rating || 0,
      totalViews,
      conversionRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get earnings over time
// @route   GET /api/analytics/earnings
const getEarningsData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = 'monthly' } = req.query;

    const matchStage = {
      seller: userId,
      status: 'completed',
      completedAt: { $exists: true },
    };

    const aggregateRows = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: period === 'weekly'
            ? {
                $concat: [
                  { $toString: { $isoWeekYear: '$completedAt' } },
                  '-W',
                  {
                    $cond: [
                      { $lt: [{ $isoWeek: '$completedAt' }, 10] },
                      { $concat: ['0', { $toString: { $isoWeek: '$completedAt' } }] },
                      { $toString: { $isoWeek: '$completedAt' } },
                    ],
                  },
                ],
              }
            : {
                $concat: [
                  { $toString: { $year: '$completedAt' } },
                  '-',
                  {
                    $cond: [
                      { $lt: [{ $month: '$completedAt' }, 10] },
                      { $concat: ['0', { $toString: { $month: '$completedAt' } }] },
                      { $toString: { $month: '$completedAt' } },
                    ],
                  },
                ],
              },
          earnings: { $sum: '$price' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const result = period === 'weekly' ? getWeekSeries(aggregateRows) : getMonthSeries(aggregateRows);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get gig performance analytics
// @route   GET /api/analytics/gig-performance
const getGigPerformance = async (req, res) => {
  try {
    const gigs = await Gig.find({ seller: req.user._id })
      .select('title pricing rating reviewCount orderCount viewCount isActive')
      .sort({ orderCount: -1 });

    const performance = gigs.map((gig) => ({
      _id: gig._id,
      title: gig.title,
      price: gig.pricing.basic.price,
      rating: gig.rating,
      reviewCount: gig.reviewCount,
      orderCount: gig.orderCount,
      viewCount: gig.viewCount || 0,
      conversionRate: gig.viewCount > 0 ? Math.round((gig.orderCount / gig.viewCount) * 1000) / 10 : 0,
      isActive: gig.isActive,
    }));

    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getEarningsData, getGigPerformance };

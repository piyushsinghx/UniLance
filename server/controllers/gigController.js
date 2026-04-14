const Gig = require('../models/Gig');

// @desc    Get all gigs with filters
// @route   GET /api/gigs
const getGigs = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, rating, search, sort, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (rating) query.rating = { $gte: Number(rating) };
    if (minPrice || maxPrice) {
      query['pricing.basic.price'] = {};
      if (minPrice) query['pricing.basic.price'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.basic.price'].$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { 'pricing.basic.price': 1 };
    if (sort === 'price-high') sortOption = { 'pricing.basic.price': -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'popular') sortOption = { orderCount: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Gig.countDocuments(query);
    const gigs = await Gig.find(query)
      .populate('seller', 'name avatar university rating')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      gigs,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('seller', 'name avatar university bio skills rating reviewCount createdAt');
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a gig
// @route   POST /api/gigs
const createGig = async (req, res) => {
  try {
    const gig = await Gig.create({
      ...req.body,
      seller: req.user._id,
    });
    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a gig
// @route   PUT /api/gigs/:id
const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    if (gig.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Gig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a gig
// @route   DELETE /api/gigs/:id
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    if (gig.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await gig.deleteOne();
    res.json({ message: 'Gig removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get gigs by seller
// @route   GET /api/gigs/seller/:sellerId
const getGigsBySeller = async (req, res) => {
  try {
    const gigs = await Gig.find({ seller: req.params.sellerId, isActive: true })
      .populate('seller', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGigs, getGigById, createGig, updateGig, deleteGig, getGigsBySeller };

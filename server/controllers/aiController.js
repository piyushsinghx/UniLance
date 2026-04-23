const Gig = require('../models/Gig');
const User = require('../models/User');

// --- AI GIG RECOMMENDATION ENGINE ---
// @desc    Get recommended gigs for user based on search history, skills, behavior
// @route   GET /api/ai/recommendations
const getRecommendedGigs = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('+searchHistory');

    // Build affinity scores from search history and skills
    const searchTerms = user.searchHistory || [];
    const skills = user.skills || [];
    const affinityTerms = [...new Set([...searchTerms.slice(-20), ...skills])];

    let gigs;
    if (affinityTerms.length > 0) {
      // Build a regex pattern from user interests
      const pattern = affinityTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      gigs = await Gig.find({
        isActive: true,
        seller: { $ne: userId },
        $or: [
          { title: { $regex: pattern, $options: 'i' } },
          { description: { $regex: pattern, $options: 'i' } },
          { tags: { $in: affinityTerms.map((t) => new RegExp(t, 'i')) } },
          { category: { $in: affinityTerms.map((t) => t.toLowerCase()) } },
        ],
      })
        .populate('seller', 'name avatar university rating isOnline')
        .sort({ rating: -1, orderCount: -1 })
        .limit(8);
    }

    // Fallback: just top-rated gigs
    if (!gigs || gigs.length < 4) {
      gigs = await Gig.find({ isActive: true, seller: { $ne: userId } })
        .populate('seller', 'name avatar university rating isOnline')
        .sort({ rating: -1, orderCount: -1 })
        .limit(8);
    }

    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- AI DESCRIPTION GENERATOR ---
// @desc    Generate a gig description from title and category
// @route   POST /api/ai/generate-description
const generateDescription = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const categoryDescriptions = {
      'web-development': {
        intro: 'Are you looking for a professional, high-quality web development service?',
        deliverables: ['Clean, well-structured code', 'Responsive design for all devices', 'Cross-browser compatibility', 'SEO-optimized structure', 'Modern UI/UX implementation', 'Performance optimization', 'Source code with documentation'],
        techStack: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'MongoDB'],
      },
      'design': {
        intro: 'Need stunning, eye-catching designs that make your brand stand out?',
        deliverables: ['High-resolution design files', 'Multiple design concepts', 'Unlimited color variations', 'Source files (PSD/AI/Figma)', 'Print-ready and web-optimized formats', 'Brand guidelines document'],
        techStack: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Canva Pro'],
      },
      'writing': {
        intro: 'Looking for compelling, well-researched content that engages your audience?',
        deliverables: ['100% original content', 'SEO-optimized writing', 'Thorough research and fact-checking', 'Proper formatting and structure', 'Plagiarism-free guarantee', 'Revisions included'],
        techStack: ['Grammarly', 'Hemingway', 'SEMrush', 'Google Docs'],
      },
      'video-editing': {
        intro: 'Want professional video editing that brings your vision to life?',
        deliverables: ['Professional color grading', 'Smooth transitions and effects', 'Background music and sound design', 'Motion graphics and titles', 'Multiple export formats', 'Raw project files'],
        techStack: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro'],
      },
      'mobile-development': {
        intro: 'Need a sleek, performant mobile application for your business?',
        deliverables: ['Native-quality mobile app', 'Cross-platform compatibility', 'Push notification setup', 'API integration', 'App store deployment assistance', 'Source code and documentation'],
        techStack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      },
      'data-science': {
        intro: 'Need data-driven insights and powerful analytics solutions?',
        deliverables: ['Data cleaning and preprocessing', 'Statistical analysis', 'Interactive visualizations', 'Machine learning models', 'Detailed reports and insights', 'Jupyter notebooks'],
        techStack: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'Tableau'],
      },
      'marketing': {
        intro: 'Ready to boost your brand presence and drive real results?',
        deliverables: ['Comprehensive marketing strategy', 'Social media content calendar', 'Performance analytics reports', 'Target audience analysis', 'Competitor research', 'Growth recommendations'],
        techStack: ['Google Analytics', 'Meta Ads Manager', 'Hootsuite', 'Mailchimp'],
      },
    };

    const cat = categoryDescriptions[category] || categoryDescriptions['web-development'];
    const titleWords = title.toLowerCase().split(' ').filter((w) => w.length > 3);

    const description = `${cat.intro}

I will ${title.toLowerCase().startsWith('i will') ? title.substring(7) : title.toLowerCase()}. With a strong focus on quality and attention to detail, I deliver work that exceeds expectations.

**What you'll get:**
${cat.deliverables.map((d) => `✅ ${d}`).join('\n')}

**Tools & Technologies:**
${cat.techStack.join(' • ')}

**Why choose me?**
🎓 Verified university student with real-world project experience
⭐ Committed to quality and timely delivery
💬 Excellent communication throughout the project
🔄 Revisions included to ensure your satisfaction

Let's collaborate and create something amazing! Feel free to message me with your requirements.`;

    res.json({ description });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- AI PRICING SUGGESTION ---
// @desc    Suggest pricing based on similar gigs
// @route   POST /api/ai/suggest-pricing
const suggestPricing = async (req, res) => {
  try {
    const { category, title } = req.body;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Find similar gigs in the same category
    const similarGigs = await Gig.find({ category, isActive: true })
      .select('pricing rating orderCount')
      .limit(50);

    if (similarGigs.length === 0) {
      // Default pricing by category
      const defaults = {
        'web-development': { basic: 2000, standard: 5000, premium: 12000 },
        'design': { basic: 1000, standard: 3000, premium: 8000 },
        'writing': { basic: 500, standard: 1500, premium: 4000 },
        'video-editing': { basic: 1500, standard: 4000, premium: 10000 },
        'mobile-development': { basic: 3000, standard: 8000, premium: 20000 },
        'data-science': { basic: 2000, standard: 5000, premium: 15000 },
        'marketing': { basic: 1000, standard: 3000, premium: 8000 },
      };
      const d = defaults[category] || defaults['web-development'];
      return res.json({
        recommended: d,
        message: `Recommended pricing for ${category} gigs. Based on market defaults.`,
        sampleSize: 0,
      });
    }

    // Calculate percentiles
    const basicPrices = similarGigs.map((g) => g.pricing.basic.price).sort((a, b) => a - b);
    const standardPrices = similarGigs.filter((g) => g.pricing.standard.price > 0).map((g) => g.pricing.standard.price).sort((a, b) => a - b);
    const premiumPrices = similarGigs.filter((g) => g.pricing.premium.price > 0).map((g) => g.pricing.premium.price).sort((a, b) => a - b);

    const median = (arr) => {
      if (arr.length === 0) return 0;
      const mid = Math.floor(arr.length / 2);
      return arr.length % 2 ? arr[mid] : Math.round((arr[mid - 1] + arr[mid]) / 2);
    };

    const recommended = {
      basic: median(basicPrices),
      standard: standardPrices.length > 0 ? median(standardPrices) : Math.round(median(basicPrices) * 2.5),
      premium: premiumPrices.length > 0 ? median(premiumPrices) : Math.round(median(basicPrices) * 5),
    };

    const priceRange = {
      basic: { min: basicPrices[0], max: basicPrices[basicPrices.length - 1] },
      standard: standardPrices.length > 0 ? { min: standardPrices[0], max: standardPrices[standardPrices.length - 1] } : null,
      premium: premiumPrices.length > 0 ? { min: premiumPrices[0], max: premiumPrices[premiumPrices.length - 1] } : null,
    };

    res.json({
      recommended,
      priceRange,
      message: `Based on ${similarGigs.length} similar gigs in ${category}`,
      sampleSize: similarGigs.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track search history for recommendations
// @route   POST /api/ai/track-search
const trackSearch = async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) return res.json({ ok: true });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { searchHistory: { $each: [term], $slice: -30 } },
    });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendedGigs, generateDescription, suggestPricing, trackSearch };

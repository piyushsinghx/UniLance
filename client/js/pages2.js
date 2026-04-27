/* ===== UniLance — Additional Pages ===== */

Object.assign(Pages, {

  async renderGigDetails(app, params) {
    app.innerHTML = `
      <div class="container py-8 animate-fade-in">
        <div id="gig-details-content">
          ${renderSkeletonCards(1)}
        </div>
      </div>
    `;

    try {
      const id = params.id;
      const res = await Api.getGigById(id);
      const gig = res.data;
      const user = Auth.user;
      const isOwner = user && user._id === gig.seller?._id;

      const imgHtml = gig.images?.length > 0 
        ? `<img src="${gig.images[0]}" alt="Gig Cover" class="gig-detail-img border-radius" style="width:100%; height:400px; object-fit:cover; margin-bottom:2rem;" />`
        : `<div class="gig-detail-img border-radius flex items-center justify-center bg-secondary" style="height:400px; margin-bottom:2rem;"><span class="text-muted">No Image Available</span></div>`;

      document.getElementById('gig-details-content').innerHTML = `
        <div class="grid-3">
          <div class="gig-main-col" style="grid-column: span 2;">
            <div class="mb-4 flex items-center gap-2 text-sm text-secondary">
              <a href="#/gigs" class="hover-primary">Gigs</a> > 
              <span class="capitalize">${gig.category}</span>
            </div>
            
            <h1 class="mb-6">${escapeHtml(gig.title)}</h1>
            
            <div class="seller-profile-banner flex items-center gap-4 mb-6 p-4 glass border-radius">
              <div class="avatar-circle" style="width:48px;height:48px;font-size:1.25rem;">
                ${gig.seller?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p class="font-bold">${escapeHtml(gig.seller?.name || 'Unknown Seller')}</p>
                <div class="flex items-center gap-2 text-sm text-secondary">
                  <span class="flex items-center gap-1">${Icons.starFilled} ${(gig.rating||0).toFixed(1)}</span>
                  <span>|</span>
                  <span>${gig.reviewCount || 0} Reviews</span>
                </div>
              </div>
            </div>

            ${imgHtml}

            <div class="gig-description glass p-6 border-radius mb-8">
              <h2 class="mb-4">About This Gig</h2>
              <div class="text-secondary" style="white-space: pre-line;">${escapeHtml(gig.description)}</div>
            </div>
          </div>

          <div class="gig-sidebar">
            <div class="pricing-card glass p-6 border-radius sticky" style="top: 80px;">
              <h3 class="mb-2">Basic Package</h3>
              <p class="text-3xl font-bold text-primary mb-4">${formatPrice(gig.pricing?.basic?.price || 0)}</p>
              
              <p class="text-sm text-secondary mb-6">${escapeHtml(gig.pricing?.basic?.description || 'Standard service offering.')}</p>
              
              <div class="flex flex-col gap-3 mb-6 font-bold text-sm">
                <span class="flex items-center gap-2">${Icons.clock} ${gig.pricing?.basic?.deliveryTime || 3} Days Delivery</span>
                <span class="flex items-center gap-2">${Icons.refreshCw} ${gig.pricing?.basic?.revisions || 1} Revisions</span>
              </div>

              ${isOwner 
                ? `<button class="btn-secondary btn-full">Edit Your Gig</button>`
                : `<button class="btn-primary btn-full mb-3" id="checkout-btn">Continue to Checkout</button>
                   <button class="btn-secondary btn-full" id="contact-btn">Contact Seller</button>`
              }
            </div>
          </div>
        </div>
      `;

      if (!isOwner) {
        document.getElementById('checkout-btn')?.addEventListener('click', () => {
          if (!user) return Router.navigate('/login');
          Toast.info('Initiating Razorpay checkout...');
          // Simplified Razorpay simulation for vanilla demo
          setTimeout(() => {
            Toast.success('Order placed successfully!');
            Router.navigate('/dashboard');
          }, 1500);
        });

        document.getElementById('contact-btn')?.addEventListener('click', () => {
          if (!user) return Router.navigate('/login');
          Router.navigate('/messages');
        });
      }

    } catch(e) {
      document.getElementById('gig-details-content').innerHTML = `<div class="error-state text-center py-20"><h1>Gig Not Found</h1><p class="text-secondary mb-6">The gig you are looking for does not exist or was removed.</p><a href="#/gigs" class="btn-primary">Back to Gigs</a></div>`;
    }
  },

  renderCategories(app) {
    const cats = [
      { id: 'web-development', title: 'Web Development', icon: Icons.code, color: 'from-blue-500 to-indigo-600', desc: 'Custom websites, web apps, and CMS' },
      { id: 'design', title: 'Design', icon: Icons.palette, color: 'from-pink-500 to-rose-600', desc: 'Logos, UI/UX, and branding' },
      { id: 'writing', title: 'Writing', icon: Icons.penTool, color: 'from-emerald-500 to-teal-600', desc: 'Articles, copywriting, and translation' },
      { id: 'video-editing', title: 'Video Editing', icon: Icons.video, color: 'from-purple-500 to-violet-600', desc: 'YouTube editing, reels, and motion' },
      { id: 'data-science', title: 'Data Science', icon: Icons.barChart, color: 'from-cyan-500 to-blue-600', desc: 'Machine learning, scripts, and scraping' },
      { id: 'marketing', title: 'Marketing', icon: Icons.megaphone, color: 'from-yellow-500 to-orange-600', desc: 'SEO, social media, and paid ads' },
    ];

    app.innerHTML = `
      <div class="container py-20 animate-fade-in">
        <div class="text-center mb-16">
          <h1>Explore <span class="gradient-text">Categories</span></h1>
          <p class="text-secondary max-w-2xl mx-auto text-lg">Find talented student freelancers specialized in the exact skills your project needs.</p>
        </div>
        <div class="grid-3">
          ${cats.map(c => `
            <a href="#/gigs?category=${c.id}" class="glass p-8 border-radius card-hover flex flex-col items-center text-center">
              <div class="w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg" style="background: linear-gradient(135deg, var(--color-primary), var(--color-accent))">
                ${c.icon}
              </div>
              <h2 class="text-xl mb-2">${c.title}</h2>
              <p class="text-secondary text-sm">${c.desc}</p>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderAbout(app) {
    app.innerHTML = `
      <div class="container py-20 animate-fade-in">
        <div class="text-center max-w-3xl mx-auto">
          <div class="trust-badge mb-6">${Icons.award} Student First</div>
          <h1 class="mb-6">Empowering the Next Generation of <span class="gradient-text">Freelancers</span></h1>
          <p class="text-lg text-secondary mb-12">UniLance is a platform built by students, for students. We're bridging the gap between classroom learning and real-world experience.</p>
        </div>
        <div class="grid-3 mb-20">
          <div class="glass p-8 border-radius text-center">
            <div class="text-4xl mb-4">🎓</div>
            <h3 class="mb-2">Student First</h3>
            <p class="text-sm text-secondary">Designed specifically around the needs of university schedules and skill levels.</p>
          </div>
          <div class="glass p-8 border-radius text-center">
            <div class="text-4xl mb-4">💼</div>
            <h3 class="mb-2">Real Experience</h3>
            <p class="text-sm text-secondary">Working with real clients on real projects beats textbook theory every time.</p>
          </div>
          <div class="glass p-8 border-radius text-center">
            <div class="text-4xl mb-4">🤝</div>
            <h3 class="mb-2">Community Driven</h3>
            <p class="text-sm text-secondary">A supportive peer-to-peer network where students help each other grow.</p>
          </div>
        </div>
        <div class="glass p-12 border-radius text-center bg-secondary">
          <h2 class="mb-4">Join Our Journey</h2>
          <p class="text-secondary mb-8 max-w-2xl mx-auto">Whether you're a student looking to start your freelance career, or a business looking for fresh talent, there's a place for you here.</p>
          <a href="#/register" class="btn-primary">Get Started Today</a>
        </div>
      </div>
    `;
  },

  renderPricing(app) {
    app.innerHTML = `
      <div class="container py-20 animate-fade-in">
        <div class="text-center mb-16">
          <div class="trust-badge mb-6">${Icons.sparkles} Transparent. Fair. Affordable.</div>
          <h1>Simple, <span class="gradient-text">Student-Friendly</span> Pricing</h1>
          <p class="text-secondary max-w-2xl mx-auto text-lg">No subscriptions. No hidden fees. Pay only when you order. Every gig offers three transparent pricing tiers to match any budget.</p>
        </div>
        
        <div class="grid-3">
          <div class="glass p-8 border-radius flex flex-col">
            <h3 class="text-2xl mb-2">Basic</h3>
            <p class="text-sm text-secondary mb-6">Perfect for quick tasks</p>
            <div class="text-3xl font-bold mb-8">₹500+</div>
            <ul class="flex-1 flex flex-col gap-4 text-sm text-secondary mb-8">
              <li class="flex gap-2 items-center"><span class="text-success">${Icons.check}</span> Single deliverable</li>
              <li class="flex gap-2 items-center"><span class="text-success">${Icons.check}</span> 5-7 day delivery</li>
              <li class="flex gap-2 items-center"><span class="text-success">${Icons.check}</span> 1 revision round</li>
            </ul>
            <a href="#/gigs" class="btn-secondary btn-full text-center">Browse Gigs</a>
          </div>

          <div class="glass p-8 border-radius flex flex-col" style="border: 2px solid var(--color-primary); position: relative; transform: scale(1.05); z-index: 10;">
            <div class="absolute" style="top: -12px; left: 50%; transform: translateX(-50%); background: var(--color-primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">Most Popular</div>
            <h3 class="text-2xl mb-2">Standard</h3>
            <p class="text-sm text-secondary mb-6">Most popular choice</p>
            <div class="text-3xl font-bold mb-8">₹2,000+</div>
            <ul class="flex-1 flex flex-col gap-4 text-sm text-secondary mb-8">
              <li class="flex gap-2 items-center"><span class="text-success">${Icons.check}</span> Complete project delivery</li>
              <li class="flex gap-2 items-center"><span class="text-success">${Icons.check}</span> 3-5 day delivery</li>
              <li class="flex gap-2 items-center"><span class="text-success">${Icons.check}</span> 3 revision rounds</li>
              <li class="flex gap-2 items-center"><span class="text-success">${Icons.check}</span> Source files included</li>
            </ul>
            <a href="#/gigs" class="btn-primary btn-full text-center">Browse Gigs</a>
          </div>

          <div class="glass p-8 border-radius flex flex-col">
            <h3 class="text-2xl mb-2">Premium</h3>
            <p class="text-sm text-secondary mb-6">Full-service experience</p>
            <div class="text-3xl font-bold mb-8">₹8,000+</div>
            <ul class="flex-1 flex flex-col gap-4 text-sm text-secondary mb-8">
              <li class="flex gap-2 items-center"><span class="text-success">${Icons.check}</span> End-to-end management</li>
              <li class="flex gap-2 items-center"><span class="text-success">${Icons.check}</span> 1-3 day express delivery</li>
              <li class="flex gap-2 items-center"><span class="text-success">${Icons.check}</span> Unlimited revisions</li>
            </ul>
            <a href="#/gigs" class="btn-secondary btn-full text-center">Browse Gigs</a>
          </div>
        </div>
      </div>
    `;
  },

  renderHowItWorks(app) {
    app.innerHTML = `
      <div class="container py-20 animate-fade-in">
        <div class="text-center mb-16">
          <h1>How <span class="gradient-text">UniLance</span> Works</h1>
          <p class="text-secondary max-w-2xl mx-auto text-lg">From discovering talent to completing your project — our streamlined workflow makes freelancing simple for university students.</p>
        </div>

        <div class="flex flex-col gap-12 max-w-4xl mx-auto">
          <div class="glass p-8 border-radius flex gap-6 items-center">
            <div class="w-16 h-16 rounded-xl flex items-center justify-center text-white flex-shrink-0" style="background: linear-gradient(135deg, #3B82F6, #4F46E5); font-size: 24px;">1</div>
            <div>
              <h3 class="text-xl mb-2">Browse & Discover</h3>
              <p class="text-secondary">Explore thousands of gigs across categories like web development, design, writing, and more. Use AI-powered recommendations to find the perfect match for your project.</p>
            </div>
          </div>
          <div class="glass p-8 border-radius flex gap-6 items-center flex-row-reverse text-right">
            <div class="w-16 h-16 rounded-xl flex items-center justify-center text-white flex-shrink-0" style="background: linear-gradient(135deg, #8B5CF6, #A855F7); font-size: 24px;">2</div>
            <div>
              <h3 class="text-xl mb-2">Place Your Order</h3>
              <p class="text-secondary">Choose the package tier (Basic, Standard, or Premium) that fits your needs. Share your project requirements and complete payment securely through Razorpay.</p>
            </div>
          </div>
          <div class="glass p-8 border-radius flex gap-6 items-center">
            <div class="w-16 h-16 rounded-xl flex items-center justify-center text-white flex-shrink-0" style="background: linear-gradient(135deg, #10B981, #059669); font-size: 24px;">3</div>
            <div>
              <h3 class="text-xl mb-2">Collaborate & Track</h3>
              <p class="text-secondary">Communicate with your freelancer in real-time through our built-in messaging system. Track order progress with live status updates.</p>
            </div>
          </div>
          <div class="glass p-8 border-radius flex gap-6 items-center flex-row-reverse text-right">
            <div class="w-16 h-16 rounded-xl flex items-center justify-center text-white flex-shrink-0" style="background: linear-gradient(135deg, #F59E0B, #D97706); font-size: 24px;">4</div>
            <div>
              <h3 class="text-xl mb-2">Receive & Review</h3>
              <p class="text-secondary">Get your completed work delivered on time. Review the delivery, request revisions if needed, or accept and leave a rating to help the community.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderProfile(app) {
    if (!Auth.user) return Router.navigate('/login');
    const u = Auth.user;
    
    app.innerHTML = `
      <div class="container py-12 animate-fade-in">
        <div class="glass border-radius overflow-hidden">
          <div class="bg-primary" style="height: 120px; background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))"></div>
          <div class="px-8 pb-8" style="position: relative;">
            <div class="avatar-circle shadow-lg" style="width:100px; height:100px; font-size:2.5rem; position:absolute; top:-50px; border:4px solid var(--bg-card)">
              ${u.name?.charAt(0) || 'U'}
            </div>
            
            <div class="flex justify-between items-end mt-16 mb-8">
              <div>
                <h1 class="mb-1">${escapeHtml(u.name)}</h1>
                <p class="text-secondary flex items-center gap-2">${Icons.mail} ${escapeHtml(u.email)}</p>
                <p class="text-secondary flex items-center gap-2 mt-1">${Icons.graduationCap} ${escapeHtml(u.university || 'University Student')}</p>
              </div>
              <button class="btn-secondary">Edit Profile</button>
            </div>

            <div class="grid-2">
              <div class="glass p-6 border-radius">
                <h3 class="mb-4">Account Details</h3>
                <div class="flex flex-col gap-3 text-sm">
                  <div class="flex justify-between border-b pb-2"><span class="text-secondary">Role</span> <span class="capitalize font-bold">${u.role}</span></div>
                  <div class="flex justify-between border-b pb-2"><span class="text-secondary">Joined</span> <span class="font-bold">${formatDate(u.createdAt || Date.now())}</span></div>
                  <div class="flex justify-between border-b pb-2"><span class="text-secondary">Status</span> <span class="text-success font-bold">Active & Verified</span></div>
                </div>
              </div>
              
              <div class="glass p-6 border-radius">
                <h3 class="mb-4">My Skills</h3>
                <div class="flex flex-wrap gap-2">
                  <span class="badge badge-success">React</span>
                  <span class="badge badge-success">JavaScript</span>
                  <span class="badge badge-success">HTML/CSS</span>
                  <span class="badge badge-success">Figma</span>
                </div>
                <button class="btn-text mt-4 text-sm">+ Add more skills</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderMessages(app) {
    if (!Auth.user) return Router.navigate('/login');
    
    app.innerHTML = `
      <div class="container py-8 animate-fade-in flex" style="height: calc(100vh - 64px); gap: 1.5rem;">
        <div class="glass border-radius flex flex-col" style="width: 350px;">
          <div class="p-4 border-b">
            <h2 class="text-lg">Inbox</h2>
          </div>
          <div class="flex-1 overflow-y-auto p-2" id="msg-conversations">
            <div class="p-3 border-radius mb-2 bg-hover cursor-pointer flex gap-3 items-center">
              <div class="avatar-circle" style="width:40px;height:40px;">S</div>
              <div class="flex-1 overflow-hidden">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-sm">Support Team</span>
                  <span class="text-xs text-secondary">10:45 AM</span>
                </div>
                <p class="text-xs text-secondary truncate">Welcome to UniLance! Let us know if...</p>
              </div>
            </div>
            <!-- More conversations here -->
          </div>
        </div>

        <div class="glass border-radius flex-1 flex flex-col">
          <div class="p-4 border-b flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="avatar-circle" style="width:40px;height:40px;">S</div>
              <div>
                <p class="font-bold">Support Team</p>
                <p class="text-xs text-success">Online</p>
              </div>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            <div class="flex gap-3">
              <div class="avatar-circle" style="width:32px;height:32px;font-size:12px;">S</div>
              <div class="bg-secondary p-3 border-radius text-sm" style="border-top-left-radius: 0;">
                <p>Welcome to UniLance! We're thrilled to have you onboard.</p>
              </div>
            </div>
          </div>
          <div class="p-4 border-t">
            <form class="flex gap-2" onsubmit="event.preventDefault(); Toast.info('Messaging backend disconnected for vanilla demo.');">
              <input type="text" class="flex-1" placeholder="Type your message..." style="padding:0.75rem 1rem; border-radius:1rem; border:1px solid var(--border); background:var(--bg-secondary); color:var(--text-primary); outline:none;" />
              <button class="btn-primary" style="border-radius:1rem;">Send</button>
            </form>
          </div>
        </div>
      </div>
    `;
  }
});

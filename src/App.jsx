import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import Contact from "./pages/Contact";
import Design from "./pages/Design";
import AdminUpload from "./pages/AdminUpload";
import Donate from "./pages/Donate";

/* ================= COMPONENTS ================= */

/* HOME LAYOUT COMPONENT */
function HomeLayout() {
  const services = [
    { title: 'Architecture Designs', desc: 'Modern, creative, and professional building plans designed by experienced architects.' },
    { title: 'Sell Building Plans', desc: 'Upload and sell your architecture designs securely to clients around the world.' },
    { title: 'Advertise Projects', desc: 'Promote construction companies, properties, and architecture services with premium exposure.' },
    { title: 'Smart Search', desc: 'Find modern house plans, office designs, apartments, and more instantly.' },
    { title: 'Personal Dashboard', desc: 'Track your sales, messages, and client interactions easily.' },
    { title: 'Secure Payments', desc: 'Easy and safe checkout for clients, instant payouts for creators.' }
  ];

  const testimonials = [
    { name: 'Sarah K.', role: 'Architect', text: "NapoleonPlans helped me showcase my designs to a global audience. I've sold over 30 plans in just two months!" },
    { name: 'James R.', role: 'Property Developer', text: 'Smart search and premium advertising options are unmatched. Highly recommended for construction businesses.' },
    { name: 'Maria L.', role: 'Homeowner', text: 'Found the perfect villa design. Easy purchase & download.' },
  ];

  const stats = [
    { value: '875+', label: 'Designs Uploaded' },
    { value: '210+', label: 'Professional Architects' },
    { value: '70K+', label: 'Happy Clients' },
    { value: '4.9', label: 'Average Rating' },
  ];

  const [designs, setDesigns] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost/napoleonplans/api/get_designs.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDesigns(data.designs);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {/* HERO + Search */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-market">Modern Architecture Marketplace</p>
          <h1>Discover & Sell Amazing Building Designs</h1>
          <p className="hero-sub">NapoleonPlans is a modern platform where architects, engineers, and property developers can upload, advertise, and sell premium architecture plans to clients worldwide.</p>
          <div className="hero-search">
            <input type="text" placeholder="Search designs, architects..." />
            <button className="nav-btn-black">Search</button>
          </div>
          <div className="hero-buttons">
            <Link to="/marketplace">
              <button className="nav-btn">Explore Designs</button>
            </Link>
            <button className="nav-btn border">Start Selling</button>
          </div>
        </div>
        <div className="hero-img">
          <img src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200&auto=format&fit=crop" alt="Architecture" />
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats-row">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <h3 className="stat-number">{s.value}</h3>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services">
        <div className="section-title">
          <p>Our Services</p>
          <h2>Professional Features For Architects</h2>
        </div>
        <div className="services-list">
          {services.map((service) => (
            <div key={service.title} className="services-card">
              <div className="icon-bg">
                <svg viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED DESIGNS */}
      <section className="featured-designs">
        <div className="section-title">
          <p>Featured</p>
          <h2>Latest Designs</h2>
        </div>
        <div className="featured-row">
          {designs.length === 0 ? (
            <p>No designs available yet.</p>
          ) : (
            designs.map((design) => (
              <div key={design.id} className="featured-card">
                <img
                  src={`http://localhost/napoleonplans/uploads/${design.image}`}
                  alt={design.title}
                />
                <div className="featured-info">
                  <h3>{design.title}</h3>
                  <p>{design.description}</p>
                  <p><strong>{design.price} MWK</strong></p>
                  <Link to="/contact">
                    <button className="nav-btn">Contact Us About This Design</button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="section-title">
          <p>Testimonials</p>
          <h2>What Professionals Say</h2>
        </div>
        <div className="testimonial-list">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar">{t.name.charAt(0)}</div>
                <div>
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
              <p>"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <div className="about-img">
          <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" alt="Office" />
        </div>
        <div>
          <p className="about-highlight">About NapoleonPlans</p>
          <h2>A Professional Platform For Modern Construction Ideas</h2>
          <p>We connect architects, construction companies, and clients through a modern digital platform that makes it easier to discover, advertise, and purchase professional building plans.</p>
          <div className="about-stats">
            <div className="about-stat">
              <h3>875+</h3>
              <p>Designs Uploaded</p>
            </div>
            <div className="about-stat">
              <h3>210+</h3>
              <p>Professional Architects</p>
            </div>
          </div>
          <button className="nav-btn">Learn More</button>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq">
        <div className="section-title">
          <p>FAQ</p>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>How do I upload a building plan?</summary>
            <p>Click "Start Selling" or go to Admin Upload, fill in the design details with images and pricing, and publish to the marketplace.</p>
          </details>
          <details>
            <summary>Is my data secure?</summary>
            <p>Yes! We use trusted payment processors and encrypted channels for all transactions and user data.</p>
          </details>
          <details>
            <summary>How are designs priced?</summary>
            <p>You set your own prices. We display in MWK and help you reach clients worldwide.</p>
          </details>
          <details>
            <summary>How do I get paid?</summary>
            <p>Payments are processed instantly to your account after each sale. Easy and transparent commission structure.</p>
          </details>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-content">
          <div>
            <h2>NapoleonPlans</h2>
            <p>Modern architecture marketplace for buying, selling, and advertising premium building designs.</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/designs">Designs</Link></li>
              <li><Link to="/marketplace">Marketplace</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3>Services</h3>
            <ul>
              <li>Upload Designs</li>
              <li>Advertising</li>
              <li>Architecture Plans</li>
              <li>Property Marketing</li>
            </ul>
          </div>
          <div>
            <h3>Newsletter</h3>
            <div className="newsletter-box">
              <input type="email" placeholder="Enter your email" />
              <button>
                <svg viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M14 5l7 7-7 7" /></svg>
              </button>
            </div>
            <p className="newsletter-note">Get updates on new designs and offers.</p>
          </div>
        </div>
        <div className="copyright">© 2026 NapoleonPlans. All rights reserved.</div>
      </footer>
    </>
  );
}

/* HOME PAGE */
function Home() {
  return <HomeLayout />;
}

/* DESIGNS PAGE */
function Designs() {
  const [designs, setDesigns] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost/napoleonplans/api/get_designs.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDesigns(data.designs);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: "100px 40px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>Our Designs</h1>
      <div className="featured-row">
        {designs.length === 0 ? (
          <p>No designs found.</p>
        ) : (
          designs.map((design) => (
            <div key={design.id} className="featured-card">
              <img
                src={`http://localhost/napoleonplans/uploads/${design.image}`}
                alt={design.title}
              />
              <div className="featured-info">
                <h3>{design.title}</h3>
                <p>{design.description}</p>
                <p>{design.price} MWK</p>
                <Link to="/contact">
                  <button className="nav-btn">Contact Us About This Design</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* MARKETPLACE PAGE */
function Marketplace() {
  const [designs, setDesigns] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost/napoleonplans/api/get_designs.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDesigns(data.designs);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: "100px 40px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1>Available Designs</h1>
        <p>Browse our architecture designs and contact us if you are interested.</p>
      </div>
      <div className="featured-row">
        {designs.length === 0 ? (
          <p>No designs found.</p>
        ) : (
          designs.map((design) => (
            <div key={design.id} className="featured-card">
              <img
                src={`http://localhost/napoleonplans/uploads/${design.image}`}
                alt={design.title}
              />
              <div className="featured-info">
                <h3>{design.title}</h3>
                <p>{design.description}</p>
                <p><strong>{design.price} MWK</strong></p>
                <Link to="/contact">
                  <button className="nav-btn">Contact Us About This Design</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ADVERTISE PAGE */
function Advertise() {
  const [adForm, setAdForm] = React.useState({
    companyName: "",
    projectTitle: "",
    description: "",
    budget: "",
    category: "residential",
  });

  const handleAdChange = (e) => {
    const { name, value } = e.target;
    setAdForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdSubmit = (e) => {
    e.preventDefault();
    alert(`Ad posted for: ${adForm.projectTitle}`);
    setAdForm({
      companyName: "",
      projectTitle: "",
      description: "",
      budget: "",
      category: "residential",
    });
  };

  return (
    <div style={{ minHeight: "100vh", padding: "80px 40px 40px" }}>
      <div className="page-container">
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1>Advertise Your Projects</h1>
          <p style={{ fontSize: "1.1rem", color: "#666", marginTop: "10px" }}>
            Get premium exposure for your construction company and properties
          </p>
        </div>

        <div style={{ maxWidth: "600px", margin: "0 auto", background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginBottom: "30px" }}>Create Your Advertisement</h2>
          <form onSubmit={handleAdSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={adForm.companyName}
                onChange={handleAdChange}
                required
                placeholder="Enter your company name"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Project Title</label>
              <input
                type="text"
                name="projectTitle"
                value={adForm.projectTitle}
                onChange={handleAdChange}
                required
                placeholder="e.g., Modern Residential Complex"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Category</label>
              <select
                name="category"
                value={adForm.category}
                onChange={handleAdChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="mixed">Mixed-Use</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Project Description</label>
              <textarea
                name="description"
                value={adForm.description}
                onChange={handleAdChange}
                required
                placeholder="Describe your project..."
                rows="5"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Budget (USD)</label>
              <input
                type="text"
                name="budget"
                value={adForm.budget}
                onChange={handleAdChange}
                required
                placeholder="e.g., $500,000"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              className="nav-btn"
              style={{
                marginTop: "20px",
                padding: "14px 32px",
                fontSize: "1rem",
              }}
            >
              Post Advertisement
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN APP ================= */
export default function App() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <Router>
      <div className="main-bg">
        {/* NAVBAR */}
        <nav className={`navbar${navOpen ? " nav-mobile-open" : ""}`}>
          <div className="logo-brand">
            <img src="/logo.png" alt="NapoleonPlans logo" className="logo-img" />
            NapoleonPlans
          </div>

          <button
            className="hamburger"
            onClick={() => setNavOpen(!navOpen)}
          >
            <span />
            <span />
            <span />
          </button>

          <ul className={`nav-links${navOpen ? " show" : ""}`}>
            <li onClick={() => setNavOpen(false)}>
              <Link to="/">Home</Link>
            </li>
            <li onClick={() => setNavOpen(false)}>
              <Link to="/designs">Designs</Link>
            </li>
            <li onClick={() => setNavOpen(false)}>
              <Link to="/marketplace">Marketplace</Link>
            </li>
            <li onClick={() => setNavOpen(false)}>
              <Link to="/advertise">Advertise</Link>
            </li>
            <li onClick={() => setNavOpen(false)}>
              <Link to="/contact">Contact</Link>
            </li>
            <li onClick={() => setNavOpen(false)}>
              <Link to="/donate">
                <button className="donate-btn">💝 Donate</button>
              </Link>
            </li>
          </ul>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/designs" element={<Designs />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/admin-upload" element={<AdminUpload />} />
        </Routes>

        {/* SCROLL TO TOP BUTTON */}
        <button
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
        </button>
      </div>
    </Router>
  );
}
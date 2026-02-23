import "./landing.css";
 import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* HERO SECTION */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="heroContent"
        >
          <h1>
            FINVENT0RY
          </h1>

          <p>
            inventory + finance + analytics
            <br></br>
            AI-powered business management system that predicts stock,
            manages credits, tracks sales, and helps shop owners
            make smarter decisions.
          </p>

          <div className="heroButtons">
            <button
              className="ownerBtn"
              onClick={() => navigate("/loginowner")}
            >
              🏪 Owner Login
            </button>

            <button
              className="customerBtn"
              onClick={() => navigate("/customer-login")}
            >
              👤 Customer Login
            </button>
          </div>
        </motion.div>

        {/* Floating Animated Circle */}
        <motion.div
          className="floatingCircle"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2>✨ Features</h2>

        <div className="featureGrid">

          <FeatureCard
            icon="🔮"
            title="AI Restock Prediction"
            desc="Forecast next 7 days demand using time-series machine learning."
          />

          <FeatureCard
            icon="💳"
            title="Credit Management"
            desc="Track issued credits, settlements, and customer risk."
          />

          <FeatureCard
            icon="📊"
            title="Sales Analytics"
            desc="Monitor daily profit, product trends, and revenue insights."
          />

          <FeatureCard
            icon="⚡"
            title="Automated Alerts"
            desc="Get intelligent restock recommendations before stock runs out."
          />

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta">
        <h2>Start Managing Your Business Smarter Today</h2>

        <div className="ctaButtons">
          <button onClick={() => navigate("/loginowner")}>
            Register as Owner
          </button>

          <button onClick={() => navigate("/customer-register")}>
            Register as Customer
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        © 2026 finventory AI — Built by AKSHIT KAUSHIK,AKHYA RASTOGI,AKSHAY BANSAL
      </footer>

    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    className="featureCard"
    whileHover={{ scale: 1.05 }}
  >
    <div className="icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </motion.div>
);

export default LandingPage;
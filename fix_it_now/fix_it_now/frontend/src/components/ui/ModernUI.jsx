import React from 'react';
import { motion } from 'framer-motion';

// Modern Card component with glass effect and animations
export const GlassCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card"
  >
    {children}
  </motion.div>
);

// Modern Button with hover effects
export const ModernButton = ({ children, onClick, variant = 'primary' }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`btn-modern ${variant}`}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

// Animated section for content blocks
export const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

// Loading spinner with modern design
export const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-pulse" />
  </div>
);

// Page transition wrapper
export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Modern input field with animation
export const ModernInput = ({ label, type = 'text', value, onChange, error }) => (
  <div className="input-group">
    <motion.input
      type={type}
      value={value}
      onChange={onChange}
      className={`input-modern ${error ? 'error' : ''}`}
      whileFocus={{ scale: 1.02 }}
      placeholder={label}
    />
    {error && <span className="error-text">{error}</span>}
  </div>
);

// Grid container for card layouts
export const ModernGrid = ({ children }) => (
  <div className="grid-modern">
    {children}
  </div>
);

// Hero section with parallax effect
export const HeroSection = ({ title, subtitle, image }) => (
  <motion.div
    className="hero-section"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <div className="hero-content">
      <motion.h1
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {subtitle}
      </motion.p>
    </div>
    {image && (
      <motion.img
        src={image}
        alt="Hero"
        className="hero-image"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
      />
    )}
  </motion.div>
);
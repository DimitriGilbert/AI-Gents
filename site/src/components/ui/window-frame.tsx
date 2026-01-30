"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface WindowFrameProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  className?: string;
  width?: string;
  height?: string;
  resizable?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  initialPosition?: { x: number; y: number };
  active?: boolean;
}

export function WindowFrame({
  children,
  title = "Untitled Window",
  className = "",
  width = "w-full",
  height = "h-auto",
  onClose,
  onMinimize,
  onMaximize,
  initialPosition,
  active = true,
}: WindowFrameProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isXP = theme === "xp";
  const [isHovered, setIsHovered] = useState(false);

  // XP Theme Styles
  const xpTitleBarStyle = {
    background: active
      ? 'linear-gradient(to bottom, #3D95FF 0%, #245EDC 100%)'
      : 'linear-gradient(to bottom, #7A9BCE 0%, #5A7BB0 100%)',
    borderTop: '1px solid #5BA8FF',
    borderBottom: '1px solid #1A47B0',
    boxShadow: '0 1px 0 rgba(255,255,255,0.3) inset',
  };

  const ubuntuTitleBarStyle = {
    background: active
      ? 'linear-gradient(to bottom, #6A5A5A 0%, #5A4A4A 15%, #4A3A3A 50%, #3C2F2F 85%, #2C2424 100%)'
      : 'linear-gradient(to bottom, #8A8A8A 0%, #7A7A7A 15%, #6A6A6A 50%, #5A5A5A 85%, #4A4A4A 100%)',
    borderBottom: '1px solid #1C1C1C',
    boxShadow: '0 1px 0 rgba(255,255,255,0.15) inset',
  };

  const xpContentStyle = {
    background: 'linear-gradient(to bottom, #F5F4F0 0%, #ECE9D8 100%)',
    borderLeft: '1px solid #7A8A9A',
    borderRight: '1px solid #7A8A9A',
    borderBottom: '1px solid #7A8A9A',
    borderRadius: '0 0 2px 2px',
  };

  const ubuntuContentStyle = {
    background: 'linear-gradient(to bottom, #F5F1E8 0%, #EDE5DA 100%)',
    borderLeft: '2px solid #3C2F2F',
    borderRight: '2px solid #3C2F2F',
    borderBottom: '2px solid #3C2F2F',
    borderRadius: '0 0 4px 4px',
  };

  return (
    <motion.div
      className={`${width} ${height} ${className}`}
      initial={initialPosition ? { x: initialPosition.x, y: initialPosition.y, opacity: 0, scale: 0.95 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        duration: 0.3 
      }}
      whileHover={isHovered ? { rotateY: [-2, 2, -1, 1, 0], transition: { duration: 0.5 } } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ perspective: 1000 }}
    >
      <div 
        className={`overflow-hidden ${isXP ? 'rounded-sm' : 'rounded-lg'} ${active ? 'shadow-2xl' : 'shadow-lg opacity-90'}`}
        style={{
          boxShadow: isXP
            ? (active 
              ? '0 4px 12px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)'
              : '0 2px 6px rgba(0,0,0,0.2)')
            : (active 
              ? '0 8px 32px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)' 
              : '0 4px 16px rgba(0,0,0,0.2)'),
        }}
      >
        {/* Window Title Bar */}
        <div 
          className="flex items-center justify-between px-3 py-2 select-none"
          style={isXP ? xpTitleBarStyle : ubuntuTitleBarStyle}
        >
          {/* Window Controls */}
          <div className="flex items-center gap-2">
            {isXP ? (
              // XP Style Controls - Square buttons
              <>
                <motion.button
                  onClick={onMinimize}
                  className="relative flex items-center justify-center w-5 h-5"
                  style={{
                    background: 'linear-gradient(to bottom, #FFFFFF 0%, #E0E0E0 50%, #D0D0D0 51%, #B0B0B0 100%)',
                    border: '1px solid #0033CC',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.8) inset',
                  }}
                  whileHover={{ background: 'linear-gradient(to bottom, #D0E8FF 0%, #A0C8FF 50%, #80B0FF 51%, #6098FF 100%)' }}
                  whileTap={{ scale: 0.95 }}
                  title="Minimize"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <rect x="1" y="5" width="6" height="1.5" fill="#0033CC" rx="0.5"/>
                  </svg>
                </motion.button>
                <motion.button
                  onClick={onMaximize}
                  className="relative flex items-center justify-center w-5 h-5"
                  style={{
                    background: 'linear-gradient(to bottom, #FFFFFF 0%, #E0E0E0 50%, #D0D0D0 51%, #B0B0B0 100%)',
                    border: '1px solid #0033CC',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.8) inset',
                  }}
                  whileHover={{ background: 'linear-gradient(to bottom, #D0E8FF 0%, #A0C8FF 50%, #80B0FF 51%, #6098FF 100%)' }}
                  whileTap={{ scale: 0.95 }}
                  title="Maximize"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <rect x="1.5" y="1.5" width="5" height="5" stroke="#0033CC" strokeWidth="1" rx="0.5"/>
                  </svg>
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="relative flex items-center justify-center w-5 h-5"
                  style={{
                    background: 'linear-gradient(to bottom, #FF9999 0%, #FF7777 50%, #FF5555 51%, #FF3333 100%)',
                    border: '1px solid #990000',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.3) inset',
                  }}
                  whileHover={{ background: 'linear-gradient(to bottom, #FF6666 0%, #FF4444 50%, #FF2222 51%, #CC0000 100%)' }}
                  whileTap={{ scale: 0.95 }}
                  title="Close"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M2 2L6 6M6 2L2 6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </motion.button>
              </>
            ) : (
              // Ubuntu Style Controls - Round buttons
              <>
                <motion.button
                  onClick={onClose}
                  className="relative flex items-center justify-center w-5 h-5 rounded-full"
                  style={{
                    background: 'linear-gradient(to bottom, #FF8A8A 0%, #FF6B6B 50%, #E85555 51%, #D44545 100%)',
                    border: '1px solid #B83535',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.3) inset',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Close"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="opacity-60">
                    <path d="M2 2L6 6M6 2L2 6" stroke="#4A0000" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </motion.button>
                <motion.button
                  onClick={onMinimize}
                  className="relative flex items-center justify-center w-5 h-5 rounded-full"
                  style={{
                    background: 'linear-gradient(to bottom, #FFDD88 0%, #FFCC55 50%, #E6B545 51%, #D4A535 100%)',
                    border: '1px solid #B89525',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.3) inset',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Minimize"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="opacity-60">
                    <rect x="1" y="5" width="6" height="1.5" fill="#4A3500" rx="0.5"/>
                  </svg>
                </motion.button>
                <motion.button
                  onClick={onMaximize}
                  className="relative flex items-center justify-center w-5 h-5 rounded-full"
                  style={{
                    background: 'linear-gradient(to bottom, #88DD88 0%, #66CC66 50%, #55B855 51%, #44A844 100%)',
                    border: '1px solid #338833',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.3) inset',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Maximize"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="opacity-60">
                    <rect x="1.5" y="1.5" width="5" height="5" stroke="#004400" strokeWidth="1.5" rx="0.5"/>
                  </svg>
                </motion.button>
              </>
            )}
          </div>

          {/* Window Title */}
          <div 
            className={`flex-1 text-center text-sm font-semibold px-4 truncate ${isXP ? 'text-white' : ''}`}
            style={{
              color: isXP 
                ? (active ? '#FFFFFF' : '#E0E0E0')
                : (active ? '#F5F1E8' : '#D0D0D0'),
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {isXP && (
              <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-sm" style={{ background: 'linear-gradient(to bottom, #36A856 0%, #2A8A42 100%)' }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" fill="white"/>
                  <rect x="9" y="2" width="5" height="5" fill="white"/>
                  <rect x="2" y="9" width="5" height="5" fill="white"/>
                  <rect x="9" y="9" width="5" height="5" fill="white"/>
                </svg>
              </span>
            )}
            {title}
          </div>

          {/* Spacer for balance */}
          <div className="w-16" />
        </div>

        {/* Window Content */}
        <div 
          className="relative"
          style={isXP ? xpContentStyle : ubuntuContentStyle}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

interface RetroPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  raised?: boolean;
}

export function RetroPanel({ children, className = "", title, raised = true }: RetroPanelProps) {
  const { theme } = useTheme();
  const isXP = theme === "xp";
  return (
    <div 
      className={`rounded-md ${className}`}
      style={{
        background: isXP
          ? (raised ? 'linear-gradient(to bottom, #F5F4F0 0%, #ECE9D8 100%)' : 'linear-gradient(to bottom, #E8E8E8 0%, #D8D8D8 100%)')
          : (raised 
            ? 'linear-gradient(to bottom, #F5F1E8 0%, #EDE5DA 100%)'
            : 'linear-gradient(to bottom, #EDE5DA 0%, #E5DDD2 100%)'),
        border: isXP ? '1px solid #A0A0A0' : '1px solid #C0B8A8',
        borderTopColor: isXP ? '#FFFFFF' : (raised ? '#F5F1E8' : '#EDE5DA'),
        borderLeftColor: isXP ? '#F0F0F0' : (raised ? '#EDE5DA' : '#E5DDD2'),
        boxShadow: raised 
          ? (isXP ? '0 1px 0 rgba(255,255,255,0.8) inset, 0 2px 4px rgba(0,0,0,0.1)' : '0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1)')
          : (isXP ? '0 1px 0 rgba(0,0,0,0.05) inset' : '0 1px 0 rgba(0,0,0,0.05) inset, 0 -1px 0 rgba(255,255,255,0.5) inset'),
      }}
    >
      {title && (
        <div 
          className="px-3 py-1.5 text-xs font-semibold border-b"
          style={{
            background: isXP 
              ? 'linear-gradient(to bottom, #F5F4F0 0%, #E8E8E8 100%)' 
              : 'linear-gradient(to bottom, #F5F1E8 0%, #E8E0D5 100%)',
            borderColor: isXP ? '#A0A0A0' : '#C0B8A8',
            color: isXP ? '#333333' : '#5A4A4A',
            textShadow: isXP ? 'none' : '0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          {title}
        </div>
      )}
      <div className="p-3">
        {children}
      </div>
    </div>
  );
}

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export function RetroButton({ 
  children, 
  className = "", 
  variant = 'default',
  size = 'md',
  ...props 
}: RetroButtonProps) {
  const { theme } = useTheme();
  const isXP = theme === "xp";
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const getVariantStyles = () => {
    if (isXP) {
      // XP Style Buttons
      switch (variant) {
        case 'primary':
          return {
            background: 'linear-gradient(to bottom, #4A9AFF 0%, #3080FF 50%, #2068E0 51%, #1050C0 100%)',
            borderColor: '#0033CC',
            topBorderColor: '#80B8FF',
            color: '#FFFFFF',
            hoverBackground: 'linear-gradient(to bottom, #60A8FF 0%, #4090FF 50%, #3078F0 51%, #2060D0 100%)',
            activeBackground: 'linear-gradient(to bottom, #2068E0 0%, #1050C0 50%, #0040B0 51%, #003090 100%)',
          };
        case 'destructive':
          return {
            background: 'linear-gradient(to bottom, #FF6666 0%, #FF4444 50%, #EE2222 51%, #DD0000 100%)',
            borderColor: '#990000',
            topBorderColor: '#FF9999',
            color: '#FFFFFF',
            hoverBackground: 'linear-gradient(to bottom, #FF8888 0%, #FF6666 50%, #FF4444 51%, #EE2222 100%)',
            activeBackground: 'linear-gradient(to bottom, #EE2222 0%, #DD0000 50%, #CC0000 51%, #BB0000 100%)',
          };
        default:
          return {
            background: 'linear-gradient(to bottom, #FFFFFF 0%, #F0F0F0 50%, #E0E0E0 51%, #D0D0D0 100%)',
            borderColor: '#7A8A9A',
            topBorderColor: '#FFFFFF',
            color: '#333333',
            hoverBackground: 'linear-gradient(to bottom, #F8F8F8 0%, #E8E8E8 50%, #D8D8D8 51%, #C8C8C8 100%)',
            activeBackground: 'linear-gradient(to bottom, #D0D0D0 0%, #C0C0C0 50%, #B0B0B0 51%, #A0A0A0 100%)',
          };
      }
    }
    
    // Ubuntu Style Buttons
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(to bottom, #FFCCA5 0%, #F5A570 50%, #E88950 51%, #DD7038 100%)',
          borderColor: '#B06030',
          topBorderColor: '#FFE5D4',
          color: '#3C2F2F',
          hoverBackground: 'linear-gradient(to bottom, #FFE5D4 0%, #FFCCA5 50%, #F5A570 51%, #E88950 100%)',
          activeBackground: 'linear-gradient(to bottom, #DD7038 0%, #C86028 50%, #B85020 51%, #A84018 100%)',
        };
      case 'destructive':
        return {
          background: 'linear-gradient(to bottom, #FFAAAA 0%, #FF8888 50%, #EE6666 51%, #DD5555 100%)',
          borderColor: '#BB3333',
          topBorderColor: '#FFDDDD',
          color: '#4A0000',
          hoverBackground: 'linear-gradient(to bottom, #FFDDDD 0%, #FFAAAA 50%, #FF8888 51%, #EE6666 100%)',
          activeBackground: 'linear-gradient(to bottom, #DD5555 0%, #CC4444 50%, #BB3333 51%, #AA2222 100%)',
        };
      default:
        return {
          background: 'linear-gradient(to bottom, #F5F5F5 0%, #E8E8E8 50%, #D8D8D8 51%, #C8C8C8 100%)',
          borderColor: '#A0A0A0',
          topBorderColor: '#FFFFFF',
          color: '#3C2F2F',
          hoverBackground: 'linear-gradient(to bottom, #FFFFFF 0%, #F5F5F5 50%, #E8E8E8 51%, #D8D8D8 100%)',
          activeBackground: 'linear-gradient(to bottom, #C8C8C8 0%, #B8B8B8 50%, #A8A8A8 51%, #989898 100%)',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <button
      className={`relative rounded font-semibold transition-all duration-100 retro-btn ${sizeClasses[size]} ${className}`}
      style={{
        background: styles.background,
        border: `1px solid ${styles.borderColor}`,
        borderTopColor: styles.topBorderColor,
        borderLeftColor: isXP ? '#F0F0F0' : '#E0E0E0',
        color: styles.color,
        boxShadow: isXP 
          ? '0 1px 0 rgba(255,255,255,0.8) inset, 0 1px 2px rgba(0,0,0,0.2)'
          : '0 1px 0 rgba(255,255,255,0.6) inset, 0 1px 3px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.1)',
        textShadow: isXP ? 'none' : '0 1px 0 rgba(255,255,255,0.5)',
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export default WindowFrame;

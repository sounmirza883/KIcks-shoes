import React, { useState } from 'react';
import { Sneaker } from '../types/index.ts';

interface SneakerVisualProps {
  silhouette: Sneaker['silhouette'];
  image?: string;
  alt?: string;
  primaryColor?: string;
  accentColor?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  isDarkBg?: boolean;
}

// High-resolution real product photography for sneakers
const SILHOUETTE_IMAGE_MAP: Record<Sneaker['silhouette'], string> = {
  jordan4: '/images/jordan_retro_shoe_1794331422136.jpg',
  jordan1: '/images/jordan_retro_shoe_1794331422136.jpg',
  dunk: '/images/lifestyle_dunk_shoe_1794331421061.jpg',
  af1: '/images/lifestyle_dunk_shoe_1794331421061.jpg',
  converse: '/images/lifestyle_dunk_shoe_1794331421061.jpg',
  nb9060: '/images/runner_tech_shoe_1794331421205.jpg',
  nb530: '/images/runner_tech_shoe_1794331421205.jpg',
  vomero: '/images/runner_tech_shoe_1794331421205.jpg',
  kayano: '/images/runner_tech_shoe_1794331421205.jpg',
  salomon: '/images/runner_tech_shoe_1794331421205.jpg',
  samba: '/images/casual_samba_shoe_1794331423705.jpg',
  campus: '/images/casual_samba_shoe_1794331423705.jpg',
  custom: '/images/stealth_drop_shoe_1794331423317.jpg',
};

export const SneakerVisual: React.FC<SneakerVisualProps> = ({
  silhouette,
  image,
  alt = 'Sneaker footwear',
  primaryColor = '#1e1e1e',
  accentColor = '#e5e5e5',
  className = '',
  size = 'md',
  isDarkBg = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-16',
    md: 'w-48 h-32',
    lg: 'w-64 h-44',
    xl: 'w-80 h-56',
    hero: 'w-full max-w-lg h-64 md:h-80',
  };

  const resolvedImage = image || SILHOUETTE_IMAGE_MAP[silhouette];

  // If an actual image is available and hasn't errored, display the photorealistic sneaker image
  if (resolvedImage && !imageError) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <img
          src={resolvedImage}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className={`w-full h-full object-contain drop-shadow-xl select-none ${
            isDarkBg ? 'brightness-105 contrast-105' : 'mix-blend-multiply contrast-105'
          }`}
          loading="lazy"
        />
      </div>
    );
  }

  // Graceful fallback to SVG if image fails to load
  switch (silhouette) {
    case 'jordan4':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl select-none">
            <ellipse cx="210" cy="245" rx="150" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(6px)" />
            <path d="M45 205 C50 225, 95 235, 180 235 C270 235, 345 220, 375 195 C370 215, 325 240, 240 242 C150 242, 60 232, 45 205 Z" fill="#111111" />
            <path d="M48 185 C55 200, 110 215, 200 215 C280 215, 345 202, 372 185 L375 196 C345 220, 270 235, 180 235 C95 235, 50 225, 45 205 L48 185 Z" fill="#D1D5DB" />
            <path d="M50 178 C65 195, 130 206, 210 206 C290 206, 345 195, 370 178 L372 188 C345 205, 280 216, 200 216 C110 216, 55 200, 48 185 Z" fill="#FFFFFF" />
            <rect x="75" y="194" width="48" height="15" rx="4" fill="#0F172A" />
            <rect x="80" y="196" width="38" height="11" rx="2" fill="#38BDF8" opacity="0.85" />
            <line x1="93" y1="196" x2="93" y2="207" stroke="#0F172A" strokeWidth="2.5" />
            <line x1="105" y1="196" x2="105" y2="207" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M190 206 C235 206, 275 202, 305 196 C325 192, 345 186, 368 178 C355 195, 305 208, 235 212 Z" fill="#111111" />
            <path d="M58 178 C52 145, 55 110, 68 85 C80 62, 102 52, 125 45 C135 42, 148 65, 168 95 C195 102, 245 118, 295 132 C345 148, 368 162, 370 175 C345 190, 260 200, 160 198 C95 198, 58 178, 58 178 Z" fill={accentColor === '#e5e5e5' ? '#FFFFFF' : accentColor} stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M55 178 C58 152, 65 138, 85 132 C135 140, 215 150, 280 155 C335 158, 368 170, 370 176 C345 190, 260 200, 160 198 C95 198, 55 178, 55 178 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M285 155 C315 158, 355 166, 370 176 C355 186, 310 192, 280 188 C272 175, 275 162, 285 155 Z" fill={primaryColor} />
            <path d="M112 50 C125 32, 145 32, 160 48 L175 95 L132 88 Z" fill="#111111" />
            <rect x="122" y="38" width="28" height="20" rx="3" fill="#DC2626" />
            <path d="M136 44 L132 53 M136 44 L140 53 M136 44 L136 50 M133 47 L139 47" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
            <text x="126" y="56" fill="#FFF" fontSize="5" fontWeight="bold" letterSpacing="0.5">Flight</text>
            <path d="M58 95 C52 75, 68 70, 78 88 L72 115 L58 110 Z" fill={primaryColor} />
            <path d="M145 118 L195 130 L180 165 L132 150 Z" fill="#111111" />
            <polygon points="125,78 160,115 145,148 125,122" fill={primaryColor} stroke="#000" strokeWidth="1.5" />
            <line x1="135" y1="78" x2="168" y2="105" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="148" y1="92" x2="185" y2="118" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="162" y1="106" x2="204" y2="130" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'jordan1':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl select-none">
            <ellipse cx="200" cy="225" rx="140" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(4px)" />
            <path d="M45 185 C45 185, 95 205, 180 205 C265 205, 345 195, 365 175 C365 175, 355 212, 330 220 C260 228, 120 228, 50 210 C40 205, 42 190, 45 185 Z" fill="#DC2626" />
            <path d="M48 175 C70 185, 160 195, 250 190 C310 185, 350 175, 362 165 L365 178 C335 195, 260 205, 180 205 C95 205, 48 185, 48 175 Z" fill="#FFFFFF" />
            <path d="M55 175 C52 140, 52 105, 60 70 C65 50, 78 40, 95 38 C115 36, 128 50, 138 75 C155 85, 210 105, 280 125 C330 140, 360 155, 360 165 C340 178, 260 185, 170 185 C95 185, 55 175, 55 175 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M55 175 C52 135, 55 90, 72 75 C82 65, 105 60, 115 78 L110 120 C85 130, 60 148, 55 175 Z" fill="#DC2626" />
            <path d="M110 125 C145 125, 220 135, 275 128 C265 134, 210 148, 175 155 C140 162, 118 152, 110 125 Z" fill="#111111" />
          </svg>
        </div>
      );

    case 'samba':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl select-none">
            <ellipse cx="200" cy="225" rx="140" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(4px)" />
            <path d="M45 185 C45 185, 95 200, 180 200 C265 200, 345 190, 365 175 C365 175, 355 205, 330 212 C260 218, 120 218, 50 205 C40 200, 42 190, 45 185 Z" fill="#B45309" />
            <path d="M48 178 C70 185, 160 190, 250 188 C310 185, 350 176, 362 168 L365 178 C335 190, 260 200, 180 200 C95 200, 48 185, 48 178 Z" fill="#D97706" />
            <path d="M55 178 C52 155, 65 130, 95 110 C120 95, 140 105, 155 120 C185 128, 250 138, 305 148 C345 155, 360 165, 360 170 C340 178, 260 182, 170 182 C95 182, 55 178, 55 178 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="180" y1="125" x2="165" y2="165" stroke="#111111" strokeWidth="6" />
            <line x1="200" y1="128" x2="185" y2="168" stroke="#111111" strokeWidth="6" />
            <line x1="220" y1="132" x2="205" y2="172" stroke="#111111" strokeWidth="6" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl select-none">
            <ellipse cx="200" cy="225" rx="140" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(4px)" />
            <path d="M45 185 C45 185, 95 205, 180 205 C265 205, 345 195, 365 175 C365 175, 355 210, 330 218 C260 225, 120 225, 50 208 C40 202, 42 190, 45 185 Z" fill="#111111" />
            <path d="M48 175 C70 185, 160 195, 250 190 C310 185, 350 175, 362 165 L365 178 C335 195, 260 205, 180 205 C95 205, 48 185, 48 175 Z" fill="#E2E8F0" />
            <path d="M55 175 C52 145, 60 120, 85 95 C105 75, 130 85, 145 105 C170 115, 230 130, 290 142 C340 152, 360 162, 360 168 C340 178, 260 185, 170 185 C95 185, 55 175, 55 175 Z" fill={primaryColor} stroke="#333" strokeWidth="1" />
          </svg>
        </div>
      );
  }
};

// Color schemes for different product categories
export const categoryColors = {
  black: {
    primary: '#FF6B6B',
    secondary: '#FF8787',
    accent: '#FF4949',
    text: '#2D2D2D'
  },
  plastic: {
    primary: '#4ECDC4',
    secondary: '#6FE3DC',
    accent: '#2DBDB4',
    text: '#2D2D2D'
  },
  compostable: {
    primary: '#45B7D1',
    secondary: '#67C7DE',
    accent: '#2DA7C4',
    text: '#2D2D2D'
  },
  soup: {
    primary: '#96CEB4',
    secondary: '#AFDAC7',
    accent: '#7DC2A1',
    text: '#2D2D2D'
  }
};

// Theme variations
export const themes = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F7FA',
    primary: '#2468f2',
    secondary: '#4E5BA6',
    text: {
      primary: '#2D2D2D',
      secondary: '#6B7280',
      disabled: '#9CA3AF'
    },
    border: '#E5E7EB',
    shadow: '0 1px 4px rgba(0,0,0,0.1)'
  },
  dark: {
    background: '#1F2937',
    surface: '#374151',
    primary: '#60A5FA',
    secondary: '#818CF8',
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      disabled: '#9CA3AF'
    },
    border: '#4B5563',
    shadow: '0 1px 4px rgba(0,0,0,0.3)'
  }
};

// Gradient presets
export const gradients = {
  primary: 'linear-gradient(135deg, #2468f2 0%, #4E5BA6 100%)',
  secondary: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)',
  accent: 'linear-gradient(135deg, #FF6B6B 0%, #FF8787 100%)'
}; 
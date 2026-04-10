# Font Setup Instructions

This project uses self-hosted **variable fonts**. Place your font files in the directories below.

## Directory Structure

```
src/assets/fonts/
├── alumni-sans/
│   └── AlumniSans-VariableFont_wght.ttf  (All weights in one file!)
└── inter/
    └── InterTight-VariableFont_wght.ttf  (All weights in one file!)
```

That's it - just **2 font files** total!

## How to Get the Fonts

### Option 1: Convert from Google Fonts (Free)

1. **Download Alumni Sans:**
   - Go to: https://fonts.google.com/specimen/Alumni+Sans
   - Click "Download family"
   - Extract the ZIP file
   - Convert the `.ttf` files to `.woff2` using: https://cloudconvert.com/ttf-to-woff2
   - You need these files:
     - `AlumniSans-Regular.ttf` → `alumni-sans-400.woff2`
     - `AlumniSans-Bold.ttf` → `alumni-sans-700.woff2`
     - `AlumniSans-ExtraBold.ttf` → `alumni-sans-800.woff2`

2. **Download Inter:**
   - Go to: https://fonts.google.com/specimen/Inter
   - Click "Download family"
   - Extract the ZIP file
   - Convert the `.ttf` files to `.woff2` using: https://cloudconvert.com/ttf-to-woff2
   - You need these files:
     - `Inter-Medium.ttf` → `inter-500.woff2`
     - `Inter-Bold.ttf` → `inter-700.woff2`

### Option 2: Use Font Squirrel (Easier, Free)

1. Go to: https://www.fontsquirrel.com/tools/webfont-generator
2. Upload your `.ttf` files
3. Select "Expert" mode
4. Choose "WOFF2" format only
5. Check "Base64 Encode" (optional, not recommended)
6. Download the converted files

### Option 3: Use Pre-converted WOFF2 Files (Fastest)

**Inter (Already WOFF2):**
- Download from: https://github.com/rsms/inter/releases
- Or use this CDN link to download directly:
  - https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2 (500)
  - https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff2 (700)

**Alumni Sans (Already WOFF2):**
- Download from Google's CDN directly:
  - https://fonts.gstatic.com/s/alumnisans/v12/kmKpQKhKqiQpH2HsnzOcY5nBq7xmUj3w.woff2 (400)
  - https://fonts.gstatic.com/s/alumnisans/v12/kmKkQKhKqiQpH2HsnzOcY5nB2wlUh3lUdA.woff2 (700)
  - https://fonts.gstatic.com/s/alumnisans/v12/kmKkQKhKqiQpH2HsnzOcY5nB7w1Uh3lUdA.woff2 (800)

## Alternative: Use TTF Files (Simpler, No Conversion)

If you don't want to convert to WOFF2, you can use `.ttf` files directly.

**Update `src/styles/fonts.css` to use `.ttf` instead:**

```css
/* Change format('woff2') to format('truetype') */
/* Change .woff2 extension to .ttf */
```

Example:
```css
@font-face {
  font-family: 'Alumni Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/src/assets/fonts/alumni-sans/alumni-sans-400.ttf') format('truetype');
}
```

## After Placing Fonts

1. Place all font files in the correct directories as shown above
2. Restart your dev server: `npm run dev`
3. Clear browser cache if needed (Ctrl+Shift+R)

## Verify Fonts Are Working

Open your browser DevTools:
1. Go to Network tab
2. Filter by "Font"
3. Refresh the page
4. You should see your font files loading (not google fonts)

## Troubleshooting

**Fonts not loading?**
- Check file paths match exactly in `fonts.css`
- Make sure font file names match what's in the CSS
- Check browser console for 404 errors
- Try using absolute paths from the `public/` folder instead

**Alternative approach using public/ folder:**
- Move fonts to: `public/fonts/...`
- Update paths to: `url('/fonts/alumni-sans/...')`

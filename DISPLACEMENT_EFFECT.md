# Pixel Displacement Effect with RGB Shift

This implementation adds a Three.js-based pixel displacement effect with RGB shift to the hero image, based on the tutorial you provided.

## Features

- **Pixel Displacement**: Mouse movement creates a displacement effect that follows the cursor
- **RGB Shift**: Subtle color separation effect that responds to displacement intensity
- **GPGPU Processing**: Uses GPUComputationRenderer for persistent displacement data
- **Smooth Fade**: Displacement trails fade out naturally when mouse leaves the area
- **Responsive**: Adapts to container size changes

## Files Added/Modified

### New Files

- `assets/shaders/vertex.glsl` - Vertex shader for the plane geometry
- `assets/shaders/fragment.glsl` - Fragment shader with displacement and RGB shift effects
- `assets/shaders/gpgpu.glsl` - GPGPU fragment shader for displacement computation
- `composables/useGPGPU.js` - GPGPU class for handling displacement texture
- `composables/useDisplacementEffect.js` - Main composable for the Three.js effect

### Modified Files

- `components/Hero.vue` - Updated to use Three.js effect instead of background image

## How It Works

1. **GPGPU Processing**: The `GPGPU` class uses GPUComputationRenderer to create a persistent displacement texture that updates each frame
2. **Mouse Tracking**: Raycaster converts mouse coordinates to UV coordinates on the plane
3. **Displacement**: Mouse movement creates displacement data that fades over time
4. **RGB Shift**: The fragment shader applies different displacement intensities to red, green, and blue channels
5. **Cover UVs**: Ensures the image maintains proper aspect ratio like CSS `object-fit: cover`

## Usage

The effect is automatically initialized when the Hero component mounts, with a 1-second delay to match the existing animation timing. The effect responds to mouse movement within the hero image area.

## Performance Notes

- Uses `Math.min(window.devicePixelRatio, 2)` to limit pixel ratio for better performance
- GPGPU grid size is optimized (700 pixels) for good quality vs performance balance
- Proper cleanup on component unmount to prevent memory leaks

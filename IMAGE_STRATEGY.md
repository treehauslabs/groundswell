# Groundswell — Image Generation Strategy

## Approach: Spec-Faithful AI Generation

Every product image prompt is engineered from the actual Groundswell design manifests to ensure physical accuracy. This is critical — inaccurate renders would set wrong expectations and hurt credibility.

### Physical Constraints Embedded in Every Prompt

| Spec | Value | Why It Matters |
|---|---|---|
| Post width | 85mm (3.35") | Must look slim, not chunky — this is a key aesthetic differentiator |
| Post color | Black anodized aluminum | Must read as premium fence, not industrial solar |
| Panel appearance | Frameless, all-black glass, subtle cell grid | Must not look like typical blue/silver solar panels |
| Panel height | ~5 ft (1,500mm) | Total fence height with clearance and cap is ~5'7" |
| Ground clearance | 6 inches | Must be visible — shows no concrete, just grass |
| Panel-to-post join | Panel slides into channel, no visible bolts | Seamless look is the selling point |
| Ground screw | Helical, 3" shaft, driven into grass | Shows the no-concrete, no-dig story |
| Setting | Suburban residential | Must feel attainable, not aspirational mansion |
| Lighting | Golden hour / warm afternoon | Matches the brand palette (Obsidian + Copper) |

### What We're NOT Showing

- Blue or silver solar panels (ours are all-black)
- Visible wiring or junction boxes
- Industrial or commercial settings
- Perfect mansion yards (too aspirational — our customer has a normal suburban home)
- Tilted or angled panels (ours are vertical, like a fence)

## Image Catalog

### Hero Images (above the fold)

| Filename | Scene | Purpose |
|---|---|---|
| `hero-fence-sunset.png` | 5-6 panel fence line at golden hour | Main hero — first thing visitors see |
| `hero-fence-lifestyle.png` | Family dinner with fence in background | Shows the fence as part of life, not the subject |

### Product Detail

| Filename | Scene | Purpose |
|---|---|---|
| `product-single-module.png` | One post + panel on dark background | Product shot for the "What's in each module" section |
| `product-post-detail.png` | Cross-section macro of the 4-channel post | Technical detail for the Engineering section |
| `product-ground-screw.png` | Screw in grass with impact driver nearby | Shows the no-concrete foundation story |

### Installation

| Filename | Scene | Purpose |
|---|---|---|
| `install-driving-screw.png` | Hands driving screw with impact driver | Step 1 of installation |
| `install-sliding-panel.png` | Two people lowering panel into posts | Step 3 — the self-aligning moment |

### Ecosystem Products

| Filename | Scene | Purpose |
|---|---|---|
| `product-gate.png` | Solar gate, slightly open, in fence line | Gate product card |
| `product-camera-post.png` | Camera post in front yard garden | Camera product card |
| `product-shed.png` | Solar shed in backyard with matching fence | Shed product card |
| `product-shade-sail.png` | Shade sail over patio with solar posts | Shade product card |

### Configurations

| Filename | Scene | Purpose |
|---|---|---|
| `config-corner.png` | Fence turning a 90° corner | Shows modular flexibility |
| `config-full-yard.png` | Drone view of full backyard with fence | Shows complete system vision |

## How to Generate

```bash
# 1. Get a free Gemini API key (60 seconds, no credit card)
#    https://aistudio.google.com/apikey

# 2. Set the key
export GEMINI_API_KEY="your-key-here"

# 3. Install dependencies
pip install google-generativeai Pillow

# 4. Generate all images
python3 generate-images.py

# 5. Images are saved to images/generated/
# 6. Review, then copy best ones to images/ and update index.html
```

## Iteration Process

1. Run the generator — inspect all 13 images
2. For any that aren't physically accurate, adjust the prompt in `generate-images.py`
3. Delete the bad image from `images/generated/` (the script skips existing files)
4. Re-run — only the deleted image will be regenerated
5. Repeat until all images are accurate and compelling

## Fallback: SVG Illustrations

The website ships with programmatic SVG illustrations that are 100% accurate to specs. These work on day one. The AI-generated photorealistic images are an upgrade layer — they replace the SVGs once generated and reviewed.

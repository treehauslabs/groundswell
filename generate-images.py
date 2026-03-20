#!/usr/bin/env python3
"""
Groundswell — Photorealistic Product Image Generator

Uses Google Gemini API (new google-genai SDK) to generate
accurate, spec-faithful product images for the website.

SETUP:
  1. Go to https://aistudio.google.com/apikey
  2. Create a free API key (no credit card needed)
  3. Export it:  export GEMINI_API_KEY="your-key-here"
  4. Install:   pip install google-genai Pillow
  5. Run:       python3 generate-images.py
"""

import os
import sys
import time
import base64

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Install the SDK first:  pip install google-genai Pillow")
    sys.exit(1)

# ============================================================
# CONFIG
# ============================================================

API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
if not API_KEY:
    print("ERROR: Set GEMINI_API_KEY environment variable.")
    print("  Get a free key at: https://aistudio.google.com/apikey")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)
MODEL = "gemini-2.5-flash-image"  # Free tier: ~50 images/day, resets midnight PT
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images", "generated")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# PRODUCT IMAGE PROMPTS
# ============================================================

IMAGES = [
    {
        "filename": "hero-fence-sunset.png",
        "prompt": (
            "Professional architectural photography of a modern black aluminum "
            "solar privacy fence in a suburban backyard at golden hour sunset. "
            "The fence is 5.5 feet tall, made of seamless dark black glass panels "
            "between slim black anodized aluminum posts spaced about 3 feet apart. "
            "The glass panels are frameless, all-black with a subtle dark blue-black "
            "tint like premium tinted glass, with barely visible solar cell grid lines. "
            "Each post is about 3.5 inches wide with a flat black aluminum cap on top. "
            "The fence runs along a well-maintained suburban property line with green "
            "bermuda grass lawn on both sides. A modern craftsman-style house is "
            "visible in the background with warm interior lights on. The sky is a "
            "warm golden orange sunset gradient. The fence looks like premium "
            "architectural fencing, not like a solar panel installation. "
            "6 inches of ground clearance under the fence. "
            "Shot at eye level from a slight angle showing 5-6 fence panels in "
            "perspective. Shallow depth of field. Warm golden hour lighting. "
            "Photorealistic, high-end architectural photography style, 8K quality."
        ),
    },
    {
        "filename": "hero-fence-lifestyle.png",
        "prompt": (
            "Photorealistic lifestyle photograph of a family backyard scene with "
            "a modern black solar fence in the background. A couple is sitting at "
            "a patio dining table having dinner, string lights overhead, a gas grill "
            "to the side. A golden retriever is lying on the grass. The black solar "
            "fence runs across the entire back of the yard — it looks like a premium "
            "black aluminum privacy fence with seamless dark glass panels between "
            "slim 3.5-inch-wide black aluminum posts. The glass panels are all-black "
            "frameless with subtle solar cell texture barely visible. The fence is "
            "5.5 feet tall. It's early evening, warm ambient light. The fence is "
            "clearly part of the scene but not the focus — it's infrastructure that "
            "blends in. Suburban backyard, well-maintained lawn, mature landscaping "
            "with boxwood hedges. Shot with a 35mm lens, shallow depth of field. "
            "Photorealistic, editorial lifestyle photography style."
        ),
    },
    {
        "filename": "product-single-module.png",
        "prompt": (
            "Product photography of a single solar fence module on a clean dark "
            "background. One slim black anodized aluminum post (3.5 inches wide, "
            "about 5.5 feet tall) with a frameless all-black glass solar panel "
            "(about 5 feet tall by 3 feet wide) inserted into a channel on the "
            "post. The panel is dark black glass with a subtle grid pattern of "
            "solar cells. Flat black aluminum cap on top. At the bottom, a "
            "galvanized steel helical ground screw extends below. Dark charcoal "
            "gradient background. Studio lighting highlights the glass reflections "
            "and aluminum edges. Apple-level product photography. 8K."
        ),
    },
    {
        "filename": "product-post-detail.png",
        "prompt": (
            "Extreme close-up product photography of a black anodized aluminum "
            "fence post showing internal panel-receiving channels. The post is "
            "rectangular, about 85mm x 70mm. Panel channels on opposite faces, "
            "each about 22mm wide and 20mm deep, with a black rubber gasket "
            "visible. One channel has a dark glass panel edge inserted with gasket "
            "around it. Central wire chase hole visible. Premium black anodized "
            "finish. Studio macro photography, dark background. Industrial design."
        ),
    },
    {
        "filename": "product-ground-screw.png",
        "prompt": (
            "Product photo of a galvanized steel helical ground screw partially "
            "driven into a green lawn, low angle. 3-inch diameter shaft, helical "
            "blade at bottom like a corkscrew. Top 12 inches above grass showing "
            "flat stub for fence post. Undisturbed grass around entry point. "
            "A cordless yellow impact driver sits on grass nearby. Warm afternoon "
            "sunlight. Shallow depth of field. Demonstrates no-concrete no-dig "
            "installation. Photorealistic."
        ),
    },
    {
        "filename": "install-driving-screw.png",
        "prompt": (
            "Photorealistic image of hands using a cordless impact driver to drive "
            "a steel helical ground screw into a lawn. Work gloves, jeans, kneeling "
            "on green grass. Yellow/black impact driver with socket adapter on the "
            "screw head. Screw halfway into ground, helical blade visible. String "
            "line in background marking the fence line. Sunny suburban backyard. "
            "Action shot style."
        ),
    },
    {
        "filename": "install-sliding-panel.png",
        "prompt": (
            "Photorealistic image of two people installing a solar fence panel. "
            "They hold a large (5ft x 3ft) frameless black glass panel and are "
            "lowering it into channels on two black aluminum posts already installed "
            "3 feet apart. Two previously installed panels visible to the left "
            "forming a continuous black fence. Suburban backyard, green grass, "
            "bright daylight. Panel halfway down being guided into channels. "
            "Shows DIY installation ease."
        ),
    },
    {
        "filename": "product-gate.png",
        "prompt": (
            "Photorealistic image of a black solar automatic gate in a residential "
            "fence. Single-swing, 3 feet wide, 5.5 feet tall, matching adjacent "
            "solar fence panels. Gate panel is all-black frameless glass with a "
            "sleek smart lock keypad at handle height. Gate slightly open showing "
            "heavy-duty hinges. Wider hinge post contains gate motor. Adjacent "
            "solar fence panels on both sides. Suburban walkway. Late afternoon."
        ),
    },
    {
        "filename": "product-camera-post.png",
        "prompt": (
            "Self-powered outdoor security camera on a 4-foot black aluminum post "
            "in a residential front yard garden bed. Camera housing at top, small "
            "solar panel section wrapping the post below camera, slim post body "
            "below. Mounted on ground screw in soil among ornamental grasses. "
            "Suburban house visible in background. Looks like premium landscape "
            "bollard not security device. Dusk, small green LED glowing. "
            "Photorealistic lifestyle product photography."
        ),
    },
    {
        "filename": "product-shed.png",
        "prompt": (
            "Photorealistic image of a modern 8x10 foot solar workshop shed in a "
            "suburban backyard. Walls made of black frameless glass solar panels "
            "between slim black aluminum posts (same as solar fence). Roof has "
            "solar panels at shallow angle. Black aluminum door slightly open "
            "showing workbench inside. Sits on gravel pad. Matching solar fence "
            "visible running behind it. Golden hour light. Looks like premium "
            "modern outbuilding. Architectural photography."
        ),
    },
    {
        "filename": "product-shade-sail.png",
        "prompt": (
            "Triangular charcoal shade sail stretched between three 9-foot tall "
            "black aluminum posts over a residential patio. Stainless turnbuckles "
            "at corners. Teak dining table with chairs underneath. Black solar "
            "panels clamped vertically to two post faces. Modern suburban backyard "
            "with concrete patio and green lawn. Warm late afternoon light "
            "filtering through the shade sail. Photorealistic architectural "
            "lifestyle photography."
        ),
    },
    {
        "filename": "config-corner.png",
        "prompt": (
            "Photorealistic image of a black solar fence turning a 90-degree "
            "corner along a suburban property line. 5.5 feet tall with black "
            "frameless glass panels between slim black aluminum posts. Corner "
            "post has panels from two perpendicular directions. Fence runs about "
            "4 panels each direction. Green lawn, neighboring yard beyond. Same "
            "slim post at corner, no special hardware. Bright daylight, slight "
            "overhead angle showing the L-shape."
        ),
    },
    {
        "filename": "config-full-yard.png",
        "prompt": (
            "Aerial drone photograph at 45 degrees looking into a suburban "
            "backyard enclosed by black solar fence on three sides, house on "
            "fourth. 5.5 foot tall black glass panels with slim posts. Solar "
            "gate visible on one side. Inside: green lawn, patio furniture, "
            "garden bed, dog on grass. Typical American suburban ranch house. "
            "Fence looks like premium black privacy fence from above. Sunny day. "
            "30-foot elevation drone shot. Photorealistic."
        ),
    },
]


# ============================================================
# GENERATION
# ============================================================

def generate_image(prompt: str, filename: str) -> bool:
    """Generate a single image using Gemini and save it."""
    filepath = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(filepath):
        print(f"  SKIP (already exists): {filename}")
        return True

    try:
        # Try Imagen API first (separate quota pool)
        if MODEL.startswith("imagen"):
            response = client.models.generate_images(
                model=MODEL,
                prompt=prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                ),
            )
            if response.generated_images:
                image_data = response.generated_images[0].image.image_bytes
                with open(filepath, "wb") as f:
                    f.write(image_data)
                size_kb = len(image_data) / 1024
                print(f"  SAVED: {filename} ({size_kb:.0f} KB)")
                return True
            print(f"  FAILED (no image generated): {filename}")
            return False
        else:
            # Gemini native image generation
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE", "TEXT"],
                ),
            )

            if response.candidates:
                for part in response.candidates[0].content.parts:
                    if part.inline_data and part.inline_data.data:
                        image_data = part.inline_data.data
                        with open(filepath, "wb") as f:
                            f.write(image_data)
                        size_kb = len(image_data) / 1024
                        print(f"  SAVED: {filename} ({size_kb:.0f} KB)")
                        return True

            print(f"  FAILED (no image in response): {filename}")
            return False

    except Exception as e:
        err = str(e)
        if "429" in err and "RESOURCE_EXHAUSTED" in err:
            print(f"  RATE LIMITED: {filename} — waiting 60s and retrying...")
            time.sleep(60)
            try:
                if MODEL.startswith("imagen"):
                    response = client.models.generate_images(
                        model=MODEL,
                        prompt=prompt,
                        config=types.GenerateImagesConfig(number_of_images=1),
                    )
                    if response.generated_images:
                        image_data = response.generated_images[0].image.image_bytes
                        with open(filepath, "wb") as f:
                            f.write(image_data)
                        size_kb = len(image_data) / 1024
                        print(f"  SAVED (retry): {filename} ({size_kb:.0f} KB)")
                        return True
                print(f"  FAILED after retry: {filename}")
                return False
            except Exception as e2:
                print(f"  FAILED after retry: {filename} — {e2}")
                return False
        print(f"  ERROR: {filename} — {e}")
        return False


def main():
    print("=" * 60)
    print("GROUNDSWELL — Product Image Generator")
    print("=" * 60)
    print(f"Model: {MODEL}")
    print(f"Output: {OUTPUT_DIR}")
    print(f"Images to generate: {len(IMAGES)}")
    print()

    success = 0
    failed = 0

    for i, img in enumerate(IMAGES, 1):
        print(f"[{i}/{len(IMAGES)}] {img['filename']}")
        if generate_image(img["prompt"], img["filename"]):
            success += 1
        else:
            failed += 1
        # Rate limiting
        if i < len(IMAGES):
            time.sleep(4)

    print()
    print(f"Done. {success} succeeded, {failed} failed.")
    print(f"Images saved to: {OUTPUT_DIR}")

    if success > 0:
        print()
        print("Next: review images, then git add/commit/push to update the site.")


if __name__ == "__main__":
    main()

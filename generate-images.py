#!/usr/bin/env python3
"""
Groundswell — Photorealistic Product Image Generator

Uses Google Gemini 2.5 Flash Image API (free tier: 500 images/day)
to generate accurate, spec-faithful product images for the website.

SETUP:
  1. Go to https://aistudio.google.com/apikey
  2. Create a free API key (no credit card needed)
  3. Export it:  export GEMINI_API_KEY="your-key-here"
  4. Install:   pip install google-generativeai Pillow
  5. Run:       python3 generate-images.py

All prompts are engineered from the actual Groundswell engineering specs
to ensure generated images are physically accurate.
"""

import os
import sys
import time
import base64

try:
    import google.generativeai as genai
except ImportError:
    print("Install the SDK first:  pip install google-generativeai Pillow")
    sys.exit(1)

# ============================================================
# CONFIG
# ============================================================

API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
if not API_KEY:
    print("ERROR: Set GEMINI_API_KEY environment variable.")
    print("  Get a free key at: https://aistudio.google.com/apikey")
    sys.exit(1)

genai.configure(api_key=API_KEY)
MODEL = "gemini-2.5-flash-preview-05-20"  # Free tier image generation model
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "images", "generated")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# PRODUCT IMAGE PROMPTS
#
# Each prompt is carefully engineered to match the Groundswell
# engineering specs exactly. Key physical constraints embedded
# in every prompt:
#
# - Posts: 85mm wide, black anodized aluminum, slim profile
# - Panels: frameless glass-glass bifacial, all-black, 5ft tall
# - Ground screws: helical, driven into soil, no concrete
# - Overall fence height: ~5'7" with 6" ground clearance
# - Aesthetic: premium black aluminum, minimal, modern
# - Setting: suburban residential, realistic landscaping
# ============================================================

IMAGES = [
    # ============================================
    # HERO / LIFESTYLE IMAGES
    # ============================================
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
    # ============================================
    # PRODUCT DETAIL IMAGES
    # ============================================
    {
        "filename": "product-single-module.png",
        "prompt": (
            "Product photography of a single Groundswell solar fence module "
            "against a clean dark background. The module consists of: one slim "
            "black anodized aluminum post (3.5 inches wide, about 5.5 feet tall) "
            "with a frameless all-black glass-glass solar panel (about 5 feet tall "
            "by 3 feet wide) inserted into a channel on the post. The panel is "
            "dark black glass with a subtle grid pattern of solar cells visible "
            "up close. The post has a flat black aluminum cap on top. At the "
            "bottom, a galvanized steel helical ground screw (3-inch diameter "
            "shaft with a spiral blade at the bottom) extends below the post. "
            "The product floats on a very dark charcoal gradient background. "
            "Studio lighting from the upper left creates subtle reflections on "
            "the glass panel surface and highlights the aluminum post edges. "
            "Clean, minimal, premium product photography style. Apple-level "
            "product shot aesthetic. 8K resolution."
        ),
    },
    {
        "filename": "product-post-detail.png",
        "prompt": (
            "Extreme close-up product photography of a black anodized aluminum "
            "fence post cross-section, showing the internal channels. The post "
            "is about 85mm x 70mm rectangular profile, cut to show the cross "
            "section. There are panel receiving channels on two opposite faces "
            "of the post — each channel is a slot about 22mm wide and 20mm deep "
            "that receives a glass panel edge with a black EPDM rubber gasket. "
            "A central hollow wire chase cavity (25mm x 35mm) runs through the "
            "middle for electrical cables. The aluminum has a premium black "
            "anodized finish with a slight matte sheen. One channel shows a "
            "glass panel edge inserted with a black rubber gasket visible around "
            "it. Studio macro photography against a dark background. Sharp focus "
            "on the cross-section detail. Premium industrial design photography."
        ),
    },
    {
        "filename": "product-ground-screw.png",
        "prompt": (
            "Product photography of a galvanized steel helical ground screw "
            "partially driven into soil, shown from a low angle. The screw has "
            "a 3-inch diameter steel shaft about 36 inches long with a helical "
            "blade at the bottom like a large corkscrew. The top 12 inches extend "
            "above the grass surface, showing the flat stub where the fence post "
            "would slide on. The soil around the entry point is undisturbed — no "
            "digging, no concrete, just the screw driven straight into green lawn "
            "grass. Warm afternoon sunlight. A cordless impact driver with a "
            "socket adapter sits on the grass next to the installed screw. "
            "Shallow depth of field, focus on the screw. Demonstrates the "
            "no-concrete, no-dig installation. Photorealistic."
        ),
    },
    # ============================================
    # INSTALLATION SEQUENCE
    # ============================================
    {
        "filename": "install-driving-screw.png",
        "prompt": (
            "Photorealistic image of a person's hands using a cordless impact "
            "driver to drive a galvanized steel helical ground screw into a "
            "suburban lawn. The person is wearing work gloves and jeans, kneeling "
            "on green grass. The impact driver is yellow/black (DeWalt style) with "
            "a large socket adapter attached to the screw head. The screw is about "
            "halfway driven into the ground, with the helical blade and half the "
            "shaft still visible above the grass. A string line is visible in the "
            "background, strung between two stakes, marking the fence line. "
            "Bright sunny day, suburban backyard setting. Action shot, slight "
            "motion blur on the impact driver. Photorealistic, how-to tutorial style."
        ),
    },
    {
        "filename": "install-sliding-panel.png",
        "prompt": (
            "Photorealistic image of two people installing a solar fence panel. "
            "One person holds the left side, another holds the right side of a "
            "large (5 feet tall, 3 feet wide) frameless black glass panel. They "
            "are lowering it from above into the channels of two black aluminum "
            "fence posts that are already installed about 3 feet apart. Two "
            "previously installed panels are visible to the left, already seated "
            "in their posts, forming a continuous black fence line. The scene is "
            "a suburban backyard with green grass. Bright daylight. The panel is "
            "halfway down, clearly being guided into the post channels. Shows the "
            "DIY-friendly nature of the installation. Photorealistic."
        ),
    },
    # ============================================
    # ECOSYSTEM PRODUCTS
    # ============================================
    {
        "filename": "product-gate.png",
        "prompt": (
            "Photorealistic image of a modern black solar-powered automatic gate "
            "in a residential fence line. The gate is a single-swing design, about "
            "3 feet wide and 5.5 feet tall, matching the adjacent solar fence "
            "panels exactly. The gate panel is all-black frameless glass (solar "
            "panel) in a black aluminum frame, with a sleek black smart lock "
            "keypad visible at handle height. The gate is slightly ajar (open "
            "about 20 degrees) showing the heavy-duty black hinges on the left "
            "hinge post. The hinge post is slightly wider than the fence posts "
            "(about 4 inches wide) because it contains the gate motor. Adjacent "
            "solar fence panels continue on both sides. Suburban driveway/walkway "
            "setting. Late afternoon light."
        ),
    },
    {
        "filename": "product-camera-post.png",
        "prompt": (
            "Product photography of a self-powered outdoor security camera on a "
            "black aluminum post, installed in a residential front yard garden bed. "
            "The camera post is about 4 feet tall, with a small camera housing at "
            "the top (sleek black, with a visible camera lens), a 12-inch section "
            "of small solar panels wrapping around the post below the camera, and "
            "a slim black aluminum post body below that. The post is mounted on a "
            "ground screw driven into soil among low ornamental grasses and "
            "mulch. A suburban house and driveway are visible in the background. "
            "The camera post looks like a premium landscape bollard, not a "
            "security device. Dusk lighting with the camera's small LED status "
            "light glowing green. Photorealistic, lifestyle product photography."
        ),
    },
    {
        "filename": "product-shed.png",
        "prompt": (
            "Photorealistic image of a small modern solar-powered workshop shed "
            "in a suburban backyard. The shed is approximately 8x10 feet. Its "
            "walls are made of the same black frameless glass solar panels as the "
            "Groundswell fence, held between slim black aluminum posts. The roof "
            "has solar panels mounted at a shallow angle (15 degrees). The shed "
            "has a simple black aluminum-framed door on the front face. Inside, "
            "through the slightly open door, a workbench and tool pegboard are "
            "visible. The shed sits on a gravel pad in a well-maintained backyard "
            "with a matching Groundswell solar fence visible running behind it. "
            "Late afternoon golden light. The shed looks like a premium modern "
            "outbuilding that happens to be solar-powered. Photorealistic, "
            "architectural photography style."
        ),
    },
    {
        "filename": "product-shade-sail.png",
        "prompt": (
            "Photorealistic image of a triangular shade sail stretched between "
            "three tall black aluminum posts over a residential patio dining area. "
            "The posts are about 9 feet tall, slim black anodized aluminum (about "
            "4 inches wide), each mounted on a ground screw in the lawn around the "
            "patio. The shade sail is charcoal gray fabric, tensioned taut with "
            "visible stainless steel turnbuckles at each corner. Under the shade, "
            "a teak outdoor dining table with 6 chairs is set for dinner. "
            "Standard frameless black solar panels are clamped to the faces of "
            "two of the posts (like the fence panels, mounted vertically on the "
            "post face). Modern suburban backyard with concrete paver patio, green "
            "lawn, and mature trees. Warm late afternoon sunlight filtering through "
            "the shade sail. Photorealistic architectural lifestyle photography."
        ),
    },
    # ============================================
    # CORNER & CONFIGURATION SHOTS
    # ============================================
    {
        "filename": "config-corner.png",
        "prompt": (
            "Photorealistic image of a Groundswell solar fence turning a 90-degree "
            "corner along a suburban property line. The fence is about 5.5 feet "
            "tall with black frameless glass solar panels between slim black "
            "aluminum posts. At the corner, one post has panels entering from two "
            "perpendicular directions, creating a clean right-angle turn. The fence "
            "runs about 4 panels in each direction from the corner. Green lawn on "
            "the homeowner's side, a neighboring yard visible through gaps in trees "
            "on the other side. The corner post is the same slim profile as all "
            "other posts — no special corner hardware visible. Shows how the "
            "modular system handles direction changes. Bright daylight, slight "
            "overhead angle showing the L-shaped layout. Photorealistic."
        ),
    },
    {
        "filename": "config-full-yard.png",
        "prompt": (
            "Aerial/drone-style photograph looking down at a 45-degree angle into "
            "a suburban backyard completely enclosed by a Groundswell black solar "
            "fence. The fence surrounds the yard on three sides (back and two "
            "sides), with the house on the fourth side. The black glass panel "
            "fence is about 5.5 feet tall, with slim black posts. A matching "
            "black solar gate is visible on one side for backyard access. Inside "
            "the yard: green lawn, a patio with outdoor furniture, a small garden "
            "bed, and a dog playing on the grass. The house is a typical American "
            "suburban home (ranch style or craftsman). The fence looks like a "
            "premium black privacy fence from this angle — you wouldn't know it's "
            "solar unless told. Bright sunny day. Drone photography angle, about "
            "30 feet elevation. Photorealistic."
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
        model = genai.GenerativeModel(MODEL)
        response = model.generate_content(
            [prompt],
            generation_config=genai.GenerationConfig(
                response_modalities=["image", "text"],
            ),
        )

        # Extract image data from response
        if response.candidates:
            for part in response.candidates[0].content.parts:
                if hasattr(part, "inline_data") and part.inline_data:
                    image_data = part.inline_data.data
                    with open(filepath, "wb") as f:
                        f.write(image_data)
                    print(f"  SAVED: {filename} ({len(image_data)} bytes)")
                    return True

        print(f"  FAILED (no image in response): {filename}")
        return False

    except Exception as e:
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
        # Rate limiting — be polite to the free tier
        if i < len(IMAGES):
            time.sleep(3)

    print()
    print(f"Done. {success} succeeded, {failed} failed.")
    print(f"Images saved to: {OUTPUT_DIR}")

    if success > 0:
        print()
        print("Next steps:")
        print("  1. Review generated images in the output directory")
        print("  2. Re-run with different prompts if needed (existing images are skipped)")
        print("  3. Copy chosen images to /images/ and update index.html")
        print("  4. git add -A && git commit && git push")


if __name__ == "__main__":
    main()

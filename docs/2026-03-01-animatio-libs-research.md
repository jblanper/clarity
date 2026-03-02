# Comprehensive Animation Library Research (Early 2026)

Based on thorough web research, here's a factual comparison of React/Next.js animation libraries:

---
1. Framer Motion / Motion (v12+)

Package Name & Version:
- Package name is now motion (not framer-motion), though framer-motion still exists for legacy projects
- Latest version: 12.34.3 (released February 20, 2026)
- GitHub: 30.7k stars | Weekly NPM downloads: 8.1 million

Bundle Size (gzipped):
- Full Motion package: ~34 KB minified+gzipped
- With LazyMotion + m component: 4.6 KB (dramatically reduced)
- Options:
    - Mini (2.3 KB): basic animations
    - Hybrid (17 KB): animations + variants + exit animations + tap/hover/focus gestures
    - Full domMax (adds pan/drag + layout animations): +25 KB additional

Key Features:
- AnimatePresence for enter/exit animations
- Layout animations (via layoutId and layout props)
- Height: auto support via JavaScript calculation (not CSS-native)
- Excellent Next.js App Router support (requires "use client" directive)
- Tree-shaking support improved (version 12.7.2+ added "sideEffects": false to motion-dom and motion-utils packages)

Next.js App Router Compatibility:
- Requires "use client" directive because it depends on browser APIs (window object)
- Two approaches:
    a. Add "use client" at top of file
    b. Use import * as motion from "motion/react-client" instead
- Static exports work fine with client components

Strengths: Feature-rich, well-maintained, excellent for complex animations, great performance with LazyMotion optimization

Limitations: Large base bundle unless you use LazyMotion pattern; not tree-shakeable below 34 KB without LazyMotion

---
2. Auto-animate (FormKit)

Package & Version:
- Package: @formkit/auto-animate
- Latest version: 0.9.0
- GitHub: 13k+ stars | Weekly NPM downloads: 200k+

Bundle Size:
- ~3.28 KB (extremely lightweight)
- Smallest of all major animation libraries

API:
- React hook: useAutoAnimate() from @formkit/auto-animate/react
- Returns [ref, enable] tuple; apply ref to parent element
- Zero-config, drop-in solution

Capabilities:
- Handles enter/exit animations
- List reordering animations (automatic)
- Accordion open/close animations
- Height: auto collapses (uses JavaScript measurement technique, not CSS-native)

Limitations:
- Very limited feature set compared to Motion
- Not suitable for complex gesture-driven animations or page transitions
- No layout animations equivalent
- No AnimatePresence-like explicit exit control
- Best for simple UI transitions (lists, accordions, modals)

Next.js App Router: Works perfectly with client components and static exports

Strengths: Incredibly lightweight, zero-config, perfect for subtle list animations, accessibility-focused

Limitations: Too basic for complex animations; limited control over animation timing/easing

---
3. React Spring

Package & Version:
- Latest stable version: active development
- GitHub: 29k stars | Weekly NPM downloads: 788k

Bundle Size:
- Larger than Motion alternatives (exact modern size not clearly documented in 2026 searches, but historically ~30-40 KB)
- Physics-based animations have inherent complexity

API Complexity:
- Spring-based physics model requires different mindset from declarative APIs
- Uses hooks like useSpring(), useTrail(), useChain()
- Configuration via spring constants (tension, friction) rather than duration/easing
- Steeper learning curve

Capabilities:
- Spring physics (realistic, natural-feeling motion)
- Complex chained animations
- React 18+ compatibility (via v9)
- Server Component safe (with proper "use client" wrapping)

Limitations:
- Overkill for subtle UI transitions — physics-based approach adds unnecessary complexity for simple fade/slide animations
- Bundle size larger than lightweight alternatives
- Smaller ecosystem than Motion

Next.js App Router: Compatible with App Router but requires "use client" directive

Strengths: Excellent for organic, physics-based animations; great for interactions that need to feel "alive"

Limitations: Overcomplicated for simple transitions; heavier bundle; steeper learning curve

---
4. Motion One

Package & Version:
- Vanilla JS library (NOT specifically a React wrapper)
- React integration available via motion/react
- Version tracking: Included in the broader Motion package (12.34.3)

Bundle Size:
- Core animate() API: 3.8 KB (very lightweight)
- Target: 1.8 KB with further improvements
- Approximately half the size of Anime.js and 1/7th the size of GSAP

API:
- Vanilla JavaScript imperative API (animate() function)
- React integration via hooks is less seamless than Motion/Framer Motion
- No built-in AnimatePresence equivalent for React
- Lower-level control, requires more manual orchestration

Capabilities:
- WAAPI (Web Animations API) foundation
- Excellent performance on modern browsers
- Suitable for scroll-triggered animations, SVG animations
- Can handle complex timelines

Limitations:
- Not React-optimized — requires extra work to integrate with component lifecycle
- No AnimatePresence equivalent
- Vanilla-first design means React ergonomics are secondary
- Smaller ecosystem than Motion/Framer Motion

Next.js App Router: Works but requires careful integration with client components

Strengths: Extremely lightweight; excellent performance; good for vanilla JS use cases

Limitations: Not ideal for React-specific patterns; lacks React component abstractions; requires more manual work

---
5. Other Lightweight Options

React Transition Group
- Bundle size: 6.9 KB gzipped (22.4 KB minified)
- GitHub: 10k+ stars | Weekly downloads: 10 million
- Status: No longer actively maintained (important for 2026)
- Use case: Simple CSS-based enter/exit transitions
- Limitation: Deprecated; not recommended for new projects

@headlessui/react Transition
- Part of larger Headless UI package
- Uses native CSS transition attributes
- Very lightweight integration
- Good for styled-component-based transitions
- Limitation: Limited to CSS transitions, no JavaScript-driven animations

Anime.js
- Bundle size: ~7.6 KB
- Vanilla JS first (good SVG support)
- Not React-optimized

GSAP
- Bundle size: ~34 KB (Anime.js equivalent)
- Professional-grade, powerful
- Not specifically designed for React
- Overkill for most React apps

---
## Summary Comparison Table

| Library                  | Bundle (gzipped) | API Style        | React-Optimized | Complexity  | Best For                                      |
|---------------------------|------------------|------------------|------------------|-------------|-----------------------------------------------|
| Motion (LazyMotion)       | 4.6 KB           | Declarative      | ✅ Excellent     | Medium      | Complex animations, full-featured apps        |
| Auto-animate              | 3.28 KB          | Hook-based       | ✅ Yes           | Low         | List animations, accordions, simple transitions |
| Motion One                | 3.8 KB           | Vanilla JS       | ⚠️ Manual        | Low-Medium  | Performance-critical, vanilla-first           |
| React Spring              | ~35 KB           | Physics hooks    | ✅ Yes           | High        | Organic motion, complex choreography          |
| React Transition Group    | 6.9 KB           | Component-based  | ✅ Yes           | Low         | ❌ DEPRECATED (avoid)                         |
| GSAP                      | 34+ KB           | Imperative       | ❌ No            | Very High   | Professional animations (overkill for React)  |

---
Recommendations for Clarity Project

Given your tech stack (Next.js App Router, static export, TypeScript, minimal/calm design):

1. For subtle UI transitions: Use Auto-animate (3.28 KB) for simple accordion-style collapses, list reordering
2. For page transitions / complex animations: Use Motion with LazyMotion (4.6 KB) — the most React-native solution
3. Avoid: React Spring (overkill for subtle transitions), GSAP (too heavy), React Transition Group (deprecated)

Your stack doesn't need Motion One — it's better suited for vanilla JS projects. Motion (Framer Motion renamed) is the clear winner for React+Next.js ecosystem integration.

---
Sources:

- https://motion.dev/
- https://motion.dev/docs/react-installation
- https://motion.dev/docs/react-reduce-bundle-size
- https://auto-animate.formkit.com/
- https://github.com/formkit/auto-animate
- https://www.syncfusion.com/blogs/post/top-react-animation-libraries
- https://blog.logrocket.com/best-react-animation-libraries/
- https://blog.logrocket.com/exploring-motion-one-framer-motion/
- https://www.npmjs.com/package/framer-motion
- https://www.npmjs.com/package/motion
- https://www.npmjs.com/package/@formkit/auto-animate
- https://www.npmjs.com/package/react-transition-group
- https://medium.com/@dolce-emmy/resolving-framer-motion-compatibility-in-next-js-14-the-use-client-workaround-1ec82e5a0c75
- https://motion.dev/docs/react-upgrade-guide
- https://www.syncfusion.com/blogs/post/top-react-animation-libraries
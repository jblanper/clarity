# Interaction & Motion Audit

Calma principles reviewed against every interactive element and animation.
Severity: High (breaks experience or accessibility) · Medium (noticeable deviation)
· Low (polish/consistency)

---

## 1. Transition completeness

### Passing
| Element | File | Classes |

### Missing
| Element | File | Issue | Severity |

## 2. Motion library usage

### Duration violations
| Component | File | Duration | Severity |

### Easing violations
| Component | File | Current easing | Expected | Severity |

### Height reveal violations
| Component | File | Issue | Severity |

### Directional slide violations
| Component | File | Issue | Severity |

### Exit snap violations
| Component | File | Element | Missing exit zero | Severity |

### MotionProvider
[Pass or flag — verify LazyMotion + domAnimation + MotionConfig reducedMotion="user" is in place and not duplicated]

## 3. Reduced motion
[Pass or flag — list any raw CSS @keyframes without prefers-reduced-motion media query]

## 4. CSS vs Motion boundary violations
| Component | File | Current approach | Correct approach | Severity |

## 5. Scroll lock
[Pass or flag — verify DayDetail uses useLayoutEffect, not useEffect]

---

## Summary
N high · N medium · N low

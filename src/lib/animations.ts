import { type Variants, type Transition } from "framer-motion";

// ─── Transitions ──────────────────────────────────────────────────────────────

export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const smoothTransition: Transition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.25,
};

export const fastTransition: Transition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.15,
};

export const slowTransition: Transition = {
  type: "tween",
  ease: [0.16, 1, 0.3, 1],
  duration: 0.5,
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: smoothTransition,
  },
  exit: {
    opacity: 0,
    transition: fastTransition,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...smoothTransition, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: fastTransition,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...smoothTransition, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: fastTransition,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: fastTransition,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...smoothTransition, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: fastTransition,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...smoothTransition, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: 16,
    transition: fastTransition,
  },
};

export const slideInBottom: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...smoothTransition, ease: [0.16, 1, 0.3, 1], duration: 0.4 },
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: { ...fastTransition, ease: [0.4, 0, 0.84, 0] },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export const staggerChildrenFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -2,
    transition: springTransition,
  },
  tap: {
    scale: 0.98,
    transition: fastTransition,
  },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: fastTransition,
  },
};

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: fastTransition,
  },
  exit: {
    opacity: 0,
    transition: fastTransition,
  },
};

export const drawerVariants: Variants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { ...smoothTransition, ease: [0.16, 1, 0.3, 1], duration: 0.35 },
  },
  exit: {
    x: "-100%",
    transition: { ...fastTransition, ease: [0.4, 0, 0.84, 0], duration: 0.25 },
  },
};

export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -4,
    transition: fastTransition,
  },
};

export const sidebarVariants: Variants = {
  expanded: {
    width: 240,
    transition: { ...smoothTransition, ease: [0.16, 1, 0.3, 1], duration: 0.3 },
  },
  collapsed: {
    width: 64,
    transition: { ...smoothTransition, ease: [0.4, 0, 0.84, 0], duration: 0.25 },
  },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...slowTransition, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: fastTransition,
  },
};

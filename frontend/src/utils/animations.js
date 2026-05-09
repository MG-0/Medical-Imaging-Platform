export const pageTransitions = {
  initial: { opacity: 0, filter: "blur(5px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  transition: { duration: 0.6 }
};

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 }
};

export const tableVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const rowVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i) => ({ 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 15, delay: i * 0.1 } 
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

export const pageVariants = {
    initial: { opacity: 0, y: 200 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            /*             ease: [0.6, -0.05, 0.01, 0.99],
             */
            ease: [0.46, 0, 0.6, 1.22],
        },
    },
};

export const loginLogo = {
    initial: { opacity: 0, y: -100 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            delay: 0.1,
            ease: [0.6, -0.05, 0.01, 0.99],
        },
    },
};

export const messageAnimation = {
    initial: { scale: 0, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            opacity: {
                duration: 0.3,
            },
            scale: {
                duration: 0.1,
            },
            ease: [0.45, 0.25, 0.55, 1],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.5,
    },
};

export const loginLanguageAnimation = {
    initialHu: { opacity: 0, x: 100 },
    initialEn: { opacity: 0, x: -100 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 1,
            ease: "easeIn",
        },
    },
};

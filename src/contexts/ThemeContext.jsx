import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Default colors based on the design system (Book 1, Unit 1)
    const [bookColor, setBookColor] = useState('var(--color-base-1)');
    const [unitColor, setUnitColor] = useState('var(--color-base-6)'); // --color-base-6 is Unit 1's "yellow-ish" secondary color

    useEffect(() => {
        // Apply the CSS variables to the root document element.
        // This allows --theme-book and --theme-unit to be accessed via CSS globally.
        document.documentElement.style.setProperty('--theme-book', bookColor);
        document.documentElement.style.setProperty('--theme-unit', unitColor);
    }, [bookColor, unitColor]);

    return (
        <ThemeContext.Provider value={{ bookColor, setBookColor, unitColor, setUnitColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

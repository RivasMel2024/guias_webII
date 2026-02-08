import { useState, useEffect } from 'react';

/**
 * Hook personalizado para sincronizar estado con localstorage
 * @param {string} key - Clave del localstorage donde se guardará el valor
 * @param {*} initialValue - Valor inicial si no hay nada en localstorage
 * @returns {Array} - [value, setValue] similar a useState
 */

export function useLocalStorage(key, initialValue) {

    // Estado inicializado desde localstorage o con el valor inicial
    const [value, setValue] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : initialValue;
        } catch (error) {
            console.error('Error al leer desde localStorage:', error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }, [key, value]);

    return [value, setValue];
}

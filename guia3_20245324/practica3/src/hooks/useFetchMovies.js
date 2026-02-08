import { useEffect, useState } from "react"

export const API_KEY = "9d48421"

/**
 * Hook personalizado para obtener peliculas
 * @param {string} query - termino de busqueda ingresado por el usuario
 * @returns {Object} - retorna un objeto con:
 *      - movies, lista de las pelis encontradas
 *      - isLoading, estado de carga de la solicitud
 *      - error, mensaje de error
 */

export function useFetchMovies(query){
    // Almacenar las pelis obtenidas
    const [movies, setMovies] = useState([])

    // Estado para indicar si la solicitud esta en curso
    const [isLoading, setIsLoading] = useState(false)

    // Estado para manejar errores
    const [error, setError] = useState("")

    useEffect( () => {
        // Si la busqueda tiene menos de 3 caracteres, limpia resultados y error
        if (query.length < 3){
            setMovies([])
            setError("")
            return
        }

        // Funcion asincrona que obtiene las peliculas de la api
        async function fetchMovies() {
            try {
                setIsLoading(true) // inicia el estado de carga
                setError(null) // reinicia errores

                // Peticion a la api
                const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
                if (!response.ok) throw new Error("Error al cargar las peliculas")

                const data = await response.json()

                if(data.Response === "False") throw new Error("No se encontraron resultados");

                setMovies(data.Search)
            } catch (error) {
                setError(error.message)
                setMovies([])
            } finally {
                setIsLoading(false) // finaliza el estado de carga
            }
        }

        fetchMovies()
    }, [query]) // Se ejecuta cada vez que cambia la consulta

    return { movies, isLoading, error }
}
import { useState } from "react"; 
import { Logo, Nav, NumResults, Search } from "./components/Nav.jsx"; 
import { Box } from "./components/Box.jsx"; 
import { MovieList } from "./components/Movie.jsx"; 
import { WatchedMoviesContainer, WatchedMoviesList, WatchedSummary } from "./components/WatchedMovie.jsx"; 
import { useFetchMovies } from "./hooks/useFetchMovies.js"; 
import { useLocalStorage } from "./hooks/useLocalStorage.js"; 
import { MovieDetails } from "./components/MovieDetails.jsx"; 

export default function App() {
    // Estado para la búsqueda de películas 
    const [query, setQuery] = useState(""); 
    
    // Obtiene películas basadas en la consulta 
    const { movies, isLoading, error } = useFetchMovies(query); 

    // Estado de películas vistas con persistencia en localStorage
    const [watched, setWatched] = useLocalStorage('watched', []);
    
    // Estado para la película seleccionada 
    const [selectedId, setSelectedId] = useState(null); 
    
    /** 
    * Maneja la selección de una película. 
    * @param {string} id - ID de la película seleccionada. 
    */ 
    function handleSelectMovie(id) { 
        setSelectedId(id); 
    } 
    
    /** 
    * Cierra los detalles de la película. 
    */ 
    function handleCloseMovie() { 
        setSelectedId(null); 
    } 
    
    /** 
    * Agrega una película a la lista de vistas. 
    * @param {Object} movie - Película a agregar. 
    */ 
    function handleAddWatched(movie) { 
        setWatched((watched) => [...watched, movie]); 
    }

    /**
    * Elimina una película de la lista de vistas.
    * @param {string} id - id de la película a eliminar.
    */
    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

    return (
        <>
            <Nav> 
                <Logo /> 
                <Search query={query} setQuery={setQuery} /> 
                <NumResults movies={movies} /> 
            </Nav> 
            <main className="main"> 
                <Box> 
                    {isLoading && <p className="loader">Cargando...</p>} 
                    {error && <p className="error">⛔ {error}</p>} 
                    <MovieList movies={movies} onSelectMovie={handleSelectMovie} /> 
                </Box>
                <Box> 
                    <WatchedMoviesContainer> 
                        {selectedId ? ( 
                            <MovieDetails 
                                selectedId={selectedId} 
                                onCloseMovie={handleCloseMovie} 
                                onAddWatched={handleAddWatched} 
                                watched={watched} 
                            /> 
                        ) : ( 
                        <> 
                            <WatchedSummary watched={watched} /> 
                            <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} /> 
                        </> 
                        )} 
                    </WatchedMoviesContainer> 
                </Box> 
            </main> 

        </>
    )
}

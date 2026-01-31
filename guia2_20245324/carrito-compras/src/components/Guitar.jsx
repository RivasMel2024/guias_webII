import React from 'react'

export const Guitar = ({guitar, addToCart}) => {
    const {id, name, image, description, price} = guitar;

    // function handleClick(guitar) {
    //     // Como los estados en react son inmutables, no se puede hacer simplemente el push, sino que se tiene que hacer uno nuevo
    //     setCart((prevState) => [...prevState, guitar]) // Usamos una función para obtener el estado anterior y le agregamos el nuevo elemento
    // }

    return (
        <div className="col-md-6 col-lg-4 my-4 row align-items-center">
            
            <div className="col-4">
                <img className="img-fluid" src={`/img/${image}.jpg`} alt="imagen guitarra" />
            </div>

            <div className="col-8">
                <h3 className="text-black fs-4 fw-bold text-uppercase">{name}</h3>
                <p>{description}</p>
                <p className="fw-black text-primary fs-3">${price}</p>
                <button type="button" onClick={() => addToCart(guitar)} className="btn btn-dark w-100">
                    Agregar al Carrito
                </button>
            </div>

        </div>
    )
}

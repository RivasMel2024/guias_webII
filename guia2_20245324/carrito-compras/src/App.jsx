import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Guitar } from './components/Guitar.jsx'
import { db } from './data/db.js'
import { useState, useEffect } from 'react'

export const App = () => {

    function initialCart(){
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data, setData] = useState(db)
    const [cart, setCart] = useState(initialCart())
    useEffect(()=>{
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart]) // se ejecuta cada vez que el carrito cambia

    
    function addToCart(guitar) {

        const itemIndex = cart.findIndex( item => guitar.id === item.id)
        console.log(itemIndex);

        if (itemIndex === -1){ // el articulo aun no existe en el carrito
            
            guitar.quantity = 1
            
            // Al estar dentro del mismo componente no es necesario pasar el setCart como prop 
            setCart([...cart, guitar])
        } else { // si ya se añadio al carrito, solo se modifca el quantity

            // Siguiendo el principio que no se pueden mutar los componentes de react, se crea una copia del carrito
            const newCart = [...cart]
            newCart[itemIndex].quantity++
            setCart(newCart)
        }        
    }

    // Funciones para modificar el carrito desde el Header
    function increaseQuantity(id) {
        const newCart = cart.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(newCart)
    }

    function decreaseQuantity(id) {
        const newCart = cart.map(item => {
            if (item.id === id && item.quantity > 1) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        }).filter(item => item.quantity > 0)
        setCart(newCart)
    }

    function removeFromCart(id) {
        setCart(cart.filter(item => item.id !== id))
    }

    function clearCart() {
        setCart([])
    }

    function calculateTotal(){
        // ########### SIN PROGRAMACION FUNCIONAL ############
        // let total = 0
        // for (const guitar of cart) {
        //     total += guitar.price * guitar.quantity    
        // }

        // ########### CON PROGRAMACION FUNCIONAL ############
        let total = cart.reduce((total, item)=> { // (acumulador, item del cart)
            total + item.price * item.quantity
        }, 0) // 0 es el valor inicial del acumulador
        return total
    }

    return (
        <>
            <Header 
                cart={cart} 
                total={calculateTotal()} 
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
            />
            <main className="container-xl mt-5">
                <h2 className="text-center">Nuestra Colección</h2>

                <div className="row mt-5">
                    {data.map(guitar => (
                        // Siempre que hacemos un recorrido de una arreglo de objetos necesitamos algo que lo identifique
                        <Guitar key={guitar.id} guitar={guitar} addToCart={addToCart} />
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}

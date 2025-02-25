import React from "react";
import ".page.module.css"

function Login(){
    return (
        <div>
            <header>
                <nav className="navbar">
                <a className="home" href="./index.html">
                    <img className="home-logo" src="/imgs/home-logo.webp" alt="Home" />
                </a>
                <a href="/resultados_busqueda">Más buscados</a>
                <a href="/registro">Registro</a>
                <a className="active" href="/login">Login</a>
                </nav>

                <h1>SUBASTA LOS DUROS</h1>
            </header>
            <main>
                <h1>Formulario de Login</h1>
                <h2>Introduce tu usario y contraseña</h2>
                <form>
                    <label htmlFor="usuario">Usuario:</label>
                    <input type="text" id="usuario" name="usuario" placeholder="vinijr23" required/>
                    <label htmlFor="contraseña">Contraseña:</label>
                    <input type="password" id="contraseña" name="contraseña" placeholder="Contraseña" required />
                    <br />
                    <br />

                    <a href="/registro">¿No tiene cuenta?</a>
                    <br />
                    <br />
                    
                    <input type="submit" value="Enviar" />
                </form>
                <br />
            </main>
            <footer>
                Creado por <b>Gonzalo Borrachero y Luis García</b> - <i>2025</i>
            </footer>
        </div>
    );
}

export default Login;
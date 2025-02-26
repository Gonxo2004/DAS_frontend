// app/page.js
"use client"; // si necesitas usar funciones del lado del cliente (eventos, etc.)

import React from "react";
import Link from "next/link";
import "./page.module.css"; // Tus estilos globales o bien un .module.css

export default function Home() {
  return (
    <div>
      {/* No es usual poner <html> o <head> aquí 
          porque Next.js 13 gestiona esa parte en layout.js 
          o con <head> dentro de page.js si así lo deseas.
       */}
      <header>
        <div className="eslogan">
          <h1>PUJA FUERTE Y GANA DURO</h1>
        </div>
        
        <nav className="navbar">
          {/* Nota: En Next.js se recomienda usar <Link> en lugar de <a> 
              para navegación interna. Pero si el archivo es puramente 
              estático, podrías dejar <a>. 
          */}
          <Link className="home" href="/">
            <img
              className="home-logo"
              src="/imgs/home-logo.webp"
              alt="Home"
            />
          </Link>

          <Link href="/subastas">Más buscados</Link>
          <Link href="/registro">Registro</Link>
          <Link href="/login">Login</Link>

          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar..."
              className="search-bar"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="categorias">
          <h2>Explora por Categorías</h2>
          <div className="categoria-grid">
            <a href="#" className="categoria-item">
              <img src="/imgs/categorias/electronica.png" alt="Electrónica" />
              <br />
              <span>Electrónica</span>
            </a>
            <a href="#" className="categoria-item">
              <img src="/imgs/categorias/moda.png" alt="Moda" />
              <br />
              <span>Moda</span>
            </a>
            <a href="#" className="categoria-item">
              <img src="/imgs/categorias/casa.png" alt="Hogar" />
              <br />
              <span>Hogar</span>
            </a>
            <a href="#" className="categoria-item">
              <img src="/imgs/categorias/deportes.avif" alt="Deportes" />
              <br />
              <span>Deportes</span>
            </a>
          </div>
        </section>

        <section className="productos-destacados">
          <h2>Subastas Destacadas</h2>
          <div className="productos-grid">
            <div className="producto">
              <img src="/imgs/destacadas/rolex.jpg" alt="Reloj de lujo" />
              <h3>Reloj Rolex</h3>
              <p>
                Oferta actual: <strong>2,500€</strong>
              </p>
              <a href="#" className="btn">
                Pujar Ahora
              </a>
            </div>
            <div className="producto">
              <img src="/imgs/destacadas/moto.avif" alt="Moto deportiva" />
              <h3>Moto Yamaha</h3>
              <p>
                Oferta actual: <strong>7,200€</strong>
              </p>
              <a href="#" className="btn">
                Pujar Ahora
              </a>
            </div>
            <div className="producto">
              <img src="/imgs/destacadas/camara.jpg" alt="Cámara profesional" />
              <h3>Cámara Sony</h3>
              <p>
                Oferta actual: <strong>1,800€</strong>
              </p>
              <a href="#" className="btn">
                Pujar Ahora
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        Creado por <b>Gonzalo Borrachero y Luis García</b> - <i>2025</i>
      </footer>
    </div>
  );
}

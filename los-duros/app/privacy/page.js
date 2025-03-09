"use client";
import React from "react";
import styles from "./page.module.css";

export default function PrivacyPage() {
  return (
    <main className={styles.privacyContainer}>
      <h1>Política de Privacidad</h1>
      <section>
        <h2>1. Introducción</h2>
        <p>
          En Los Duros , nos tomamos muy en serio la protección de tus datos personales. Esta política de privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información en nuestra plataforma de subastas en línea.
        </p>
        <p>
          Al utilizar nuestros servicios, aceptas los términos de esta política. Si no estás de acuerdo con ellos, te recomendamos que no uses nuestra plataforma.
        </p>
      </section>
      <section>
        <h2>2. Información que Recopilamos</h2>
        <ul>
          <li><strong>Datos de Registro:</strong> Nombre, correo electrónico, teléfono, dirección, información de pago.</li>
          <li><strong>Datos de Navegación:</strong> Dirección IP, tipo de dispositivo, sistema operativo, páginas visitadas, cookies y tecnologías similares.</li>
          <li><strong>Datos de Transacciones:</strong> Historial de compras, ventas, pujas realizadas, métodos de pago utilizados.</li>
        </ul>
      </section>
      <section>
        <h2>3. Uso de la Información</h2>
        <p>Usamos la información recopilada para:</p>
        <ul>
          <li>Permitir el acceso y uso de la plataforma de subastas.</li>
          <li>Procesar pagos y garantizar la seguridad de las transacciones.</li>
          <li>Enviar notificaciones sobre pujas, subastas y promociones.</li>
          <li>Mejorar nuestros servicios y la experiencia del usuario.</li>
          <li>Cumplir con obligaciones legales y regulatorias.</li>
        </ul>
      </section>
      <section>
        <h2>4. Compartición de Datos</h2>
        <p>No vendemos, alquilamos ni compartimos tus datos con terceros, salvo en los siguientes casos:</p>
        <ul>
          <li>Proveedores de servicios que nos ayudan en la operación de la plataforma (procesadores de pagos, servicios de envío, etc.).</li>
          <li>Autoridades legales, si es requerido por ley o para proteger nuestros derechos.</li>
        </ul>
      </section>
      <section>
        <h2>5. Seguridad de la Información</h2>
        <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra accesos no autorizados, pérdidas o alteraciones. Sin embargo, ninguna transmisión de datos por internet es 100% segura.</p>
      </section>
      <section>
        <h2>6. Derechos del Usuario</h2>
        <p>Tienes derecho a:</p>
        <ul>
          <li>Acceder, corregir o eliminar tus datos personales.</li>
          <li>Oponerte al uso de tus datos para ciertos fines.</li>
          <li>Retirar tu consentimiento en cualquier momento.</li>
        </ul>
        <p>Para ejercer estos derechos, contáctanos a [correo electrónico de contacto].</p>
      </section>
      <section>
        <h2>7. Cookies y Tecnologías Similares</h2>
        <p>Utilizamos cookies para mejorar la experiencia del usuario, analizar el tráfico y personalizar contenidos. Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar algunas funcionalidades del sitio.</p>
      </section>
      <section>
        <h2>8. Cambios en la Política de Privacidad</h2>
        <p>Podemos actualizar esta política en cualquier momento. Cualquier cambio será publicado en nuestra página y, si es significativo, te lo notificaremos por correo electrónico.</p>
      </section>

    </main>
  );
}
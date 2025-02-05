document.addEventListener("DOMContentLoaded", function() {
    function comparar_ciudades() {
        const ciudadesPorComunidad = {
            "Andalucía": ["Sevilla", "Málaga", "Córdoba", "Granada", "Cádiz"],
            "Aragón": ["Zaragoza", "Huesca", "Teruel"],
            "Asturias": ["Oviedo", "Gijón", "Avilés"],
            "Canarias": ["Santa Cruz de Tenerife", "Las Palmas de Gran Canaria"],
            "Cantabria": ["Santander", "Torrelavega"],
            "Castilla-La Mancha": ["Albacete", "Ciudad Real", "Toledo"],
            "Castilla y León": ["Valladolid", "Burgos", "Salamanca", "León"],
            "Cataluña": ["Barcelona", "Tarragona", "Girona", "Lleida"],
            "Comunidad de Madrid": ["Madrid", "Alcalá de Henares", "Getafe", "Móstoles"],
            "Comunidad Valenciana": ["Valencia", "Alicante", "Castellón"],
            "Extremadura": ["Badajoz", "Cáceres", "Mérida"],
            "Galicia": ["Santiago de Compostela", "A Coruña", "Vigo"],
            "La Rioja": ["Logroño", "Calahorra"],
            "Murcia": ["Murcia", "Cartagena", "Lorca"],
            "Navarra": ["Pamplona", "Tudela"],
            "País Vasco": ["Bilbao", "San Sebastián", "Vitoria"],
        };
        
        const comunidadSelect = document.getElementById('comunidad');
        const ciudadSelect = document.getElementById('ciudad');

        // Evento que se lanza al cambiar la comunidad
        comunidadSelect.addEventListener('change', function() {
            // 1) Vaciamos las opciones anteriores
            ciudadSelect.innerHTML = '<option value="">-- Selecciona tu ciudad --</option>';
            
            // 2) Deshabilitamos el select de ciudad si no se selecciona comunidad
            if (!comunidadSelect.value) {
                ciudadSelect.disabled = true;
                return;
            }
            
            // 3) Llenamos el select con las ciudades y lo habilitamos
            ciudadSelect.disabled = false;
            const ciudades = ciudadesPorComunidad[comunidadSelect.value] || [];

            ciudades.forEach(ciudad => {
                const option = document.createElement('option');
                option.value = ciudad;
                option.textContent = ciudad;
                ciudadSelect.appendChild(option);
            });
        });
    }

    // Llamamos a la función para que haga el "enganche" de eventos
    comparar_ciudades();
});

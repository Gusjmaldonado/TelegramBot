EJECUCIÓN: /tiempo Madrid
/tiempo Barcelona

Rescatar el nombre de la ciudad
Dentro de ctx.message viene el texto completo que estamos enviando (/tiempo Madrid).
Del string anterior hay que recuperar la ciudad
Hay que llamar a la API de Openweathermap
GET https://api.openweathermap.org/data/2.5/weather?q=CIUDAD&appid=12cc61f3282afaca14152a6185f43de0&units=metric
Para hacer la llamada usamos axios
Instalar axios
Lanzar petición GET con axios
Una vez recuperamos la información de la API, respondemos en el bot con: temperatura actual, temperatura máxima, temperatura mínima y humedad
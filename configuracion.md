## Configuración del archivo `config.js`

1. **Número del propietario**

   Reemplaza el número existente por el número que deseas que sea el propietario del bot. Asegúrate de incluir también tu nombre. Aquí tienes un ejemplo de cómo hacerlo:

   ```js
   global.owner = [
    ['Tu número', 'Tu nombre', true]
   ]
   ```

   Por ejemplo, si mi número es ‘5216673877887’ y mi nombre es ‘Zeppth’, entonces debo escribir:
   ```js
   global.owner = [
   ['5216673877887', 'Zeppth', true]
   ]
   ```
   Tambien puedes editar este parametro :
   ```js
   //moderadores :
   global.mods = ['5216673877887']

   // premiums :
   global.prems = ['5216673877887']
   ```

   Recuerda poner el prefijo del país, pero no coloques ningún “+”.

2. **Agregar más números de propietarios**

   Si deseas agregar más de un número de propietario, simplemente debes agregar el número en un array, como se muestra a continuación:
   ```js
   global.owner = [
    ['Tu número', 'Tu nombre', true],
   // Agrega más números de propietarios aquí
    ['52199999999999'],
    ['Número 2'],
    ['Número 3'],
   // ...
   ]
   ```
   
3. **Edita la experiencia y las monedas del bot**

   Cuando se inicia el bot, se asigna una cantidad predeterminada de experiencia y monedas a cada usuario en su balance. Si deseas cambiar estos valores, puedes hacerlo editando las siguientes líneas :

   ```js
   global.rpg = {
    data: {
        exp: 0,
        coin: 10,
        nivel: 0,
        role: 'Novato'
    }
   }
   ```


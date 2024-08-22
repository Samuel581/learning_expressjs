# Usa una imagen base de Node.js
FROM node:16

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y yarn.lock
COPY package.json yarn.lock ./

# Instala las dependencias
RUN yarn install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que correrá la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["yarn", "start"]

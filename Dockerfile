# Etapa 1: Construir a aplicação
FROM node:20 AS build

# Diretório de trabalho no contêiner
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código-fonte
COPY . .

# Etapa 2: Preparar a imagem final
FROM node:20

# Diretório de trabalho no contêiner
WORKDIR /app

# Copiar dependências da etapa de build
COPY --from=build /app/node_modules /app/node_modules

# Copiar o código-fonte da etapa de build
COPY --from=build /app /app

# Expõe a porta que o app vai usar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]

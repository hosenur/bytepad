from ubuntu
run apt update
run apt install curl -y
run apt install -y nodejs npm 
run npm i -g n
run n install lts
run corepack enable
workdir /app
run yarn create vite bytereact --template react-swc-ts
workdir /app/bytereact
expose 5173

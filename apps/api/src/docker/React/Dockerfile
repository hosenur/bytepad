from ubuntu
run apt update
run apt install curl -y
run apt install -y nodejs npm 
run npm i -g n
run n install lts
run corepack enable
workdir /app
run pnpm create vite bytereact --template react-swc-ts
workdir /app/bytereact
run sed -i 's/"dev": "vite",/"dev": "vite --host",/' package.json
run pnpm
expose 5173
run pnpm dev --host

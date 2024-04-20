# Bytepad
## Tech Stack
**Client:** React, Vite, SWR, Monaco Editor, Xterm, Tailwind, Clerk

**Server:** NodeJS, Express, Docker Engine API, AWS S3, Clerk, Prisma

## View Project
| System | URL     | Description                |
| :-------- | :------- | :------------------------- |
| `Frontend` | [bytepad.pro](https://bytepad.pro) |  Hosted on Vercel |
| `Backend` | [hosenur.cloud](https://hosenur.cloud) | Hosted on Digital Ocean, Handles the backend, and project previews on subdomains |


## Important Implementation Details :
- Everything is executed inside a docker container, which creates and isolated sandbox environment for projects.
- No arbitrary / user entered command is ran on the host machine.
- Used Nginx proxy to map `*project-id.domain.com` to the port which is running the project with the project ID to  preview of the currently running web app.
- Every endpoint is behind auth, only authenticated users can create projects, view projects they are a part of, delete.
## Initial Architecture :
During the inital build of this projct, I created framework specifc `Dockerfile`, which roughly did the following things :
- Created a Ubuntu Container
- Performed some misc tasks : Update + Install Node LTS + Install PNPM
- Created the project using command
- Replaced the framework specifc `dev` command to `dev --host` because that would make the exposed port accessible from the host machine, in our case which will be accessed via Nginx proxy to make it accessible to the internet.
- Exposed the port

Here is an exmaple for a React + TypeScript + SWC project using [Vite](https://vitejs.dev/guide/)
```Dockerfile
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
run pnpm i
expose 5173
```
And then created an image which I would use in future to build containers when someone created a Playground, which sums up to **(Caveat : 1) A new container for every project created.**, I had to fix that because this is a massive storage hog, The size of the image using Ubuntu after building it was **approx: 1.5GB**,And I cant delete the image too because the project was stored only inside the image and persisted no where else, I modified the images to run on **Alpine** insteead, doing this reduced the image size to **approx 300MB** (Improvement of ~ 82%), But doing this would still meant **(Caveat 2) Blocking 300MB of storage for every project**. Both image size mentioned is without `node_modules`, which meant more space hog.
## Current Architecture:
The current architecture,(Abstractly how it works in Codedamn) which the project is built on used Alpine for the Image, but doesn't create a new image for every new project, but rather has a template library containing a Skeleton project for each project framework, when a new project is created an instance of the template is uploaded to AWS S3, then copied to a Alpine instance, and then is synced with S3 after any changes by the user.

- Running the project in a docker container basically meant running on an  isolated env, still `chroot` is implemented to set the root directory so that the user is not allowed to go out of the project folder in the container. 
ok
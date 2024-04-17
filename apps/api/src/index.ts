import { app } from "./app";

function bootstrap() {
  app.listen(app.get("port"), () => {
    console.log(
      `Server running on http://${app.get("host")}:${app.get("port")}`
    );
  });
}

bootstrap();

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

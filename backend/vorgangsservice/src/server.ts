import { app } from "./app";

const port = 3000;
app.listen(port, () =>
  console.log(`Vorgangsservice läuft auf http://localhost:${port}`)
);

import server, { solution } from "./index.mjs";

const port = 5000;

server.listen(port, () => {
    solution();
    console.log(`Server running on port ${port}`);
});
  
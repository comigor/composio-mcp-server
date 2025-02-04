import dotenv from "dotenv";
dotenv.config({
    path: ".env",
});
(async () => {
    await import("./build/index.js");
})();
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var scraper_1 = __importDefault(require("./routes/scraper"));
var app = express_1.default();
app.get("/", function (req, res) {
    res.send("hello world");
});
app.use("/api/user", scraper_1.default);
app.listen(3000, function () {
    console.log("Server listening on port 3000");
});
//# sourceMappingURL=index.js.map
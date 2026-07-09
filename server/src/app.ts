import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { corsOptions } from "./config/cors";
import { generalLimiter } from "./middleware/rate-limit.middleware";
import { errorHandler } from "./middleware/error.middleware";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(generalLimiter);

app.use("/api", routes);

app.use(errorHandler);

export default app;

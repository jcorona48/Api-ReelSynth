import { ApolloServer } from "apollo-server-express";
import express from "express";
import { PORT } from "./config.js";
import typeDefs from "./GraphQL/Schemas/index.js";
import resolvers from "./GraphQL/Resolvers/index.js";
import morgan from "morgan";
import { connectDB } from "./db.js";
import Routes from "./Routes/index.route.js";

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use("/api", Routes);

const svrApollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: any }) => {
        const token = req.headers["x-token"] || "";
        return { req, token };
    },
});

async function start() {
    await svrApollo.start();
    await svrApollo.applyMiddleware({ app });
    connectDB();

    app.listen(PORT, () => {
        console.log(`Servidor iniciado en el puerto ${PORT}`);
        console.log(`http://localhost:${PORT}/api`);
        console.log(`http://localhost:${PORT}/graphql`);
    });
}

// Inicia el servidor
start();

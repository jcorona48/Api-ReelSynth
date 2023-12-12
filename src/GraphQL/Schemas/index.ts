import { mergeTypeDefs } from "@graphql-tools/merge";
import fs from "fs";

// Leemos cada uno de los archivos de los Schemas
// const userSchema = fs.readFileSync("./src/GraphQL/Schemas/user.graphql", "utf8");

const roleSchema = fs.readFileSync("./src/GraphQL/Schemas/role.graphql", "utf8");
const userSchema = fs.readFileSync("./src/GraphQL/Schemas/user.graphql", "utf8");
const genrerSchema = fs.readFileSync("./src/GraphQL/Schemas/genrer.graphql", "utf8");
const movieSchema = fs.readFileSync("./src/GraphQL/Schemas/movie.graphql", "utf8");
const studioSchema = fs.readFileSync("./src/GraphQL/Schemas/studio.graphql", "utf8");
const producerSchema = fs.readFileSync(
    "./src/GraphQL/Schemas/producer.graphql",
    "utf8"
);
const serieSchema = fs.readFileSync("./src/GraphQL/Schemas/serie.graphql", "utf8");
const seasonSchema = fs.readFileSync("./src/GraphQL/Schemas/season.graphql", "utf8");
const episodeSchema = fs.readFileSync("./src/GraphQL/Schemas/episode.graphql", "utf8");
const hostSchema = fs.readFileSync("./src/GraphQL/Schemas/host.graphql", "utf8");
const countrySchema = fs.readFileSync("./src/GraphQL/Schemas/country.graphql", "utf8");
const commentSchema = fs.readFileSync("./src/GraphQL/Schemas/comment.graphql", "utf8");
const likeSchema = fs.readFileSync("./src/GraphQL/Schemas/like.graphql", "utf8");
const rateSchema = fs.readFileSync("./src/GraphQL/Schemas/rate.graphql", "utf8");
const videoSchema = fs.readFileSync("./src/GraphQL/Schemas/video.graphql", "utf8");
const companySchema = fs.readFileSync("./src/GraphQL/Schemas/company.graphql", "utf8");
// Unimos todos los Schemas en uno solo
const typeDefs = mergeTypeDefs([
    roleSchema,
    countrySchema,
    hostSchema,
    genrerSchema,
    producerSchema,
    studioSchema,
    userSchema,
    movieSchema,
    serieSchema,
    seasonSchema,
    episodeSchema,
    commentSchema,
    likeSchema,
    rateSchema,
    videoSchema,
    companySchema,
]);
export default typeDefs;

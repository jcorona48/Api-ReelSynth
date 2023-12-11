import Host from "../Models/Host.js";
import { verifyToken } from "../utils/Token.js";
import { verifyAdmin } from "../utils/auth.js";
import { HostType } from "../Types/Host.js";
import { ContextInput } from "../Types/Context.js";
import { filter } from "../helpers/Filter.js";

interface HostInput {
    id: string;
    input: HostType;
}

// Querys
const getHosts = async (_: any, { input }: HostInput) => {
    const query = filter(input);
    const hosts = await Host.find(query);
    return hosts;
};

const getHost = async (_: any, { id }: HostInput) => {
    if (!id) throw new Error("No se ha enviado un ID");
    const host = await Host.findById(id);
    if (!host) throw new Error("No se ha encontrado la Host");
    return host;
};

// Mutations
const createHost = async (
    _: any,
    { input }: HostInput,
    { token }: ContextInput
) => {
    try {
        const userToken = verifyToken(token);
        if (typeof userToken === "string") throw new Error(userToken);
        verifyAdmin(userToken);
        const newHost = new Host(input);
        await newHost.save();
        return newHost;
    } catch (error) {
        console.log(error);
        throw new Error("Error al crear la Host: " + error);
    }
};

const updateHost = async (
    _: any,
    { id, input }: HostInput,
    { token }: ContextInput
) => {
    try {
        //console.log(id, input)
        const userToken = verifyToken(token);
        if (typeof userToken === "string") throw new Error(userToken);
        verifyAdmin(userToken);
        if (!id) throw new Error("No se ha enviado un ID");
        const host = await Host.findByIdAndUpdate(id, input, { new: true });
        if (!host) throw new Error("No se ha encontrado la Host");
        return host;
    } catch (error) {
        console.log(error);
        throw new Error("Error al actualizar la Host: " + error);
    }
};

export const hostResolvers = {
    Query: {
        getHosts,
        getHost,
    },
    Mutation: {
        createHost,
        updateHost,
    },
};

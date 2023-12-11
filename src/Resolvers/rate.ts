import Rate from "../Models/Rate.js";
import { filter } from "../helpers/Filter.js";
import User from "../Models/User.js";
import { verifyToken } from "../utils/Token.js";
import { getModel } from "../helpers/models.js";
import { RateType } from "../Types/Rate.js";
import { ContextInput } from "../Types/Context.js";

interface RateInput {
    id: string;
    input: RateType;
    entityID: string;
    rate: number;
}

const updateCounter = async (rating: RateType) => {
    const { entityID, entityType, status, rate } = rating;

    try {
        const entity = ((await getModel(entityType)) as any).findById(entityID);

        entity.rateCount += status !== "DELETED" ? 1 : -1;
        entity.rateTotal += status !== "DELETED" ? rate : -rate;
        entity.rating = entity.rateTotal / entity.rateCount;
        await entity.save();
        return entity;
    } catch (error) {
        console.error("Error updating rate count:", error);
    }
};

// Querys
const getRates = async (_: any, { input }: RateInput) => {
    console.log(input);
    const query = filter(input);
    const rates = await Rate.find(query)
        .populate({
            path: "entityID",
        })
        .populate({
            path: "user",
            populate: {
                path: "role country",
            },
        });

    return rates;
};

const getRate = async (
    _: any,
    { entityID }: RateInput,
    { token }: ContextInput
) => {
    const userToken = verifyToken(token);
    if (typeof userToken === "string") throw new Error(userToken);
    const rate = await Rate.findOne({ user: userToken.id, entityID })
        .populate({
            path: "entityID",
        })
        .populate({
            path: "user",
            populate: {
                path: "role country",
            },
        });

    return rate;
};

// Mutations
const createRate = async (
    _: any,
    { input }: RateInput,
    { token }: ContextInput
) => {
    try {
        if (!input) throw new Error("No se ha enviado el input");
        const userToken = verifyToken(token);
        if (typeof userToken === "string") throw new Error(userToken);
        const newRate: any = new Rate({ ...input, user: userToken.id });
        await newRate.save();

        newRate.entityID = await (getModel(newRate.entityType) as any).findById(
            newRate.entityID
        );
        newRate.user = await User.findById(newRate.user).populate({
            path: "role country",
        });
        await updateCounter(newRate);

        return newRate;
    } catch (error) {
        console.log(error);
        throw new Error("Error al crear el Rate: " + error);
    }
};

const updateRate = async (
    _: any,
    { entityID, rate }: RateInput,
    { token }: ContextInput
) => {
    // genera este codigo
    const userToken = verifyToken(token);
    if (typeof userToken === "string") throw new Error(userToken);
    const rated: any = await Rate.findOne({ entityID, user: userToken.id });
    if (!rated) throw new Error("No se encontro el rate");

    const rateDiff = rate - rated.rate;
    rated.rate = rate;
    rated.status = "EDITED.js";
    await rated.save();

    const entity = await (getModel(rated.entityType) as any).findById(
        rated.entityID
    );

    entity.rateTotal += rateDiff;
    entity.rating = entity.rateTotal / entity.rateCount;

    entity.save();

    rated.entityID = entity;

    rated.user = await User.findById(rated.user).populate({
        path: "role country",
    });

    return rated;
};

const deleteRate = async (
    _: any,
    { entityID }: RateInput,
    { token }: ContextInput
) => {
    try {
        const userToken = verifyToken(token);
        if (typeof userToken === "string") throw new Error(userToken);
        const rate: any = await Rate.findOneAndDelete(
            {
                user: userToken.id,
                entityID,
            },
            { new: true }
        )
            .populate({
                path: "entityID",
            })
            .populate({
                path: "user",
                populate: {
                    path: "role country",
                },
            });
        if (!rate) throw new Error("No se ha encontrado el Rate");
        rate.status = "DELETED.js";
        updateCounter(rate);
        return rate;
    } catch (error) {
        console.log(error);
        throw new Error("Error al actualizar el Rate: " + error);
    }
};

export const rateResolvers = {
    Query: {
        getRates,
        getRate,
    },
    Mutation: {
        createRate,
        updateRate,
        deleteRate,
    },
};

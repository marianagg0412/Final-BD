//Basic queries
//1
db.comics.find({ price: { $lt: 20 } }).sort({ title: 1 });
//2
db.characters.aggregate([
    {
        $lookup: {
            from: "characterxpower",
            localField: "id",
            foreignField: "characterid",
            as: "powers"
        }
    },
    { $unwind: "$powers" },
    {
        $lookup: {
            from: "powers",
            localField: "powers.powerid",
            foreignField: "id",
            as: "powerDetails"
        }
    },
    {
        $unwind: "$powerDetails"
    },
    {
        $match: {
            type: "Hero",
            "powerDetails.name": { $regex: /flight/i }  // ILIKE equivalent
        }
    },
    {
        $group: {
            _id: {
                id: "$id",
                name: "$name",
                type: "$type",
                powerName: "$powerDetails.name"
            }
        }
    },
    {
        $project: {
            _id: 0,
            id: "$_id.id",
            name: "$_id.name",
            type: "$_id.type",
            powerName: "$_id.powerName"
        }
    }
]);


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

//Medium queries
//1
db.characters.find({defeats: {$gt: 3}, type: "Villain"});

//2
db.transactions.aggregate([
    {
        $lookup:{
            from: "comics",
            localField: "comicId",
            foreignField: "_id",
            as: "comicDetails"
        }
    },
    {$unwind: "$comicDetails"},
    {
        $group:{
            _id: "$customerId",
            totalAmount: {$sum: "$comicDetails.price"},
            comicsPurchased: { $sum: 1 }
        }
    },
    {
        $match: {comicsPurchased: {$gte: 5  }}
    },
    {$sort: {totalAmount: -1}}
]);

//Advanced queries
//1
db.transactions.aggregate([
    {
        $lookup: {
            from: "comics",
            localField: "comicId",
            foreignField: "_id",
            as: "comicDetails"
        }
    },
    { $unwind: "$comicDetails" },
    {
        $lookup: {
            from: "categories",
            localField: "comicDetails.category",
            foreignField: "_id",
            as: "categoryDetails"
        }
    },
    { $unwind: "$categoryDetails" },
    {
        $group: {
            _id: "$categoryDetails.name",
            most_popular: { $count: {} }
        }
    },
    { $sort: { most_popular: -1 } },
    { $limit: 1 }
]);

//2
db.characters.aggregate([
    {
        $lookup: {
            from: "groups",
            localField: "groupId",
            foreignField: "_id",
            as: "groupDetails"
        }
    },
    { $unwind: "$groupDetails" },
    {
        $match: {
            $or: [
                { "groupDetails.name": "Avengers" },
                { "groupDetails.name": "Justice League" }
            ]
        }
    },
    {$project: {name: 1, group: "$groupDetails.name"}}
]);

//3
db.comics.aggregate([
    {
        $lookup: {
            from: "comicxcharacter",
            localField: "_id",
            foreignField: "comicid",
            as: "characterDetails"
        }
    },
    { $unwind: "$characterDetails" },
    {
        $lookup: {
            from: "characters",
            localField: "characterDetails.characterid",
            foreignField: "_id",
            as: "characters"
        }
    },
    { $unwind: "$characters" },
    {
        $lookup: {
            from: "weapons",
            localField: "characters._id",
            foreignField: "characterId",
            as: "weapons"
        }
    },
    {
        $match: {
            description: { $regex: /epic hero-villain battle/i },
            "weapons.0": { $exists: true }  // Checks that at least one weapon is associated with each character
        }
    },
    {
        $project: {
            _id: 1,
            title: 1,
            description: 1,
            "characters.name": 1,
            "weapons.name": 1  // Only include necessary fields
        }
    }
]);







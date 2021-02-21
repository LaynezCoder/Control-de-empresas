db.companies.aggregate(
    { $unwind: "$employees" },
    { $match: { "employees.name": "Alberto" } },
    { $project: { _id: false, name: "$employees.name" } }
)

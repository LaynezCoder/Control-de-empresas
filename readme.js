
/**
 * Cuantos datos se necesitan o son los minimos para el modelo de datos
 * obtener empleados por el id nombre y demas
 * Ver algunas modificaciones o validaciones por hacer, probar de nuevo
 */
function getEmployeesForId(req, res) {
    let companyId = req.params.idC;
    let employeeId = req.params.idE;

    if (companyId == req.user.sub) {
        Company.aggregate([
            { $unwind: "$employees" },
            { $match: { "employees.name": "Alberto" } },
            { $project: { _id: false, name: "$employees.name" } }

        ], (err, employee) => {
            if (err) {
                res.status(500).send({ message: 'General server error!' });
            } else if (employee) {
                res.status(200).send({ message: 'Employees: ', employee: employee.employees })
            } else {
                res.status(404).send({ message: 'Courses not added' });
            }
        })
    } else {
        res.send({ message: 'You cannot view a course that is not yours!' });
    }
}



/**
 * Get functions
 * VALIDAR NO BUSCAR DE OTRAS EMPRESAS
 */

function getEmployeeForName(req, res) {
    let companyId = req.params.idC;
    let employeeName = req.body.name;

    Company.findById(companyId, (err, companyFind) => {
        if (err) {
            res.status(500).send({ message: 'Server error trying to add a course!' });
        } else if (companyFind) {
            Company.aggregate([
                { $unwind: "$_id" },
                { $unwind: "$employees" },
                { $match: { "employees.name": employeeName } }
            ], (err, userCourse) => {
                if (err) {
                    res.status(500).send({ message: 'General server error!' });
                } else if (userCourse) {
                    res.status(200).send({ message: 'Empployees: ', employees: userCourse })
                } else {
                    res.status(404).send({ message: 'Courses not added' });
                }
            })
        } else {
            res.status(200).send({ message: 'Company does not exist!' });
        }
    })
}

function getEmployeeForJob(req, res) {
    let job = req.body.job;

    if (job) {
        Company.findOne({ 'employees.job': job }).exec((err, userCourse) => {
            if (err) {
                res.status(500).send({ message: 'General server error!' });
            } else if (userCourse) {
                res.status(200).send({ message: 'Courses: ', employees: userCourse.employees })
            } else {
                res.status(404).send({ message: 'Courses not added' });
            }
        })
    } else {
        res.status(200).send({ message: 'Ingrese un puesto' })
    }
}

function getEmployeeForDepartament(req, res) {
    let departament = req.body.departament;


    if (departament) {
        Company.findOne({ 'employees.departament': departament }).exec((err, userCourse) => {
            if (err) {
                res.status(500).send({ message: 'General server error!' });
            } else if (userCourse) {
                res.status(200).send({ message: 'Courses: ', employees: userCourse.employees })
            } else {
                res.status(404).send({ message: 'Courses not added' });
            }
        })
    } else {
        res.status(200).send({ message: 'Ingrese un departamento' })
    }

}


db.companies.find({
    "_id": ObjectId("603a781b05c8b1ad68ead127"),
    "employees._id": ObjectId("603a784c05c8b1ad68ead12a"),
}).pretty()
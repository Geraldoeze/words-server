exports.validateDepartment = (req, res, next) => {
    let data = req.body;

    const data_Types = ['department', 'courses']

    if (data?.department?.length < 2) {
        return res.status(400).json({message: "Department is too short", statusId:'FAILED'})
    }

    if (data?.courses?.length < 1) {
        return res.status(400).json({message: "Courses error", statusId:'FAILED'})

    }


    req.body = fieldFilters(data_Types, data)
    next();
}


// 
exports.validateUserUpdate = (req, res, next) => {
    let data = req.body;

    const data_Types = ['firstName', 'lastName', 'email', 'gender', 'id', 'origin', 'department',
                 'courses', 'address', 'contact', 'ninNumber', 'country', 'levelId', 'matric', 'fingerPrint'
    ]

    if (data?.firstName?.length < 2) {
        return res.status(400).json({message: "First Name is too short", statusId:'FAILED'})
    }

    if (data?.lastName?.length < 2) {
        return res.status(400).json({message: "Last Name is too short", statusId:'FAILED'})
    }

    if (data?.email?.length < 2) {
        return res.status(400).json({message: "Email is invalid", statusId:'FAILED'})
    }

    if (data?.gender?.length < 3) {
        return res.status(400).json({message: "Write gender in full", statusId:'FAILED'})
    }

    if (data?.id?.length < 5) {
        return res.status(400).json({message: "User Id not provided", statusId:'FAILED'})
    }

    // if (!!(data?.matric)) {
    //     return res.status(400).json({message: "matric  not provided", statusId:'FAILED'})
    // }

    if (data?.origin?.length < 3) {
        return res.status(400).json({message: "Origin not defined", statusId:'FAILED'})
    }

    if (data?.department?.length < 0) {
        return res.status(400).json({message: "Kindly select Department", statusId:'FAILED'})
    }

    if (data?.courses?.length < 2) {
        return res.status(400).json({message: "Courses are not complete", statusId:'FAILED'})
    }

    if (data?.address?.length < 4) {
        return res.status(400).json({message: "Address is too short", statusId:'FAILED'})
    }
    
    if (!data?.contact) {
        return res.status(400).json({message: "Contact  must be a provided", statusId:'FAILED'})
    }
    

    req.body = fieldFilters(data_Types, data)
    next(); 
}


// filters types to only ensure the specified array of fields passed are returned .
function fieldFilters(listOfFields, obj) {
    let returnedObject = {}
    const fieldKeys = Object.keys(obj);
    let filteredFileds = fieldKeys.filter(e => {
        if ((listOfFields.includes(e))) return true
        return false
    });
    filteredFileds.forEach(elem => {
        returnedObject = { ...returnedObject, [elem]: obj[elem] }
    })
    return returnedObject;
}
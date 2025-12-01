const adminMiddleware = async (req, res, next) => {

    try {

        const token = 'admin123'
        const isAdminAuthorized = token === 'admin123'

        if (!isAdminAuthorized) {

            res.status(401).send('UnAuthorized')
        }

        next()

    }

    catch (err) {

        console.log('err', err)
    }

}

const userMiddleware = async (req, res, next) => {


    try {


        const token = 'user123'
        const isAdminAuthorized = token === 'user123'

        if (!isAdminAuthorized) {

            res.status(401).send('UnAuthorized')
        }

        next()


    }

    catch (err) {

        console.log('err', err)
    }


}

module.exports = {
    adminMiddleware,
    userMiddleware
}
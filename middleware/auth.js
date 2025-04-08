const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
    // Skip authentication check
    next();
};

const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ error: 'Access denied. Admin only.' });
    }
    next();
};
const isOwner = async (req,res,next )=>{
    if (req.user.role !== 'owner'){
        return res.status(403).send({ error: 'Access denied. Owner only.' });
    }
    next();
}

module.exports = { auth, isAdmin, isOwner };
exports.isAutheticated = (req,res,next)=>{
    if(req.session.user) return next()
      return res.status(401).json({message:"Not Authenticated"})
}

exports.isadmin = (req,res,next)=>{

    if(req.session.admin && req.session.admin.role === 'admin') return next()
        return res.json({message:"Acssess Denied Admins ONLY"})
}
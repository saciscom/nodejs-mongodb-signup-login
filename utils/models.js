exports.getUser = (user) => {
    return {
        "id": user._id.toString(),
        "email": user.email,
        "name": user.name,
        "avatar": user.avatar
    }
};
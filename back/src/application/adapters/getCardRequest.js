module.exports = (req) => {
    let tags = req.query.tags ?? null;
    if (tags) {
        tags = tags.split(',');
    }

    return {
        tags,
    }
}
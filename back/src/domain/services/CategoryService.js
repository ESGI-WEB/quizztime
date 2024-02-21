const Category = require('../entities/Category');

class CategoryService {
    constructor() {
    }

    getNextCategoryFrom(category) {
        const categories = Object.values(Category);
        const index = categories.indexOf(category);
        if (index === -1) {
            return Category.FIRST;
        } else if (index >= categories.length - 1) {
            return Category.DONE;
        } else {
            return categories[index + 1];
        }
    }
}

module.exports = CategoryService;
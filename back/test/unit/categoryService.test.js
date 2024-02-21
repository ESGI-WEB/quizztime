const CategoryService = new (require('../../src/domain/services/CategoryService'));
const Category = require('../../src/domain/entities/Category');

describe('Category Service test', () => {
    it('should return SECOND for FIRST', () => {
        const result = CategoryService.getNextCategoryFrom(Category.FIRST);
        expect(result).toBe(Category.SECOND);
    });

    it('should return THIRD for SECOND', () => {
        const result = CategoryService.getNextCategoryFrom(Category.SECOND);
        expect(result).toBe(Category.THIRD);
    });

    it('should return FOURTH for THIRD', () => {
        const result = CategoryService.getNextCategoryFrom(Category.THIRD);
        expect(result).toBe(Category.FOURTH);
    });

    it('should return FIFTH for FOURTH', () => {
        const result = CategoryService.getNextCategoryFrom(Category.FOURTH);
        expect(result).toBe(Category.FIFTH);
    });

    it('should return SIXTH for FIFTH', () => {
        const result = CategoryService.getNextCategoryFrom(Category.FIFTH);
        expect(result).toBe(Category.SIXTH);
    });

    it('should return SEVENTH for SIXTH', () => {
        const result = CategoryService.getNextCategoryFrom(Category.SIXTH);
        expect(result).toBe(Category.SEVENTH);
    });

    it('should return DONE for SEVENTH', () => {
        const result = CategoryService.getNextCategoryFrom(Category.SEVENTH);
        expect(result).toBe(Category.DONE);
    });

    it('should return DONE for DONE', () => {
        const result = CategoryService.getNextCategoryFrom(Category.DONE);
        expect(result).toBe(Category.DONE);
    });

    it('should return FIRST for unknown', () => {
        const result = CategoryService.getNextCategoryFrom('unknown');
        expect(result).toBe(Category.FIRST);
    });
});
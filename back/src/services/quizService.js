const {PrismaClient} = require("@prisma/client");
const getQuizzes = async (user) => {
  const prisma = new PrismaClient()
  const quizzes = await prisma.quiz.findMany(
    {
        where: {
            ownerId: user.id
        }
    }
  );
  await prisma.$disconnect()
  return quizzes
}

module.exports = {
  getQuizzes
}
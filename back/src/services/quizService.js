const {PrismaClient} = require("@prisma/client");
const getQuizzes = async () => {
  const prisma = new PrismaClient()
  const quizzes = await prisma.quiz.findMany()
  await prisma.$disconnect()
  return quizzes
}

module.exports = {
  getQuizzes
}
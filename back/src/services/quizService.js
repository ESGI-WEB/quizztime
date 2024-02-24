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

const createQuiz = async (user, body) => {
    const prisma = new PrismaClient()

    const quizData = {
        title: body.title,
        maxUsers: isFinite(body.maxUsers) ? body.maxUsers : null,
        passcode: body.passcode?.length > 0 ? body.passcode : null,
        ownerId: user.id
    }

    const questions = body.questions.map(q => {
        return {
            question: q.question,
            choices: {
                create: q.choices.map(c => {
                    return {
                        choice: c.choice,
                        isCorrect: c.isCorrect
                    }
                }),
            }
        }
    });

    const quiz = await prisma.quiz.create(
        {
            data: {
                ...quizData,
                questions: {
                    create: questions
                }
            },
            include: {
                questions: {
                    include: {
                        choices: true
                    }
                }
            }
        }
    );
    await prisma.$disconnect()
    return quiz
}

module.exports = {
    getQuizzes,
    createQuiz,
}
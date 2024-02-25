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
    const bcrypt = require("bcryptjs");

    let hashedPasscode = null;
    if (body.passcode && body.passcode.length > 0) {
        hashedPasscode = await bcrypt.hash(body.passcode, 10);
    }

    const quizData = {
        title: body.title,
        maxUsers: isFinite(body.maxUsers) ? body.maxUsers : null,
        passcode: hashedPasscode,
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
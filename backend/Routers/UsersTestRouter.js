import { application, Router } from 'express';
import Question from '../Patterns/Question.js';
import Test from '../Patterns/Test.js';
import Users from '../Patterns/Users.js';
import UsersTest from '../Patterns/UsersTest.js';

const UsersTestRouter = Router(); 
const ID_PATTERN = new RegExp('[0-9]{7,9}');
const PASSCODE_PATTERN = new RegExp('[A-Z]{8}');

UsersTestRouter.get("/is_not_tested/:passcode/:userId", async (req, res) => {
    try {
        const { passcode, userId } = req.params;
        if (PASSCODE_PATTERN.test(passcode) && ID_PATTERN.test(userId)) {
            var testId;
            if (testId = await Test.exists({ password: passcode })) {
                if (await UsersTest.exists({ userId: userId, linkedTest: testId._id })) {
                    if (await UsersTest.exists({ userId: userId, linkedTest: testId._id, endTime: null })) {
                        res.json([true, true,testId._id])
                    }
                    else {
                        res.json([true, false]);
                    }
                }
                else res.json([false, "user not register to the test"]);
            }else res.json([false,"no test with this passcode"])
        }
        else res.json([false,"passcode or id invalid"]);
    } catch (error) {
        res.json([false, "Server error"]);
    }
})

UsersTestRouter.patch("/build_pesonal_quiz/:adminId/:adminPassword/:testId", async (req, res) => {
    try {
        const { adminId,adminPassword,testId } = req.params;
        const { userId, firstName, lastName } = req.body;
        console.log(ID_PATTERN.test(userId), ID_PATTERN.test(adminId),userId);
        if (ID_PATTERN.test(userId) && ID_PATTERN.test(adminId))
        {
            if (await Users.exists({ userId: adminId, password: adminPassword })) {
                if (await Test.exists({ _id: testId, admin: adminId })) {
                    const test = await Test.findById(testId);
                    if (!(await UsersTest.exists({ userId: userId, linkedTest: testId }))) {
                        const questions = await Question.find({ linkedTest: testId, active: true })
                        const userQuestions = [];
                        questions.sort((a, b) => 1 - Math.random()).slice(0, test.numOfQuestions).map((element, index) => {
                            const ans = [];
                            element.answers.map((e) => { e !== null ? ans.push(e.answer) : null });
                            userQuestions.push({
                                questions: element.question,
                                linkedQuestion: element._id,
                                answers: ans
                            })
                        })
                        const toSend = new UsersTest({
                            linkedTest: test._id,
                            firstName: firstName,
                            lastName: lastName,
                            userId: userId,
                            questions: userQuestions,
                        });
                        await toSend.save();
                        res.json([true, toSend]);
                    }
                    else res.json([false, "this user already assign the test"])
                }
                else res.json([false, "test not found or not active"]);
            } else res.json([false, "user not found"]);
        }
        else res.json([false,"false user id"])
    } catch (e) {
        console.log(e);
        res.json([false, "server error"]);
    }
})

UsersTestRouter.get("/get_all_examinees/:adminId/:adminPassword/:testId", async (req, res) => {
    try {
        const { adminId, adminPassword, testId } = req.params;
        if (ID_PATTERN.test(adminId)) {
            if (await Users.exists({ userId: adminId, password: adminPassword })) {
                if (await Test.exists({ _id: testId, admin: adminId })) {
                    const respone = await UsersTest.find({}, { firstName: true, lastName: true, userId: true, _id: true, endTime : true });
                    res.json([true, respone]);
                } else res.json([false, "this user isn't admin of the given test"]);
            } else res.json([false,"no such admin"])
        } else {
            res.json([false, "invalid user id"]);
        }
    } catch (error) {
        res.json([false, "server failed"]);
    }
})

UsersTestRouter.get("/get_all_possible_examinees/:adminId/:adminPassword",async (req, res) => {
    try {
        const { adminId, adminPassword } = req.params;
        if (ID_PATTERN.test(adminId)) {
            if (await Users.exists({ userId: adminId, password: adminPassword })) {
                const respone = await UsersTest.find({});
                const mapRespone = new Map()
                respone.forEach((element, index) => {
                    if (!mapRespone.has(element.userId)) {
                        mapRespone.set(element.userId, { userId : element.userId, firstName: element.firstName, lastName: element.lastName });
                    }
                })
                    res.json([true, [...mapRespone.values()]]);
            } else res.json([false,"no such admin"])
        } else {
            res.json([false, "invalid user id"]);
        }
    } catch (error) {
        res.json([false, "server failed"]);
    }
})

UsersTestRouter.get("get_personal_test/:userId/:testId", async (req, res) => {
    try {
        const { userId, testId } = req.params;
        if (await Test.exists({ _id: testId, active: true })) {
            if (await UsersTest.exists({ linkedTest: testId, userId: userId })) {
                res.json([true, await UsersTest.findOne({ linkedTest: testId, userId: userId })]);
            }
            else res.json([false, "user doesn't register to this test"]);
        }
        else res.json([false, "test not active"]);
    } catch (error) {
        res.json(["false", 'Server error']);
    }
});

UsersTestRouter.patch("/start_test/:testId/:usersId", async (req, res) => {
    try {
        const { testId, usersId } = req.params;
        if (ID_PATTERN.test(usersId))
        {
            if (await UsersTest.exists({ userId: usersId, linkedTest: testId, endTime : {$gt : Date.now()} })) {
                if (await Test.exists({ _id: testId, active: true })) {
                    const test = await Test.findOne({ _id: testId });
                    if (await UsersTest.exists({ userId: usersId, linkedTest: testId, endTime: null })) {
                        const _id = (await UsersTest.findOneAndUpdate({ userId: usersId, linkedTest: testId, endTime: { $gt: Date.now() } }, { startTime: Date.now(), endTime: (Date.now() + (1000 * 60 * test.duration)) }))._id;
                        res.json([true,await UsersTest.findById(_id)]);
                    }
                    else {
                        const _id = (await UsersTest.findOne({ userId: usersId, linkedTest: testId, endTime: { $gt: Date.now() } }))._id;
                        const userTest = await UsersTest.findById(_id);
                        const questions = [];
                        res.json([true,await UsersTest.findById(_id)]);
                    }
                }
                else res.json([false,"test close or not exist"])
            }
            else res.json([false,"test not found"])
        }
        else res.json([false,"false user id"])
    } catch (error) {
        console.log(error);
        res.json([false, "server error"]);
    }
});

UsersTestRouter.patch("/end_test/:testId/:usersId", async (req, res) => {
    try {
        const { testId, usersId } = req.params;
        if (ID_PATTERN.test(usersId))
        {
            if (await UsersTest.exists({ userId: usersId, linkedTest: testId, endTime : {$gt : Date.now()}  })) {
                if (await Test.exists({ _id: testId, active: true })) {
                    const test = await Test.findOne({ _id: testId });
                    await UsersTest.findOneAndUpdate({ userId: usersId, linkedTest: testId }, {endTime : Date.now()});
                    res.json([true,"the test end"]);
                }
                else res.json([false,"test close or not exist"])
            }
            else res.json([false,"test not found"])
        }
        else res.json([false,"false user id"])
    } catch (error) {
        res.json([false, "server error"]);
    }
});

export default UsersTestRouter;
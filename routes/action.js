const express = require('express');
const { Action } = require('../models');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        // 로그인한 사용자가 그동안 저장한 활동 내역을 모두 가져옴
        const actions = await Action.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
        });
        
        // views/action.html 파일을 렌더링하며 데이터를 보냄
        res.render('action', {
            title: '오늘의 탄소발자국 미션 - 온(On):체감',
            actions, // DB에서 가져온 내역
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 사용자가 실천 버튼을 눌렀을 때 저장하는 API
router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        await Action.create({
            content: req.body.content,
            reduction: req.body.reduction,
            userId: req.user.id, // 세션에서 로그인한 유저의 ID를 가져옴
        });
        res.status(201).send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/', isLoggedIn, async (req, res, next) => {
    try {
        await Action.destroy({
            where: {
                content: req.body.content,
                userId: req.user.id
            }
        });
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
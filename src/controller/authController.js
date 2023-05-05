const User = require('../models/user');
const otpModel = require('../models/otp');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const otp = require('../models/otp');
const vetifyToken = require('../middleware/vetifyToken');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
let refreshTokenList = [];
class AuthController {
    async sendOTP(req, res) {
        try {
            const exitsUser = await User.findOne({ email: req.body.email });
            if (exitsUser) {
                return res.json({
                    code: 400,
                    message: 'This email address already exists',
                });
            }
            console.log(exitsUser);
            const OTP = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            });
            console.log(OTP);
            const salt = await bcrypt.genSalt(10);
            const hashedOTP = await bcrypt.hash(OTP, salt);
            const email = req.body.email;
            const newOTP = await new otpModel({
                email: req.body.email,
                otp: hashedOTP,
            });

            await newOTP.save();

            // const mailOptions = {
            //     from: 'noreply@myapp.com',
            //     to: email,
            //     subject: 'OTP for verification',
            //     text: `Your OTP for verification is: ${OTP}`,
            // };
            // try {
            //     await sgMail.send(mailOptions);
            //     console.log(`Sent mail to ${email} with OTP ${OTP}`);
            //     res.status(200).json({
            //         success: true,
            //         message: 'OTP sent to email successfully',
            //     });
            // } catch (error) {
            //     console.log(`Error sending email to ${email}: ${error}`);
            //     res.status(500).json({
            //         success: false,
            //         message: 'Error sending OTP to email',
            //     });
            // }
        } catch (error) {
            res.status(500).json(error);
        }
    }
    async signUp(req, res, next) {
        const email = req.body.email;
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(req.body.password, salt);
        // const getOTPFromDB = await otpModel.findOneAndDelete({ email });
        // const isValidOTP = await bcrypt.compare(req.body.otp, getOTPFromDB.otp);
        // if (!isValidOTP) {
        //     console.log(`Email ${email} verified successfully`);
        //     return res.status(500).json({
        //         success: false,
        //         message: 'Error verified email',
        //     });
        // }
        const newUser = await new User({
            email: req.body.email,
            password: hasedPassword,
            name: req.body.name ? req.body.name : email.split('@')[0],
            age: req.body.age,
        });

        newUser.save().then((user) => res.status(200).json(user));
    }
    generateAccessToken(user) {
        return jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: '1h' }
        );
    }
    generateRefreshToken(user) {
        return jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: '365d' }
        );
    }

    async signIn(req, res, next) {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.json({
                code: 404,
                message: 'User not found',
            });
        }
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            return res.json({
                code: 404,
                message: 'Invalid password',
            });
        }
        if (user && validPassword) {
            const accessToken = new AuthController().generateAccessToken(user);
            const refreshToken = new AuthController().generateRefreshToken(
                user
            );
            refreshTokenList.push(refreshToken);
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });
            const { password, ...others } = user._doc;
            return res.status(200).json({ ...others, accessToken });
        }
    }
    async logout(req, res) {
        refreshTokenList = refreshTokenList.filter(
            (token) => token !== res.cookies.refresh_token
        );
        res.clearCookie('refresh_token');
    }
    async refreshTokenKey(req, res) {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json('You are not authenticated');
        }
        if (!refreshTokenList.includes(refreshToken)) {
            return res.status(403).json('Refresh token is not valid');
        }
        refreshTokenList.filter((token) => token !== refreshToken);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
            if (err) {
                console.log(err);
                return;
            }
            const newAccessToken = new AuthController().generateAccessToken(
                user
            );
            const newRefreshToken = new AuthController().generateRefreshToken(
                user
            );
            refreshTokenList.push(newRefreshToken);
            res.cookie('refresh_token', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });
            return res.status(200).json({ accessToken: newAccessToken });
        });
    }
    async forgotPassword(req, res) {}
    async editPassword(req, res) {
        const infoUser = await User.findOne({ _id: req.user.id });
        const isValidPassword = await bcrypt.compare(
            req.body.oldPassword,
            infoUser.password
        );
        if (!isValidPassword) {
            return res.status(403).json('Wrong password');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
        User.updateOne(
            { _id: req.user.id },
            { $set: { password: hashedPassword } }
        ).then(() =>
            User.findOne({ _id: req.user.id }).then((user) =>
                res.status(200).json(user)
            )
        );
    }
    async removeUser(req, res) {
        User.deleteOne({ _id: req.params.id });
    }
}
module.exports = new AuthController();

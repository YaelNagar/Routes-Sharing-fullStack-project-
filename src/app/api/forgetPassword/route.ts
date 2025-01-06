import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Auth from '@/app/lib/models/authModel';
import connect from '@/app/lib/DB/connectDB';
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase();
        await connect();
        
        const auth = await Auth.findOne({ email: normalizedEmail });
        
        if (!auth) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        
        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 5);

        auth.otp = otp;
        auth.otpExpiration = otpExpiration;
        await auth.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "routesharingapp@gmail.com",
                pass: 'dzkd eosk eevd tfgl',
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: 'routesharingapp@gmail.com',
            replyTo: 'routesharingnorepley@gmail.com',
            to: email,
            subject: 'Your OTP for password reset',
            text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email: ', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return NextResponse.json(
            { message: 'OTP sent to email' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json(
            { error: 'Error sending OTP' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {

    const { email, password, otp } = await request.json();
    await connect();

    try {
        if (otp) {
            // Verify OTP
            return await verifyOtp(email, otp);
        } else if (password) {
            // Update password
            return await updatePassword(email, password);
        } else {
            return NextResponse.json(
                { error: 'Email, OTP, or password is required' },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Error in PUT request:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// Function to verify OTP
async function verifyOtp(email: string, otp: string) {
    const normalizedEmail = email.toLowerCase();
    try {
        const user = await Auth.findOne({ email: normalizedEmail });
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const now = new Date();
        const otpExpiration = new Date(user.otpExpiration);

        if (user.otp !== otp || now > otpExpiration) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'OTP verified' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// Function to update password
async function updatePassword(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const auth = await Auth.findOne({ email: normalizedEmail });
        if (!auth) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        auth.password = hashedPassword;
        await auth.save();

        return NextResponse.json(
            { success: 'Password updated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating password:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

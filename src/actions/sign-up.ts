'use server';

import bcrypt from 'bcrypt';

import { connectToDb } from '@/lib/connect-to-db';
import { authStrings, errorStrings } from '@/lib/constants';
import { FormResponse, userSchema } from '@/lib/types';

const SALT_ROUNDS = 10;

export type SignUpData = {
  email: string;
  password: string;
  repeatedPassword: string;
};

export async function signUp({
  email,
  password,
  repeatedPassword,
}: SignUpData): Promise<FormResponse> {
  if (!email || !password || !repeatedPassword) {
    return {
      success: false,
      message: errorStrings.allFieldsAreRequired,
    };
  }

  const parsedResult = userSchema.safeParse({
    email,
    password,
  });

  if (!parsedResult.success) {
    const zodMessage = parsedResult.error.issues[0].message;
    const zodCode = parsedResult.error.issues[0].code;

    if (zodCode === 'too_small') {
      return {
        success: false,
        message: zodMessage,
      };
    }

    return {
      success: false,
      message: zodMessage,
    };
  }

  const { email: parsedEmail, password: parsedPassword } = parsedResult.data;

  if (parsedPassword !== repeatedPassword) {
    return {
      success: false,
      message: errorStrings.passwordsDoNotMatch,
    };
  }

  const { usersCollection } = await connectToDb();
  const existingUser = await usersCollection.findOne({ email: parsedEmail });
  if (existingUser) {
    return {
      success: false,
      message: errorStrings.userAlreadyExists,
    };
  }

  const hashedPassword = await bcrypt.hash(parsedPassword, SALT_ROUNDS);

  const newUser = {
    email: parsedEmail,
    password: hashedPassword,
    name: null,
    emailVerified: null,
    image: null,
  };

  await usersCollection.insertOne(newUser);

  return {
    success: true,
    message: authStrings.userCreatedSuccessfully,
  };
}
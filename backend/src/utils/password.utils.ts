import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const generateRandomPassword = (): string => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    password += charset.match(/[a-z]/)![0];
    password += charset.match(/[A-Z]/)![0];
    password += charset.match(/[0-9]/)![0];
    password += charset.match(/[!@#$%^&*]/)![0];

    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password.split('').sort(() => Math.random() - 0.5).join('');
};
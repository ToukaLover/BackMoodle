import * as bcrypt from 'bcrypt';

export async function hash(password) {
    const hashPass = await bcrypt.hash(password, 10)
    return hashPass;
}

export async function deHash(password,foundUserPass) {
    const isMatch = await bcrypt.compare(password, foundUserPass);
    return isMatch
}
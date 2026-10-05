import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const mockUsers: any[] = [
  { id: 1, name: 'Super Admin', email: 'admin@test.com', password: '', role: 'ADMIN' },
  { id: 2, name: 'Test Partner', email: 'partner@test.com', password: '', role: 'PARTNER' }
];

const initializeDefaultUsers = async () => {
  const hashedPassword = await bcrypt.hash('123456', 10);
  mockUsers[0].password = hashedPassword;
  mockUsers[1].password = hashedPassword;
  console.log('✅ Default users initialized with password: 123456');
};

initializeDefaultUsers();

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    if (mockUsers.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: mockUsers.length + 1, name, email, password: hashedPassword, role: role || 'PARTNER' };
    mockUsers.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, name, email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = mockUsers.find(u => u.email === email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
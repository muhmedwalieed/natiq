import { User } from '../models/index.js';
import ApiError from '../utils/apiError.js';
import { ROLES } from '../constants/index.js';
import BaseController from './baseController.js';

class AdminUserController extends BaseController {

  createUser = this.catchAsync(async (req, res) => {
    const { name, email, password, phone, role, profileImage } = req.body;

    if (req.userRole === ROLES.TEAM_LEADER && role === ROLES.COMPANY_MANAGER) {
      throw ApiError.forbidden('Team leaders cannot create company managers');
    }

    const existing = await User.findOne({ companyId: req.companyId, email });
    if (existing) {
      throw ApiError.conflict('User with this email already exists in this company');
    }

    const user = await User.create({
      companyId: req.companyId,
      name,
      email,
      passwordHash: password,
      phone: phone || null,
      role,
      profileImage: profileImage || null,
    });

    this.sendSuccess(res, { user: user.toJSON() }, 'User created successfully', 201);
  });

  listUsers = this.catchAsync(async (req, res) => {
    const { page = 1, limit = 20, role, isActive, search } = req.query;

    const filter = { companyId: req.companyId };
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select('-passwordHash');

    this.sendPaginated(res, users, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    });
  });

  getUser = this.catchAsync(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, companyId: req.companyId })
      .select('-passwordHash');
    if (!user) throw ApiError.notFound('User not found');
    this.sendSuccess(res, { user });
  });

  updateUser = this.catchAsync(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, companyId: req.companyId });
    if (!user) throw ApiError.notFound('User not found');

    const allowed = ['name', 'phone', 'role', 'isActive', 'profileImage'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    this.sendSuccess(res, { user: user.toJSON() }, 'User updated successfully');
  });

  deleteUser = this.catchAsync(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, companyId: req.companyId });
    if (!user) throw ApiError.notFound('User not found');

    user.isActive = false;
    await user.save();
    this.sendSuccess(res, null, 'User deactivated successfully');
  });

}

export default new AdminUserController();

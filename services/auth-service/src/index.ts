import bcrypt from "bcryptjs";
import {
  createServiceApp,
  success,
  error,
  asyncHandler,
  authMiddleware,
  signToken,
  registerSchema,
  loginSchema,
  SERVICE_PORTS,
} from "@pkf/shared";
import { prisma } from "@pkf/database";

const app = createServiceApp("auth-service");

app.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return error(res, parsed.error.issues[0].message);

    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return error(res, "Email already registered", 409);

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, role: true, isPremium: true, premiumBadge: true },
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
      premiumBadge: user.premiumBadge,
    });

    success(res, { user, token }, 201);
  })
);

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return error(res, parsed.error.issues[0].message);

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user?.password) return error(res, "Invalid credentials", 401);

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) return error(res, "Invalid credentials", 401);

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
      premiumBadge: user.premiumBadge,
    });

    success(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
        premiumBadge: user.premiumBadge,
        image: user.image,
      },
      token,
    });
  })
);

app.get(
  "/me",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, name: true, email: true, role: true,
        isPremium: true, premiumBadge: true, image: true,
        membership: true,
      },
    });
    if (!user) return error(res, "User not found", 404);
    success(res, user);
  })
);

app.get(
  "/users",
  authMiddleware,
  asyncHandler(async (req, res) => {
    if (req.user!.role !== "ADMIN") return error(res, "Forbidden", 403);
    const users = await prisma.user.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, isPremium: true, createdAt: true },
    });
    success(res, users);
  })
);

const PORT = process.env.PORT || SERVICE_PORTS.AUTH;
app.listen(PORT, () => console.log(`🔐 Auth Service running on :${PORT}`));

export default app;

import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
  accessSecret:
    "ee1d949c31d30ff11676339d802c4b8752a19c17eda164b52e11ac194cbd6114",
  refreshSecret:
    process.env.JWT_REFRESH_SECRET || "your-super-secret-refresh-key",
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
}));

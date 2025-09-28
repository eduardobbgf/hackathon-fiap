import { Controller, Get, HttpStatus, HttpCode } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return {
      status: "ok",
      message: "Service is healthy",
      timestamp: new Date().toISOString(),
    };
  }
}

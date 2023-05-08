import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.metadata';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userFromDB = await this.usersService.findOne(user.id);

    if (!userFromDB) {
      return false;
    }

    this.logger.log(`User ${userFromDB.email} has roles ${userFromDB.roles}`);
    return requiredRoles.some((role) => userFromDB.roles?.includes(role));
  }
}

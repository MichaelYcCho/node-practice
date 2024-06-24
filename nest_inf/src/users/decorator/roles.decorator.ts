import { SetMetadata } from '@nestjs/common'
import { RolesEnum } from '../const/roles.const'

export const ROLES_KEY = 'user_roles'

// @Roles(RolesEnum.ADMIN)
// setMetadata를 이용하여 roles key에 role을 저장
export const Roles = (role: RolesEnum) => SetMetadata(ROLES_KEY, role)

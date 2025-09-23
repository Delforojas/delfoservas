<?php

namespace App\Entity\Enum;

enum RoleEnum: string
{
    case ADMIN = 'ROLE_ADMIN';
    case TEACHER = 'ROLE_TEACHER';
    case USER = 'ROLE_USER';
}
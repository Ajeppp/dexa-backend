import {
  Controller,
  Get,
  UseGuards,
  Request,
  ForbiddenException,
  Patch,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll(@Request() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Unauthorized User!');
    }

    return this.employeesService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
    @Request() req: any,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Unauthorized User!');
    }
    return this.employeesService.update(Number(id), updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Unauthorized User!');
    }
    return this.employeesService.remove(Number(id));
  }
}

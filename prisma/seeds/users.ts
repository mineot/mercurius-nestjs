import { PrismaClient, User } from '@prisma/client';
import { Seeder } from '../helper/seeder';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class UserSeeder extends Seeder {
  startMessage(): string {
    return 'Seeding Users';
  }

  finishMessage(): string {
    return 'Seeding Users';
  }

  errorMessage(): string {
    return 'Seeding Users Failed';
  }
  async finish(): Promise<void> {
    return await prisma.$disconnect();
  }

  async process(): Promise<void> {
    const user: User = await this.userData();
    const exists: boolean = await this.exists(user.email);

    this.infoMesage('User:', user.name);

    if (exists) {
      this.warnMessage('User Already Seeded');
    } else {
      await prisma.user.create({ data: user });
      this.successMessage('Success Seeded');
    }
  }

  private async userData(): Promise<User> {
    return {
      id: undefined,
      name: 'Administrator',
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin!123987', 10),
    };
  }

  private async exists(email: string): Promise<boolean> {
    const counter = await prisma.user.count({
      where: { email },
    });

    return counter > 0;
  }
}

export const userSeeder: UserSeeder = new UserSeeder();

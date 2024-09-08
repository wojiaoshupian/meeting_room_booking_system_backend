import { MigrationInterface, QueryRunner } from "typeorm";

export class Data1725793523447 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("INSERT INTO `users` VALUES (1,'zhangsan','96e79218965eb72c92a549dd5a330112','张三1',NULL,NULL,'13233323333',0,1,'2024-09-08 08:22:23.828938','2024-09-08 08:22:23.828938',0),(2,'lisi','e3ceb5881a0a1fdaad01296d7554868d','李四',NULL,NULL,NULL,0,0,'2024-09-08 08:22:23.836659','2024-09-08 08:22:23.836659',0);")
        await queryRunner.query("INSERT INTO `permissions` VALUES (1,'ccc','访问 ccc 接口'),(2,'ddd','访问 ddd 接口');")
        await queryRunner.query("INSERT INTO `roles` VALUES (1,'管理员'),(2,'普通用户');")
        await queryRunner.query("INSERT INTO `user_roles` VALUES (1,1),(2,2);")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

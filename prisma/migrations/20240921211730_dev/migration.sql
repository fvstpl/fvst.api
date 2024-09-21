/*
  Warnings:

  - You are about to drop the column `CategoriesId` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `shopsId` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `adress` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Users` table. All the data in the column will be lost.
  - You are about to alter the column `dob` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- DropForeignKey
ALTER TABLE `Products` DROP FOREIGN KEY `Products_CategoriesId_fkey`;

-- DropForeignKey
ALTER TABLE `Products` DROP FOREIGN KEY `Products_shopsId_fkey`;

-- DropIndex
DROP INDEX `Categories_id_key` ON `Categories`;

-- DropIndex
DROP INDEX `Meta_id_key` ON `Meta`;

-- DropIndex
DROP INDEX `Payments_id_key` ON `Payments`;

-- DropIndex
DROP INDEX `Payouts_id_key` ON `Payouts`;

-- DropIndex
DROP INDEX `Products_id_key` ON `Products`;

-- DropIndex
DROP INDEX `Servers_id_key` ON `Servers`;

-- DropIndex
DROP INDEX `ShopStats_id_key` ON `ShopStats`;

-- DropIndex
DROP INDEX `Shops_id_key` ON `Shops`;

-- DropIndex
DROP INDEX `Users_id_key` ON `Users`;

-- AlterTable
ALTER TABLE `Categories` ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Meta` ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Payments` ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Payouts` ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Products` DROP COLUMN `CategoriesId`,
    DROP COLUMN `shopsId`,
    ADD COLUMN `categoriesId` VARCHAR(191) NULL,
    ADD COLUMN `shopId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Servers` ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `ShopStats` ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Shops` ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `adress`,
    DROP COLUMN `firstname`,
    DROP COLUMN `lastname`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL,
    MODIFY `dob` DATETIME(3) NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_categoriesId_fkey` FOREIGN KEY (`categoriesId`) REFERENCES `Categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shops`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

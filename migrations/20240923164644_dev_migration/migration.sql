/*
  Warnings:

  - You are about to drop the column `balance` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `fee` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `oldBalance` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `team` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `teamMembers` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payouts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Servers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShopStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Categories` DROP FOREIGN KEY `Categories_shopId_fkey`;

-- DropForeignKey
ALTER TABLE `Payouts` DROP FOREIGN KEY `Payouts_shopId_fkey`;

-- DropForeignKey
ALTER TABLE `Products` DROP FOREIGN KEY `Products_categoriesId_fkey`;

-- DropForeignKey
ALTER TABLE `Products` DROP FOREIGN KEY `Products_shopId_fkey`;

-- DropForeignKey
ALTER TABLE `Servers` DROP FOREIGN KEY `Servers_shopId_fkey`;

-- DropForeignKey
ALTER TABLE `ShopStats` DROP FOREIGN KEY `ShopStats_shopId_fkey`;

-- AlterTable
ALTER TABLE `Shops` DROP COLUMN `balance`,
    DROP COLUMN `fee`,
    DROP COLUMN `level`,
    DROP COLUMN `oldBalance`,
    DROP COLUMN `team`,
    DROP COLUMN `teamMembers`;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `address`,
    DROP COLUMN `dob`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lastName`;

-- DropTable
DROP TABLE `Categories`;

-- DropTable
DROP TABLE `Meta`;

-- DropTable
DROP TABLE `Payments`;

-- DropTable
DROP TABLE `Payouts`;

-- DropTable
DROP TABLE `Products`;

-- DropTable
DROP TABLE `Servers`;

-- DropTable
DROP TABLE `ShopStats`;
